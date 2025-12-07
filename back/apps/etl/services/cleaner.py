import pandas as pd
import os

class DataCleaner:
    def process_file(self, file_path):
        """
        Logique métier ETL : Lit le fichier, nettoie, valide.
        """
        try:
            # Exemple simple : Lire Excel
            df = pd.read_excel(file_path)
            
            # Nettoyage fictif : Supprimer lignes vides
            initial_rows = len(df)
            df.dropna(inplace=True)
            cleaned_rows = len(df)
            
            # Sauvegarder version propre (optionnel)
            clean_path = file_path + "_cleaned.csv"
            df.to_csv(clean_path, index=False)
            
            return {
                "success": True,
                "rows_raw": initial_rows,
                "rows_clean": cleaned_rows,
                "clean_file": clean_path
            }
        except Exception as e:
            return {"success": False, "error": str(e)}