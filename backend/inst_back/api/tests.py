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
        user = User.objects.create_user(username = 'testuser1', password = '12345', id = 1)
        Profile.objects.create(user = user, id = 1)
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

        login_user = User.objects.get(id = 1)
        decoded_token = self.authentication.get_validated_token(response.data['access'])
        token_user = self.authentication.get_user(decoded_token)

        self.assertEqual(token_user, login_user)

    def test_logout(self):
        login_user = User.objects.get(id = 1)
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

class FollowTestCase(APITestCase):
    
    @classmethod
    def setUpTestData(cls):
        followee_user = User.objects.create_user(username = 'testuser1', password = '12345')
        followee_profile = Profile.objects.create(user = followee_user, id = 1)

        follower_user = User.objects.create_user(username = 'testuser2', password = '12345')
        follower_profile = Profile.objects.create(user = follower_user, id = 2)

        cls.authentication = JWTAuthentication()
        cls.token = RefreshToken.for_user(follower_user)

    def test_follow(self):
        url = reverse('follow_unfollow', kwargs = {'pk': 1, 'action': 'follow'})
        self.client.credentials(HTTP_AUTHORIZATION = f'Bearer {self.token.access_token}')
        response = self.client.put(url)

        self.assertEqual(response.status_code, 204)

        followee_user = Profile.objects.get(id = 1)
        follower_profile = Profile.objects.get(id = 2)

        self.assertEqual(follower_profile.following.get(id = 1), followee_user)
        self.assertEqual(followee_user.followers.get(id = 2), follower_profile)

    def test_unfollow(self):
        followee_user = Profile.objects.get(id = 1)
        follower_profile = Profile.objects.get(id = 2)
        follower_profile.following.add(followee_user)

        url = reverse('follow_unfollow', kwargs = {'pk': 1, 'action': 'unfollow'})
        self.client.credentials(HTTP_AUTHORIZATION = f'Bearer {self.token.access_token}')
        response = self.client.put(url)

        self.assertEqual(response.status_code, 204)

        with self.assertRaisesMessage(Profile.DoesNotExist, 'Profile matching query does not exist'):
            follower_profile.following.get(id = 1)

        with self.assertRaisesMessage(Profile.DoesNotExist, 'Profile matching query does not exist'):
            followee_user.followers.get(id = 2)
class FeedTestCase(APITestCase):
    


