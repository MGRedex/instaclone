import os
import io
from itertools import zip_longest
from shutil import rmtree

from PIL import Image
from django.test import TestCase, override_settings
from django.urls import reverse
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.models import User
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken

from .models import *

class AuthenticationTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        user = User.objects.create_user(
            username = 'testuser1', 
            password = '12345')

        Profile.objects.create(
            user = user)
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

        created_profile = Profile.objects.get(id = 2)

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
        followee_user = User.objects.create_user(
            username = 'testuser1', 
            password = '12345', 
            id = 1)

        followee_profile = Profile.objects.create(
            user = followee_user, 
            id = 1)

        follower_user = User.objects.create_user(
            username = 'testuser2', 
            password = '12345', 
            id = 2)

        follower_profile = Profile.objects.create(
            user = follower_user, 
            id = 2)

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
    @classmethod
    def setUpTestData(cls):
        followee_user = User.objects.create_user(
            username = 'testuser1', 
            password = '12345', 
            id = 1)

        folowee_profile = Profile.objects.create(
            user = followee_user, 
            id = 1)

        follower_user = User.objects.create_user(
            username = 'testuser2', 
            password = '12345', 
            id = 2)

        follower_profile = Profile.objects.create(
            user = follower_user, 
            id = 2)

        follower_profile.following.add(folowee_profile)

        for i in range(1,3):
            Post.objects.create(
                author = folowee_profile, 
                caption = f'testpost{i}')

        cls.authentication = JWTAuthentication()
        cls.token = RefreshToken.for_user(follower_user)

    def test_feed(self):
        url = reverse('feed')
        self.client.credentials(HTTP_AUTHORIZATION = f'Bearer {self.token.access_token}')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

        feed_posts = list(Post.objects.filter(author_id = 1))

        data = sorted(response.data, key = lambda post: post['id'])

        for (post, response_post) in zip_longest(feed_posts, data):
            self.assertEqual({
                'caption': post.caption, 
                'author': {
                    'user': {
                        'username': post.author.user.username,
                        'email': post.author.user.email,
                        'id': post.author.user.id,
                    }
                },
                'created': str(post.created).replace(' ', 'T').replace('+00:00', 'Z'),
                'id': post.id,
                'content': None},
                response_post)  

    
class LikeDislikeTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        post_creator_user = User.objects.create_user(
            username = 'testuser1', 
            password = '12345', 
            id = 1)

        post_creator_profile = Profile.objects.create(
            user = post_creator_user, 
            id = 1)

        liker_user = User.objects.create_user(
            username = 'testuser2', 
            password = '12345', 
            id = 2)

        liker_profile = Profile.objects.create(
            user = liker_user, 
            id = 2)

        Post.objects.create(
            author = post_creator_profile, 
            caption = f'testpost1', 
            id = 1)

        cls.authentication = JWTAuthentication()
        cls.token = RefreshToken.for_user(liker_user)

    def test_like(self):
        url = reverse('like_dislike', kwargs = {'pk': 1, 'action': 'like'})
        self.client.credentials(HTTP_AUTHORIZATION = f'Bearer {self.token.access_token}')
        response = self.client.put(url)

        self.assertEqual(response.status_code, 204)

        liked_post = Post.objects.get()
        liker_profile = Profile.objects.get(id = 2)

        self.assertEqual(liked_post.likes.get(), liker_profile)
        self.assertEqual(liker_profile.liked_posts.get(), liked_post)
        
    def test_dislike(self):
        liked_post = Post.objects.get()
        liker_profile = Profile.objects.get(id = 2)
        liked_post.likes.add(liker_profile)

        url = reverse('like_dislike', kwargs = {'pk': 1, 'action': 'dislike'})
        self.client.credentials(HTTP_AUTHORIZATION = f'Bearer {self.token.access_token}')
        response = self.client.put(url)

        self.assertEqual(response.status_code, 204)

        with self.assertRaisesMessage(Profile.DoesNotExist, 'Profile matching query does not exist'):
            liked_post.likes.get()

        with self.assertRaisesMessage(Post.DoesNotExist, 'Post matching query does not exist'):
            liker_profile.liked_posts.get()

    
class UserInfoTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        user = User.objects.create_user(
            username = 'testuser1', 
            password = '12345', 
            email = 'testmail1@gmail.com',
            id = 1)

        user_profile = Profile.objects.create(
            user = user, 
            id = 1)

        cls.authentication = JWTAuthentication()
        cls.token = RefreshToken.for_user(user)

    def test_user_info(self):
        user_profile = Profile.objects.get(id = 1)

        follower_user = User.objects.create_user(
            username = 'testuser2', 
            password = '12345',
            email = 'testmail2@gmail.com')

        follower_profile = Profile.objects.create(
            user = follower_user, 
            id = 2)

        user_post = Post.objects.create(
            author = user_profile, 
            caption = 'testpost1',
            id = 1)

        liked_post = Post.objects.create(
            author = follower_profile, 
            caption = 'testpost2',
            id = 2)

        liked_post.likes.add(user_profile)

        user_profile.following.add(follower_profile)
        follower_profile.following.add(user_profile)

        url = reverse('user_info', kwargs = {'pk': 1})
        self.client.credentials(HTTP_AUTHORIZATION = f'Bearer {self.token.access_token}')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        
        self.assertEqual({
            'user':{
                'username': user_profile.user.username,
                'email': user_profile.user.email,
                'id': user_profile.user.id
            },
            'following':[
                {
                    'user':{
                        'username': follower_profile.user.username,
                        'email': follower_profile.user.email,
                        'id': follower_profile.user.id
                    }
                
                }
            ],
            'posts':[
                {
                    'caption': user_post.caption,
                    'created': str(user_post.created).replace(' ', 'T').replace('+00:00', 'Z'),
                    'id': user_post.id,
                    'content': None
                }
            ],
            'followers':[
                {
                    'user':{
                        'username': follower_profile.user.username,
                        'email': follower_profile.user.email,
                        'id': follower_profile.user.id
                    }
                
                }
            ],
            'liked_posts': [
                {
                    'id': liked_post.id
                }
            ]
        },
        response.data)


class PostCreationTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.uid = 1

        user = User.objects.create_user(
            username = 'testuser1', 
            password = '12345', 
            email = 'testmail1@gmail.com',
            id = cls.uid)

        user_profile = Profile.objects.create(
            user = user, 
            id = 1)

        cls.authentication = JWTAuthentication()
        cls.token = RefreshToken.for_user(user)

    @override_settings(
        MEDIA_ROOT = os.path.join(settings.BASE_DIR, 'test_media'),
        MEDIA_URL = '/test_media/')
    def test_post_creation(self):
        url = reverse('create_post')
        data = {'caption': 'testpost',}
        self.client.credentials(HTTP_AUTHORIZATION = f'Bearer {self.token.access_token}')

        with open(settings.MEDIA_ROOT + '/test_image.jpg', 'rb') as image:
            image_byte_array = image.read()
            post_image = SimpleUploadedFile(
                'test_post_image.jpg', 
                image_byte_array, 
                'image/jpg')
            
            data['content'] = post_image
        
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, 200)

        created_post = Post.objects.get()

        self.assertEqual(created_post.caption, 'testpost')
        self.assertEqual(
            created_post.content.url, 
            f'/test_media/{self.uid}/posts/testpost.jpg'
        )

        rmtree(settings.MEDIA_ROOT + f'/{self.uid}')


class PostCommentsTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        user = User.objects.create_user(
            username = 'testuser1', 
            password = '12345', 
            id = 1)

        profile = Profile.objects.create(
            user = user, 
            id = 1)

        Post.objects.create(
            author = profile, 
            caption = f'testpost1', 
            id = 1)

        cls.authentication = JWTAuthentication()
        cls.token = RefreshToken.for_user(user)
    def test_post_comments(self):
        post = Post.objects.get()
        profile = Profile.objects.get()
        url = reverse('post_comments', kwargs = {'post_id': post.id})
        data = {'text': 'comment testing',}
        self.client.credentials(HTTP_AUTHORIZATION = f'Bearer {self.token.access_token}')

        response = self.client.post(url, data, format = 'json')
        self.assertEqual(response.status_code, 200)

        post_comment = post.comments.get()

        self.assertEqual(post_comment.text, 'comment testing')
        self.assertEqual(post_comment.author, profile)

