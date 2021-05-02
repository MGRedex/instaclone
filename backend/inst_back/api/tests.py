from django.test import TestCase
from .models import *
from django.contrib.auth.models import User
# Create your tests here.
class ProfileTestCase(TestCase):
    @classmethod
    def setUpTestData(self):
        user = User.objects.create_user(
            username = 'testuser', 
            password = 'abc123')
        user.save()
        Profile.objects.create(
            user = user,
            email = 'test@gmail.com'
        )

    def test_profile(self):
        profile = Profile.objects.get(email='test@gmail.com')
        self.assertEqual(profile.user.username, 'testuser')

class FollowingTestCase(TestCase):
    @classmethod
    def setUpTestData(self):
        user1 = User.objects.create_user(
            username = 'testuser1', 
            password = 'abc123')
        user1.save()
        profile1 = Profile.objects.create(
            user = user1,
            email = 'test1@gmail.com'
        )
        profile1.save()

        user2 = User.objects.create_user(
            username = 'testuser2', 
            password = 'abc123')
        user2.save()
        profile2 = Profile.objects.create(
            user = user2,
            email = 'test2@gmail.com',
        )
        profile2.following.add(profile1)
        profile2.save()

    def test_profile_following(self):
        profile2 = Profile.objects.get(email='test2@gmail.com')
        profile1 = profile2.following.get()
        self.assertEqual(profile1.user.username, 'testuser1')
    
    def test_profile_follower(self):
        profile1 = Profile.objects.get(email='test1@gmail.com')
        profile2 = profile1.followers.get()
        self.assertEqual(profile2.user.username, 'testuser2')