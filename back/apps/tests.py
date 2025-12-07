"""
Tests unitaires pour l'application HISWACA
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from apps.access_request.models import AccessRequest
from apps.datacatalog.models import Category, Indicator, DataModel
from apps.etl.models import RawFileUpload

User = get_user_model()

class UserAuthenticationTestCase(APITestCase):
    """Tests pour l'authentification des utilisateurs"""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin@ins.org',
            email='admin@ins.org',
            password='testpass123',
            role=User.IS_ADMIN,
            organization='INS Congo'
        )
        self.partner_user = User.objects.create_user(
            username='partner@example.com',
            email='partner@example.com',
            password='testpass123',
            role=User.IS_PARTNER,
            organization='Ministère de la Santé'
        )
    
    def test_user_login(self):
        """Test la connexion d'un utilisateur"""
        response = self.client.post('/api/auth/users/login/', {
            'username': 'admin@ins.org',
            'password': 'testpass123'
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
    
    def test_invalid_login(self):
        """Test la connexion avec des identifiants invalides"""
        response = self.client.post('/api/auth/users/login/', {
            'username': 'admin@ins.org',
            'password': 'wrongpassword'
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_user_creation(self):
        """Test la création d'un nouvel utilisateur"""
        response = self.client.post('/api/auth/users/', {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepass123',
            'password_confirm': 'securepass123',
            'first_name': 'Jean',
            'last_name': 'Dupont',
            'role': 'PARTNER'
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 3)

class AccessRequestTestCase(APITestCase):
    """Tests pour les demandes d'accès"""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin@ins.org',
            email='admin@ins.org',
            password='testpass123',
            role=User.IS_ADMIN
        )
        self.client.force_authenticate(user=self.admin_user)
    
    def test_create_access_request(self):
        """Test la création d'une demande d'accès"""
        response = self.client.post('/api/requests/', {
            'requester_full_name': 'Marie Dupont',
            'requester_email': 'marie@example.com',
            'requester_phone': '+243123456789',
            'organization_name': 'Ministère de la Santé',
            'organization_type': 'Gouvernement',
            'organization_address': 'Kinshasa, Congo',
            'motivation': 'Accès aux données de santé'
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(AccessRequest.objects.count(), 1)
    
    def test_list_access_requests(self):
        """Test la liste des demandes d'accès"""
        AccessRequest.objects.create(
            requester_full_name='Marie Dupont',
            requester_email='marie@example.com',
            requester_phone='+243123456789',
            organization_name='Ministère de la Santé',
            motivation='Accès aux données'
        )
        
        response = self.client.get('/api/requests/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

class IndicatorTestCase(APITestCase):
    """Tests pour les indicateurs"""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin@ins.org',
            email='admin@ins.org',
            password='testpass123',
            role=User.IS_ADMIN
        )
        self.category = Category.objects.create(name='Santé')
        self.data_model = DataModel.objects.create(
            name='Santé Publique',
            description='Modèle de santé',
            schema={}
        )
    
    def test_list_public_indicators(self):
        """Test la liste des indicateurs publics"""
        Indicator.objects.create(
            title='Taux de Mortalité',
            description='Taux de mortalité infantile',
            category=self.category,
            data_model=self.data_model,
            visibility=Indicator.VISIBILITY_PUBLIC,
            data_file='test.csv',
            uploaded_by=self.admin_user
        )
        
        response = self.client.get('/api/catalog/indicators/public/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_create_indicator_requires_admin(self):
        """Test que seul un admin peut créer un indicateur"""
        response = self.client.post('/api/catalog/indicators/', {
            'title': 'Nouvel Indicateur',
            'description': 'Description',
            'category': self.category.id,
            'visibility': 'PUBLIC',
            'data_file': 'test.csv'
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class DashboardTestCase(APITestCase):
    """Tests pour le dashboard"""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='admin@ins.org',
            email='admin@ins.org',
            password='testpass123',
            role=User.IS_ADMIN
        )
        self.client.force_authenticate(user=self.admin_user)
    
    def test_dashboard_stats(self):
        """Test les statistiques du dashboard"""
        response = self.client.get('/api/dashboard/stats/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('access_requests', response.data)
        self.assertIn('indicators', response.data)
        self.assertIn('etl', response.data)
    
    def test_dashboard_activity(self):
        """Test les activités récentes"""
        response = self.client.get('/api/dashboard/activity/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('recent_access_requests', response.data)
        self.assertIn('recent_uploads', response.data)
        self.assertIn('recent_indicators', response.data)
