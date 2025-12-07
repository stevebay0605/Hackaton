#!/usr/bin/env python
"""
Script de diagnostic pour tester le token
"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

print("=" * 60)
print("DIAGNOSTIC TOKEN - API HISWACA")
print("=" * 60)

# 1. Login et obtenir le token
print("\n[1] Login...")
login_response = requests.post(
    f"{BASE_URL}/auth/users/login/",
    json={"username": "admin@ins.org", "password": "admin123"}
)
print(f"Status: {login_response.status_code}")
login_data = login_response.json()
token = login_data['token']
user = login_data['user']

print(f"\nToken obtenu: {token}")
print(f"Utilisateur: {user['username']}")
print(f"Role: {user['role']}")
print(f"is_staff: {user['is_staff']}")

# 2. Tester avec le token en Bearer Token
print("\n[2] Test avec Bearer Token (Authorization: Bearer <token>)...")
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(
    f"{BASE_URL}/catalog/indicators/private/",
    headers=headers
)
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

# 3. Tester avec le token en Token Authentication
print("\n[3] Test avec Token Authentication (Authorization: Token <token>)...")
headers = {"Authorization": f"Token {token}"}
response = requests.get(
    f"{BASE_URL}/catalog/indicators/private/",
    headers=headers
)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    print(f"✓ OK: Accès accordé")
    print(f"Nombre d'indicateurs: {len(response.json())}")
else:
    print(f"✗ Erreur: {response.json()}")

# 4. Tester sans token
print("\n[4] Test sans token...")
response = requests.get(f"{BASE_URL}/catalog/indicators/private/")
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

# 5. Vérifier que le token est bien stocké en base de données
print("\n[5] Vérification du token en base de données...")
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')
django.setup()

from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

User = get_user_model()
user_obj = User.objects.get(username='admin@ins.org')
try:
    token_obj = Token.objects.get(user=user_obj)
    print(f"Token en base: {token_obj.key}")
    print(f"Correspond au token obtenu: {token_obj.key == token}")
except Token.DoesNotExist:
    print("✗ Aucun token trouvé pour cet utilisateur")

print("\n" + "=" * 60)
print("DIAGNOSTIC TERMINE")
print("=" * 60)
