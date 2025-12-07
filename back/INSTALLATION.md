# Guide d'Installation - HISWACA

## 📋 Prérequis

- Python 3.9 ou supérieur
- pip (gestionnaire de paquets Python)
- PostgreSQL 12+ (optionnel, SQLite par défaut)
- Git

## 🚀 Installation Étape par Étape

### 1. Cloner le Projet

```bash
git clone <repository-url>
cd HISWACA/back
```

### 2. Créer un Environnement Virtuel

```bash
# Linux/Mac
python3 -m venv env
source env/bin/activate

# Windows
python -m venv env
env\Scripts\activate
```

### 3. Installer les Dépendances

```bash
pip install -r requirements.txt
```

### 4. Configurer les Variables d'Environnement

Créer un fichier `.env` à la racine du projet `back/` :

```bash
cp .env.example .env
```

Éditer le fichier `.env` avec vos paramètres :

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

### 5. Effectuer les Migrations

```bash
# Créer les fichiers de migration
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate
```

### 6. Créer un Superutilisateur (Admin)

```bash
python manage.py createsuperuser
```

Répondre aux questions :
- Username : `admin@ins.org`
- Email : `admin@ins.org`
- Password : `your-secure-password`
- Role : Sélectionner `ADMIN`

### 7. Créer les Catégories et Modèles de Données Initiaux

```bash
python manage.py shell
```

Puis exécuter :

```python
from apps.datacatalog.models import Category, DataModel

# Créer les catégories
categories = [
    'Santé',
    'Éducation',
    'Économie',
    'Démographie',
    'Agriculture'
]

for cat_name in categories:
    Category.objects.create(name=cat_name)

# Créer les modèles de données
DataModel.objects.create(
    name='Santé Publique',
    description='Modèle standard pour les données de santé',
    schema={
        'fields': [
            {'name': 'date', 'type': 'date'},
            {'name': 'region', 'type': 'string'},
            {'name': 'cases', 'type': 'integer'},
            {'name': 'deaths', 'type': 'integer'}
        ]
    }
)

DataModel.objects.create(
    name='Éducation',
    description='Modèle standard pour les données d\'éducation',
    schema={
        'fields': [
            {'name': 'year', 'type': 'integer'},
            {'name': 'school', 'type': 'string'},
            {'name': 'students', 'type': 'integer'},
            {'name': 'teachers', 'type': 'integer'}
        ]
    }
)

exit()
```

### 8. Lancer le Serveur de Développement

```bash
python manage.py runserver
```

Le serveur sera accessible à `http://localhost:8000`

---

## 🔧 Configuration Avancée

### Configuration PostgreSQL (Production)

1. Installer PostgreSQL :
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # Mac
   brew install postgresql
   ```

2. Créer une base de données :
   ```bash
   createdb hiswaca
   createuser hiswaca_user
   ```

3. Configurer le fichier `.env` :
   ```env
   DATABASE_URL=postgresql://hiswaca_user:password@localhost:5432/hiswaca
   ```

4. Installer le driver PostgreSQL :
   ```bash
   pip install psycopg2-binary
   ```

### Configuration Email (Gmail)

1. Activer les applications moins sécurisées sur votre compte Gmail
2. Générer un mot de passe d'application
3. Configurer le fichier `.env` :
   ```env
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   ```

### Configuration CORS

Éditer `back/settings.py` pour ajouter vos domaines :

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8000',
    'https://yourdomain.com',
]
```

---

## 🧪 Tests

### Exécuter les Tests

```bash
python manage.py test apps
```

### Exécuter les Tests avec Couverture

```bash
pip install coverage
coverage run --source='.' manage.py test apps
coverage report
coverage html
```

---

## 📊 Admin Django

Accéder à l'interface d'administration :

```
http://localhost:8000/admin/
```

Identifiants : Ceux du superutilisateur créé précédemment

---

## 🐛 Dépannage

### Erreur : "ModuleNotFoundError: No module named 'django'"

**Solution** : Assurez-vous que l'environnement virtuel est activé et les dépendances installées :
```bash
source env/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

### Erreur : "No such table: accounts_user"

**Solution** : Effectuer les migrations :
```bash
python manage.py migrate
```

### Erreur : "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution** : Vérifier la configuration CORS dans `settings.py` et ajouter votre domaine frontend.

### Erreur : "Port 8000 already in use"

**Solution** : Utiliser un autre port :
```bash
python manage.py runserver 8001
```

---

## 📦 Déploiement en Production

### Avec Gunicorn et Nginx

1. Installer Gunicorn :
   ```bash
   pip install gunicorn
   ```

2. Créer un fichier `gunicorn_config.py` :
   ```python
   bind = "0.0.0.0:8000"
   workers = 4
   worker_class = "sync"
   timeout = 120
   ```

3. Lancer l'application :
   ```bash
   gunicorn back.wsgi:application --config gunicorn_config.py
   ```

4. Configurer Nginx comme reverse proxy (voir documentation Nginx)

### Variables d'Environnement Production

```env
DEBUG=False
SECRET_KEY=<generate-secure-key>
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@host:5432/hiswaca
EMAIL_HOST_USER=noreply@yourdomain.com
EMAIL_HOST_PASSWORD=<secure-password>
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### Collecte des Fichiers Statiques

```bash
python manage.py collectstatic --noinput
```

---

## 🔐 Sécurité

### Checklist de Sécurité

- [ ] `DEBUG=False` en production
- [ ] `SECRET_KEY` changée et sécurisée
- [ ] HTTPS activé
- [ ] CORS configuré correctement
- [ ] Authentification 2FA pour les admins
- [ ] Backups réguliers
- [ ] Monitoring et logging activés
- [ ] Firewall configuré

---

## 📚 Ressources Supplémentaires

- [Documentation Django](https://docs.djangoproject.com/)
- [Documentation Django REST Framework](https://www.django-rest-framework.org/)
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- [Guide Gunicorn](https://gunicorn.org/)

---

**Dernière mise à jour** : Décembre 2025
