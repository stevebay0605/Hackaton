#!/usr/bin/env python
"""
Script de test pour vérifier que l'API fonctionne correctement
"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

print("=" * 60)
print("TEST API HISWACA")
print("=" * 60)

# 1. Test Login
print("\n[1] Test Login...")
login_response = requests.post(
    f"{BASE_URL}/auth/users/login/",
    json={"username": "admin@ins.org", "password": "admin123"}
)
print(f"Status: {login_response.status_code}")
if login_response.status_code == 200:
    token = login_response.json()['token']
    print(f"Token obtenu: {token[:20]}...")
else:
    print(f"Erreur: {login_response.json()}")
    exit(1)

# 2. Test Indicateurs Publics (sans auth)
print("\n[2] Test Indicateurs Publics (sans auth)...")
public_response = requests.get(f"{BASE_URL}/catalog/indicators/public/")
print(f"Status: {public_response.status_code}")
if public_response.status_code == 200:
    print(f"Nombre d'indicateurs publics: {len(public_response.json())}")
else:
    print(f"Erreur: {public_response.json()}")

# 3. Test Indicateurs Privés (avec auth)
print("\n[3] Test Indicateurs Privés (avec auth)...")
headers = {"Authorization": f"Token {token}"}
private_response = requests.get(
    f"{BASE_URL}/catalog/indicators/private/",
    headers=headers
)
print(f"Status: {private_response.status_code}")
if private_response.status_code == 200:
    print(f"Nombre d'indicateurs privés: {len(private_response.json())}")
    print("Contenu:")
    print(json.dumps(private_response.json(), indent=2, ensure_ascii=False))
else:
    print(f"Erreur: {private_response.json()}")

# 4. Test Dashboard Stats (admin only)
print("\n[4] Test Dashboard Stats (admin only)...")
stats_response = requests.get(
    f"{BASE_URL}/dashboard/stats/",
    headers=headers
)
print(f"Status: {stats_response.status_code}")
if stats_response.status_code == 200:
    stats = stats_response.json()
    print(f"Utilisateurs: {stats['users']['total']}")
    print(f"Indicateurs: {stats['indicators']['total']}")
    print(f"Demandes d'accès: {stats['access_requests']['total']}")
else:
    print(f"Erreur: {stats_response.json()}")

# 5. Test Indicateurs sans auth (doit retourner 401)
print("\n[5] Test Indicateurs sans auth (doit retourner 401)...")
no_auth_response = requests.get(f"{BASE_URL}/catalog/indicators/")
print(f"Status: {no_auth_response.status_code}")
if no_auth_response.status_code == 401:
    print("✓ Correctement protégé")
else:
    print(f"✗ Non protégé: {no_auth_response.json()}")

print("\n" + "=" * 60)
print("TESTS TERMINES")
print("=" * 60)
