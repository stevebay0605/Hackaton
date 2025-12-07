#!/usr/bin/env python
"""
Script de test pour vérifier la gestion des erreurs
"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

print("=" * 60)
print("TEST GESTION DES ERREURS - API HISWACA")
print("=" * 60)

# 1. Test Login sans credentials
print("\n[1] Test Login sans credentials...")
response = requests.post(
    f"{BASE_URL}/auth/users/login/",
    json={}
)
print(f"Status: {response.status_code}")
print(f"Erreur: {response.json()}")

# 2. Test Login avec identifiants invalides
print("\n[2] Test Login avec identifiants invalides...")
response = requests.post(
    f"{BASE_URL}/auth/users/login/",
    json={"username": "invalid@example.com", "password": "wrongpassword"}
)
print(f"Status: {response.status_code}")
print(f"Erreur: {response.json()}")

# 3. Test Accès sans token
print("\n[3] Test Accès sans token...")
response = requests.get(f"{BASE_URL}/catalog/indicators/")
print(f"Status: {response.status_code}")
print(f"Erreur: {response.json()}")

# 4. Test Accès avec token invalide
print("\n[4] Test Accès avec token invalide...")
headers = {"Authorization": "Token invalid_token_12345"}
response = requests.get(
    f"{BASE_URL}/catalog/indicators/",
    headers=headers
)
print(f"Status: {response.status_code}")
print(f"Erreur: {response.json()}")

# 5. Test Changement de mot de passe sans ancien mot de passe
print("\n[5] Test Changement de mot de passe sans ancien mot de passe...")
login_response = requests.post(
    f"{BASE_URL}/auth/users/login/",
    json={"username": "admin@ins.org", "password": "admin123"}
)
token = login_response.json()['token']
headers = {"Authorization": f"Token {token}"}
response = requests.post(
    f"{BASE_URL}/auth/users/change_password/",
    json={"new_password": "newpass123"},
    headers=headers
)
print(f"Status: {response.status_code}")
print(f"Erreur: {response.json()}")

# 6. Test Changement de mot de passe avec ancien mot de passe incorrect
print("\n[6] Test Changement de mot de passe avec ancien mot de passe incorrect...")
response = requests.post(
    f"{BASE_URL}/auth/users/change_password/",
    json={"old_password": "wrongpassword", "new_password": "newpass123"},
    headers=headers
)
print(f"Status: {response.status_code}")
print(f"Erreur: {response.json()}")

# 7. Test Accès à endpoint admin sans être admin
print("\n[7] Test Accès à endpoint admin sans être admin...")
login_response = requests.post(
    f"{BASE_URL}/auth/users/login/",
    json={"username": "partner@sante.org", "password": "partner123"}
)
token = login_response.json()['token']
headers = {"Authorization": f"Token {token}"}
response = requests.get(
    f"{BASE_URL}/catalog/indicators/private/",
    headers=headers
)
print(f"Status: {response.status_code}")
print(f"Erreur: {response.json()}")

# 8. Test Token change à chaque connexion
print("\n[8] Test Token change à chaque connexion...")
response1 = requests.post(
    f"{BASE_URL}/auth/users/login/",
    json={"username": "admin@ins.org", "password": "admin123"}
)
token1 = response1.json()['token']
response2 = requests.post(
    f"{BASE_URL}/auth/users/login/",
    json={"username": "admin@ins.org", "password": "admin123"}
)
token2 = response2.json()['token']
if token1 != token2:
    print(f"✓ OK: Les tokens sont differents")
    print(f"  Token 1: {token1[:20]}...")
    print(f"  Token 2: {token2[:20]}...")
else:
    print(f"✗ ERREUR: Les tokens sont identiques")

print("\n" + "=" * 60)
print("TESTS TERMINES")
print("=" * 60)
