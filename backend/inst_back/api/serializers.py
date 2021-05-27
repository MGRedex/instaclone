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

class OnlyUserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ['user']

class GetPostSerializer(serializers.ModelSerializer):
    def __init__(self, *args, include_author = True, **kwargs):
        super().__init__(*args, **kwargs)
        if not include_author:
            self.fields.pop('author')
    author = OnlyUserProfileSerializer()
    class Meta:
        model = Post
        fields = ['caption', 'created', 'author', 'id', 'content']

class CreatePostSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        post = Post.objects.create(**validated_data)
        return post
    class Meta:
        model = Post
        fields = ['author', 'caption', 'content']

class LikedPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id']
        
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    following = OnlyUserProfileSerializer(many=True)
    followers = OnlyUserProfileSerializer(many=True)
    posts = GetPostSerializer(include_author = False, many = True)
    liked_posts = LikedPostSerializer(many = True)
    class Meta:
        model = Profile
        fields = ['user', 'following', 'posts', 'followers', 'liked_posts']

class CommentSerializer(serializers.ModelSerializer):
    author = OnlyUserProfileSerializer()
    class Meta:
        model = Comment
        fields = ['author', 'text']

