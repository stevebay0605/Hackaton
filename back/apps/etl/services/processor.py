"""
Service de traitement ETL pour les fichiers uploadés
"""
import pandas as pd
import io
from django.core.files.base import ContentFile
from django.utils import timezone
from apps.datacatalog.models import Indicator, Category, DataModel
from apps.accounts.models import User


class ETLProcessor:
    """Classe pour traiter les fichiers ETL"""
    
    def __init__(self, raw_upload, visibility='PRIVATE'):
        self.raw_upload = raw_upload
        self.category = raw_upload.category
        self.user = raw_upload.uploaded_by
        self.visibility = visibility  # PUBLIC ou PRIVATE
        self.processed_data = None
        self.output_file = None
    
    def process(self):
        """Traiter le fichier et créer les indicateurs"""
        try:
            # Lire le fichier
            self.processed_data = self._read_file()
            
            # Nettoyer les données
            self.processed_data = self._clean_data()
            
            # Valider les données
            validation_result = self._validate_data()
            if not validation_result['valid']:
                raise ValueError(f"Validation échouée: {validation_result['errors']}")
            
            # Créer les indicateurs
            created_indicators = self._create_indicators()
            
            # Générer le fichier XLS de sortie
            self.output_file = self._generate_output_file()
            
            # Mettre à jour le statut
            self.raw_upload.status = self.raw_upload.STATUS_COMPLETED
            self.raw_upload.processing_completed_at = timezone.now()
            self.raw_upload.total_rows = len(self.processed_data)
            self.raw_upload.processed_rows = len(created_indicators)
            self.raw_upload.failed_rows = len(self.processed_data) - len(created_indicators)
            self.raw_upload.report = f"Traitement complété: {len(created_indicators)} indicateurs créés"
            self.raw_upload.save()
            
            return {
                'success': True,
                'total_rows': self.raw_upload.total_rows,
                'processed_rows': self.raw_upload.processed_rows,
                'failed_rows': self.raw_upload.failed_rows,
                'output_file': self.output_file,
                'message': self.raw_upload.report
            }
        
        except Exception as e:
            self.raw_upload.status = self.raw_upload.STATUS_FAILED
            self.raw_upload.error_message = str(e)
            self.raw_upload.processing_completed_at = timezone.now()
            self.raw_upload.save()
            
            return {
                'success': False,
                'error': str(e)
            }
    
    def _read_file(self):
        """Lire le fichier (CSV ou Excel)"""
        file_path = self.raw_upload.file.path
        
        if self.raw_upload.file_format == 'CSV':
            # Essayer différents séparateurs
            try:
                # Essayer d'abord avec virgule
                df = pd.read_csv(file_path, encoding='utf-8', sep=',')
            except Exception:
                try:
                    # Essayer avec point-virgule
                    df = pd.read_csv(file_path, encoding='utf-8', sep=';')
                except Exception:
                    try:
                        # Essayer avec tabulation
                        df = pd.read_csv(file_path, encoding='utf-8', sep='\t')
                    except Exception:
                        # Utiliser la détection automatique
                        df = pd.read_csv(file_path, encoding='utf-8', sep=None, engine='python')
        elif self.raw_upload.file_format == 'EXCEL':
            df = pd.read_excel(file_path)
        else:
            raise ValueError(f"Format non supporté: {self.raw_upload.file_format}")
        
        return df
    
    def _clean_data(self):
        """Nettoyer les données"""
        df = self.processed_data.copy()
        
        # Supprimer les lignes vides
        df = df.dropna(how='all')
        
        # Supprimer les espaces inutiles
        df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)
        
        # Renommer les colonnes en minuscules
        df.columns = df.columns.str.lower().str.strip()
        
        return df
    
    def _validate_data(self):
        """Valider les données - Très flexible, accepte n'importe quel format"""
        errors = []
        
        # Vérifier qu'il y a au moins une colonne
        if len(self.processed_data.columns) == 0:
            errors.append("Le fichier n'a pas de colonnes")
        
        # Vérifier qu'il y a au moins une ligne
        if len(self.processed_data) == 0:
            errors.append("Le fichier est vide")
        
        # C'est tout ! Accepter n'importe quel format
        return {
            'valid': len(errors) == 0,
            'errors': errors
        }
    
    def _create_indicators(self):
        """Créer les indicateurs en base de données - Très flexible"""
        created_indicators = []
        
        # Obtenir ou créer le modèle de données
        data_model, _ = DataModel.objects.get_or_create(
            name=self.category.name,
            defaults={'description': f'Modèle pour {self.category.name}'}
        )
        
        # Obtenir toutes les colonnes
        columns = self.processed_data.columns.tolist()
        
        # Déterminer les colonnes à utiliser (très flexible)
        title_col = next((col for col in columns if col in ['title', 'nom', 'name', 'label', 'indicateur', 'indicator']), columns[0] if columns else None)
        desc_col = next((col for col in columns if col in ['description', 'desc', 'détails', 'details', 'définition', 'definition']), columns[1] if len(columns) > 1 else None)
        
        # Si pas de colonnes trouvées, utiliser les deux premières
        if not title_col and columns:
            title_col = columns[0]
        if not desc_col and len(columns) > 1:
            desc_col = columns[1]
        
        for idx, row in self.processed_data.iterrows():
            try:
                # Récupérer le titre (obligatoire)
                if title_col:
                    title = str(row.get(title_col, '')).strip()
                else:
                    title = f'Indicateur {idx}'
                
                # Récupérer la description (optionnelle)
                if desc_col:
                    description = str(row.get(desc_col, '')).strip()
                else:
                    # Utiliser les autres colonnes comme description
                    other_cols = [col for col in columns if col not in [title_col, desc_col]]
                    description = ' | '.join([f"{col}: {row.get(col, '')}" for col in other_cols[:3]])
                
                # Ignorer les lignes vides
                if not title or title.lower() == 'nan':
                    continue
                
                # Créer l'indicateur avec la visibilité spécifiée
                indicator = Indicator.objects.create(
                    title=title,
                    description=description,
                    category=self.category,
                    data_model=data_model,
                    visibility=self.visibility,  # Utiliser la visibilité spécifiée
                    file_format='EXCEL',
                    uploaded_by=self.user,
                    is_processed=True,
                    processing_notes=f'Créé via ETL le {timezone.now().strftime("%Y-%m-%d %H:%M:%S")}'
                )
                
                created_indicators.append(indicator)
            
            except Exception as e:
                print(f"Erreur lors de la création de l'indicateur {idx}: {str(e)}")
                continue
        
        return created_indicators
    
    def _generate_output_file(self):
        """Générer le fichier XLS de sortie"""
        # Créer un DataFrame avec les résultats
        output_data = {
            'Title': [],
            'Description': [],
            'Category': [],
            'Status': [],
            'Created At': []
        }
        
        # Récupérer les indicateurs créés
        indicators = Indicator.objects.filter(
            category=self.category,
            uploaded_by=self.user,
            created_at__gte=self.raw_upload.processing_started_at
        )
        
        for indicator in indicators:
            output_data['Title'].append(indicator.title)
            output_data['Description'].append(indicator.description)
            output_data['Category'].append(indicator.category.name)
            output_data['Status'].append('Créé')
            output_data['Created At'].append(indicator.created_at.strftime("%Y-%m-%d %H:%M:%S"))
        
        df_output = pd.DataFrame(output_data)
        
        # Créer le fichier Excel
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df_output.to_excel(writer, sheet_name='Résultats', index=False)
        
        output.seek(0)
        
        return ContentFile(
            output.getvalue(),
            name=f'etl_output_{self.raw_upload.id}.xlsx'
        )
