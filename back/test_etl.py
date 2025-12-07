#!/usr/bin/env python
"""
Script de test pour le système ETL
"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

print("=" * 60)
print("TEST SYSTÈME ETL - API HISWACA")
print("=" * 60)

# 1. Login
print("\n[1] Login...")
login_response = requests.post(
    f"{BASE_URL}/auth/users/login/",
    json={"username": "admin@ins.org", "password": "admin123"}
)
token = login_response.json()['access']
headers = {"Authorization": f"Bearer {token}"}
print(f"✓ Token obtenu")

# 2. Obtenir les catégories
print("\n[2] Obtenir les catégories...")
categories_response = requests.get(
    f"{BASE_URL}/catalog/categories/",
    headers=headers
)
categories_data = categories_response.json()

# Gérer la pagination
if isinstance(categories_data, dict) and 'results' in categories_data:
    categories = categories_data['results']
else:
    categories = categories_data

print(f"✓ {len(categories)} catégories trouvées")
if categories:
    category_id = categories[0]['id']
    category_name = categories[0]['name']
    print(f"  Catégorie sélectionnée: {category_name} (ID: {category_id})")
else:
    print("✗ Aucune catégorie trouvée")
    exit(1)

# 3. Upload et traitement du fichier
print("\n[3] Upload et traitement du fichier...")
with open('test_data.csv', 'rb') as f:
    files = {'file': f}
    data = {
        'file_name': 'test_data.csv',
        'file_format': 'CSV',
        'category_id': category_id
    }
    upload_response = requests.post(
        f"{BASE_URL}/etl/upload/",
        files=files,
        data=data,
        headers=headers
    )

print(f"Status: {upload_response.status_code}")
if upload_response.status_code == 201:
    result = upload_response.json()
    print(f"✓ Fichier uploadé et traité avec succès")
    print(f"  ID: {result['id']}")
    print(f"  Status: {result['status']}")
    print(f"  Total lignes: {result['total_rows']}")
    print(f"  Lignes traitées: {result['processed_rows']}")
    print(f"  Lignes échouées: {result['failed_rows']}")
    print(f"  Message: {result['message']}")
    
    upload_id = result['id']
    
    # 4. Télécharger le fichier de sortie
    print("\n[4] Télécharger le fichier de sortie XLS...")
    download_response = requests.get(
        f"{BASE_URL}/etl/uploads/{upload_id}/download/",
        headers=headers
    )
    
    if download_response.status_code == 200:
        print(f"✓ Fichier XLS téléchargé avec succès")
        print(f"  Taille: {len(download_response.content)} bytes")
        
        # Sauvegarder le fichier
        with open(f'etl_output_{upload_id}.xlsx', 'wb') as f:
            f.write(download_response.content)
        print(f"  Fichier sauvegardé: etl_output_{upload_id}.xlsx")
    else:
        print(f"✗ Erreur lors du téléchargement: {download_response.json()}")
    
    # 5. Vérifier les indicateurs créés
    print("\n[5] Vérifier les indicateurs créés...")
    indicators_response = requests.get(
        f"{BASE_URL}/catalog/indicators/",
        headers=headers
    )
    
    if indicators_response.status_code == 200:
        indicators_data = indicators_response.json()
        
        # Gérer la pagination
        if isinstance(indicators_data, dict) and 'results' in indicators_data:
            indicators = indicators_data['results']
        else:
            indicators = indicators_data
        
        print(f"✓ {len(indicators)} indicateurs trouvés au total")
        
        # Filtrer par catégorie
        category_indicators = [ind for ind in indicators if ind.get('category') == category_id]
        print(f"  {len(category_indicators)} indicateurs dans la catégorie {category_name}")
        
        # Afficher les derniers indicateurs créés
        if category_indicators:
            print("\n  Derniers indicateurs créés:")
            for ind in category_indicators[-3:]:
                print(f"    - {ind['title']}")
    else:
        print(f"✗ Erreur: {indicators_response.json()}")

else:
    print(f"✗ Erreur: {upload_response.json()}")

print("\n" + "=" * 60)
print("TEST ETL TERMINÉ")
print("=" * 60)
