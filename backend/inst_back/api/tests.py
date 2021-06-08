from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from .models import *

class AuthenticationTestCase(APITestCase):

    @classmethod
    def setUpTestData(cls):
        user = User.objects.create_user(username = 'testuser1', password='12345', id=1)
        Profile.objects.create(user=user, id=1)
        cls.authentication = JWTAuthentication()
    
    def test_register(self):
        url = reverse('user_register')
        data = {
            'username':'testuser2',
            'password':'abc123',
            'email':'testmail@gmail.com',
        }
        response = self.client.post(url, data, format = 'json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(list(response.data.keys()), ['refresh','access'])

        created_profile = Profile.objects.get(id=2)

        self.assertEqual(created_profile.user.username, 'testuser2')
        self.assertEqual(created_profile.user.email, 'testmail@gmail.com')

        decoded_token = self.authentication.get_validated_token(response.data['access'])
        token_user = self.authentication.get_user(decoded_token)

        self.assertEqual(token_user, created_profile.user)

    def test_login(self):
        url = reverse('token_obtain_pair')
        data = {
            'username':'testuser1',
            'password':'12345',
        }
        response = self.client.post(url, data, format = 'json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(list(response.data.keys()), ['refresh','access'])

        login_user = User.objects.get(id=1)
        decoded_token = self.authentication.get_validated_token(response.data['access'])
        token_user = self.authentication.get_user(decoded_token)

        self.assertEqual(token_user, login_user)

    def test_logout(self):
        login_user = User.objects.get(id=1)
        token = RefreshToken.for_user(login_user)

        self.client.credentials(HTTP_AUTHORIZATION = f'Bearer {token.access_token}')
        url = reverse('user_logout')
        data = {
            'refresh_token': str(token),
        }
        response = self.client.post(url, data, format = 'json')

        self.assertEqual(response.status_code, 205)

        blacklisted_token = BlacklistedToken.objects.get()
        self.assertEqual(str(blacklisted_token.token.token), str(token))

class FeedTestCase(APITestCase):
    


