from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

class FollowedProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Profile
        fields = ['user']

class PostSerializer(serializers.ModelSerializer):
    def __init__(self,*args, include_author = True, **kwargs):
        super().__init__(*args, **kwargs)
        if not include_author:
            self.fields.pop('author')
    author = FollowedProfileSerializer()
    class Meta:
        model = Post
        fields = ['caption', 'created', 'author']
        
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    following = FollowedProfileSerializer(many=True)
    posts = PostSerializer(include_author = False, many = True)
    class Meta:
        model = Profile
        fields = ['email', 'user', 'following', 'posts']

