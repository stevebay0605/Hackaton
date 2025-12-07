"""
Script pour initialiser les données de base du projet HISWACA
À exécuter avec: python manage.py shell < init_data.py
"""

from django.contrib.auth import get_user_model
from apps.datacatalog.models import Category, DataModel, Indicator
from apps.access_request.models import AccessRequest

User = get_user_model()

print("=" * 60)
print("Initialisation des donnees HISWACA")
print("=" * 60)

# 1. Créer les catégories
print("\n[1] Creation des categories...")
categories_data = [
    {'name': 'Santé', 'description': 'Données relatives à la santé publique'},
    {'name': 'Éducation', 'description': 'Données relatives à l\'éducation'},
    {'name': 'Économie', 'description': 'Données économiques et financières'},
    {'name': 'Démographie', 'description': 'Données démographiques et population'},
    {'name': 'Agriculture', 'description': 'Données agricoles et rurales'},
]

categories = {}
for cat_data in categories_data:
    cat, created = Category.objects.get_or_create(
        name=cat_data['name'],
        defaults={'description': cat_data['description']}
    )
    categories[cat_data['name']] = cat
    status = "[OK] Creee" if created else "[SKIP] Existe deja"
    print(f"   {status}: {cat_data['name']}")

# 2. Créer les modèles de données
print("\n[2] Creation des modeles de donnees...")
data_models_data = [
    {
        'name': 'Santé Publique',
        'description': 'Modèle standard pour les données de santé',
        'schema': {
            'fields': [
                {'name': 'date', 'type': 'date'},
                {'name': 'region', 'type': 'string'},
                {'name': 'cases', 'type': 'integer'},
                {'name': 'deaths', 'type': 'integer'},
                {'name': 'recovered', 'type': 'integer'}
            ]
        }
    },
    {
        'name': 'Éducation',
        'description': 'Modèle standard pour les données d\'éducation',
        'schema': {
            'fields': [
                {'name': 'year', 'type': 'integer'},
                {'name': 'school', 'type': 'string'},
                {'name': 'students', 'type': 'integer'},
                {'name': 'teachers', 'type': 'integer'},
                {'name': 'pass_rate', 'type': 'float'}
            ]
        }
    },
    {
        'name': 'Économie',
        'description': 'Modèle standard pour les données économiques',
        'schema': {
            'fields': [
                {'name': 'year', 'type': 'integer'},
                {'name': 'sector', 'type': 'string'},
                {'name': 'gdp', 'type': 'float'},
                {'name': 'growth_rate', 'type': 'float'}
            ]
        }
    }
]

data_models = {}
for dm_data in data_models_data:
    dm, created = DataModel.objects.get_or_create(
        name=dm_data['name'],
        defaults={
            'description': dm_data['description'],
            'schema': dm_data['schema']
        }
    )
    data_models[dm_data['name']] = dm
    status = "[OK] Cree" if created else "[SKIP] Existe deja"
    print(f"   {status}: {dm_data['name']}")

# 3. Créer des utilisateurs de test
print("\n[3] Creation des utilisateurs de test...")
users_data = [
    {
        'username': 'admin@ins.org',
        'email': 'admin@ins.org',
        'password': 'admin123',
        'first_name': 'Admin',
        'last_name': 'HISWACA',
        'role': User.IS_ADMIN,
        'organization': 'INS Congo',
        'phone': '+243123456789'
    },
    {
        'username': 'partner@sante.org',
        'email': 'partner@sante.org',
        'password': 'partner123',
        'first_name': 'Jean',
        'last_name': 'Dupont',
        'role': User.IS_PARTNER,
        'organization': 'Ministère de la Santé',
        'phone': '+243987654321'
    },
    {
        'username': 'partner@education.org',
        'email': 'partner@education.org',
        'password': 'partner123',
        'first_name': 'Marie',
        'last_name': 'Martin',
        'role': User.IS_PARTNER,
        'organization': 'Ministère de l\'Éducation',
        'phone': '+243111222333'
    }
]

