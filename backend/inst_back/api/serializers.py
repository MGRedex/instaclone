from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    def __init__(self, *args, include_password = False, **kwargs):
        super().__init__(*args, **kwargs)
        if not include_password:
            self.fields.pop('password')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    # def update(self, instance, validated_data):
    #     instance.username = validated_data.get('username', instance.username)
    #     instance.email = validated_data.get('email', instance.email)
    #     instance.password = validated_data.get('password', instance.password)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'id']

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
        fields = ['caption', 'created', 'author', 'id', 'content']

class LikedPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id']
        
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    following = FollowedProfileSerializer(many=True)
    followers = FollowedProfileSerializer(many=True)
    posts = PostSerializer(include_author = False, many = True)
    liked_posts = LikedPostSerializer(many = True)
    class Meta:
        model = Profile
        fields = ['user', 'following', 'posts', 'followers', 'liked_posts']

