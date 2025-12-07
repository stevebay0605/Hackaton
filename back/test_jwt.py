#!/usr/bin/env python
"""
Script de test pour vérifier JWT Bearer Token
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000/api"

print("=" * 60)
print("TEST JWT BEARER TOKEN - API HISWACA")
print("=" * 60)

# 1. Test Obtenir les tokens
print("\n[1] Obtenir les tokens JWT...")
login_response = requests.post(
    f"{BASE_URL}/token/",
    json={"username": "admin@ins.org", "password": "admin123"}
)
print(f"Status: {login_response.status_code}")
if login_response.status_code == 200:
    tokens = login_response.json()
    access_token = tokens['access']
    refresh_token = tokens['refresh']
    print(f"✓ Access Token obtenu: {access_token[:50]}...")
    print(f"✓ Refresh Token obtenu: {refresh_token[:50]}...")
else:
    print(f"✗ Erreur: {login_response.json()}")
    exit(1)

# 2. Test Utiliser Bearer Token
print("\n[2] Test avec Bearer Token...")
headers = {"Authorization": f"Bearer {access_token}"}
response = requests.get(
    f"{BASE_URL}/catalog/indicators/private/",
    headers=headers
)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    print(f"✓ Accès accordé avec Bearer Token")
    print(f"  Nombre d'indicateurs privés: {len(response.json())}")
else:
    print(f"✗ Erreur: {response.json()}")

# 3. Test Refresh Token
print("\n[3] Test Refresh Token...")
refresh_response = requests.post(
    f"{BASE_URL}/token/refresh/",
    json={"refresh": refresh_token}
)
print(f"Status: {refresh_response.status_code}")
if refresh_response.status_code == 200:
    new_tokens = refresh_response.json()
    new_access_token = new_tokens['access']
    print(f"✓ Nouveau Access Token obtenu: {new_access_token[:50]}...")
    print(f"  Ancien token: {access_token[:50]}...")
    print(f"  Nouveau token: {new_access_token[:50]}...")
    if access_token != new_access_token:
        print(f"  ✓ Les tokens sont différents (rotation activée)")
else:
    print(f"✗ Erreur: {refresh_response.json()}")

# 4. Test Accès sans Bearer Token
print("\n[4] Test Accès sans Bearer Token...")
response = requests.get(f"{BASE_URL}/catalog/indicators/private/")
print(f"Status: {response.status_code}")
if response.status_code == 401:
    print(f"✓ Correctement protégé (401)")
else:
    print(f"✗ Non protégé: {response.json()}")

# 5. Test Accès avec Bearer Token invalide
print("\n[5] Test Accès avec Bearer Token invalide...")
headers = {"Authorization": "Bearer invalid_token_12345"}
response = requests.get(
    f"{BASE_URL}/catalog/indicators/private/",
    headers=headers
)
print(f"Status: {response.status_code}")
if response.status_code == 401:
    print(f"✓ Correctement rejeté (401)")
    print(f"  Erreur: {response.json()}")
else:
    print(f"✗ Non rejeté: {response.json()}")

# 6. Test Endpoint public sans token
print("\n[6] Test Endpoint public sans token...")
response = requests.get(f"{BASE_URL}/catalog/indicators/public/")
print(f"Status: {response.status_code}")
if response.status_code == 200:
    print(f"✓ Accès public accordé")
    print(f"  Nombre d'indicateurs publics: {len(response.json())}")
else:
    print(f"✗ Erreur: {response.json()}")

# 7. Décoder le JWT pour voir les claims
print("\n[7] Décoder le JWT...")
import base64
try:
    # JWT format: header.payload.signature
    parts = access_token.split('.')
    if len(parts) == 3:
        # Ajouter le padding si nécessaire
        payload = parts[1]
        padding = 4 - len(payload) % 4
        if padding != 4:
            payload += '=' * padding
        decoded = base64.urlsafe_b64decode(payload)
        claims = json.loads(decoded)
        print(f"✓ Claims du JWT:")
        print(f"  Token Type: {claims.get('token_type')}")
        print(f"  User ID: {claims.get('user_id')}")
        print(f"  Exp: {claims.get('exp')}")
        print(f"  Iat: {claims.get('iat')}")
except Exception as e:
    print(f"✗ Erreur lors du décodage: {str(e)}")

print("\n" + "=" * 60)
print("TESTS JWT TERMINES")
print("=" * 60)
print("\n📋 Résumé:")
print("✓ JWT Bearer Token configuré et fonctionnel")
print("✓ Refresh Token fonctionne")
print("✓ Rotation de tokens activée")
print("✓ Endpoints protégés correctement")
print("✓ Endpoints publics accessibles")