for user_data in users_data:
    password = user_data.pop('password')
    user, created = User.objects.get_or_create(
        username=user_data['username'],
        defaults=user_data
    )
    if created:
        user.set_password(password)
        user.save()
        status = "[OK] Cree"
    else:
        status = "[SKIP] Existe deja"
    print(f"   {status}: {user_data['username']} ({user_data['role']})")

# 4. Créer des indicateurs de test
print("\n[4] Creation des indicateurs de test...")

admin_user = User.objects.get(username='admin@ins.org')

indicators_data = [
    {
        'title': 'Taux de Mortalité Infantile 2024',
        'description': 'Taux de mortalité infantile par région',
        'category': 'Santé',
        'data_model': 'Santé Publique',
        'visibility': Indicator.VISIBILITY_PUBLIC,
        'file_format': 'CSV',
        'is_processed': True,
        'processing_notes': 'Données validées et nettoyées'
    },
    {
        'title': 'Taux de Scolarisation Primaire',
        'description': 'Taux de scolarisation au niveau primaire par région',
        'category': 'Éducation',
        'data_model': 'Éducation',
        'visibility': Indicator.VISIBILITY_PUBLIC,
        'file_format': 'CSV',
        'is_processed': True,
        'processing_notes': 'Données validées'
    },
    {
        'title': 'PIB par Secteur 2023',
        'description': 'Contribution au PIB par secteur économique',
        'category': 'Économie',
        'data_model': 'Économie',
        'visibility': Indicator.VISIBILITY_PRIVATE,
        'file_format': 'EXCEL',
        'is_processed': True,
        'processing_notes': 'Données confidentielles'
    },
    {
        'title': 'Population par Région',
        'description': 'Distribution de la population par région',
        'category': 'Démographie',
        'data_model': None,
        'visibility': Indicator.VISIBILITY_PUBLIC,
        'file_format': 'CSV',
        'is_processed': False,
        'processing_notes': 'En attente de traitement'
    }
]

for ind_data in indicators_data:
    category = categories[ind_data.pop('category')]
    data_model_name = ind_data.pop('data_model')
    data_model = data_models.get(data_model_name) if data_model_name else None
    
    indicator, created = Indicator.objects.get_or_create(
        title=ind_data['title'],
        defaults={
            'description': ind_data['description'],
            'category': category,
            'data_model': data_model,
            'visibility': ind_data['visibility'],
            'data_file': 'sample_data.csv',
            'file_format': ind_data['file_format'],
            'uploaded_by': admin_user,
            'is_processed': ind_data['is_processed'],
            'processing_notes': ind_data['processing_notes']
        }
    )
    status = "[OK] Cree" if created else "[SKIP] Existe deja"
    visibility = "[PUBLIC]" if ind_data['visibility'] == Indicator.VISIBILITY_PUBLIC else "[PRIVE]"
    print(f"   {status}: {ind_data['title']} {visibility}")

print("\n" + "=" * 60)
print("[OK] Initialisation completee avec succes !")
print("=" * 60)
print("\n[STATS] Donnees creees:")
print(f"   - Categories: {Category.objects.count()}")
print(f"   - Modeles de donnees: {DataModel.objects.count()}")
print(f"   - Utilisateurs: {User.objects.count()}")
print(f"   - Indicateurs: {Indicator.objects.count()}")
print("\n[ACCOUNTS] Comptes de test:")
print("   - Admin: admin@ins.org / admin123")
print("   - Partner 1: partner@sante.org / partner123")
print("   - Partner 2: partner@education.org / partner123")
print("\n[NEXT] Vous pouvez maintenant:")
print("   1. Lancer le serveur: python manage.py runserver")
print("   2. Acceder a l'admin: http://localhost:8000/admin/")
print("   3. Tester l'API: http://localhost:8000/api/")
print("\n" + "=" * 60)
