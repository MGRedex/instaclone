from rest_framework import serializers
from .models import *
from chat.models import *
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):

    def __init__(self, *args, include_password = False, **kwargs):
        super().__init__(*args, **kwargs)
        if not include_password:
            self.fields.pop('password')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'id']


class GetPostSerializer(serializers.ModelSerializer):

    def __init__(self, *args, include_author = True, **kwargs):
        super().__init__(*args, **kwargs)
        if not include_author:
            self.fields.pop('author')

    author = serializers.SerializerMethodField('get_author')

    def get_author(self, obj):
        serializer = ProfileSerializer(obj.author, only_user = True)
        return serializer.data

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

    def __init__(self, *args, only_user = False, **kwargs):
        super().__init__(*args, **kwargs)
        if only_user:
            fields_to_exclude = set(self.fields) - set(('user',))
            for field in fields_to_exclude:
                self.fields.pop(field)

    user = UserSerializer()
    following = serializers.SerializerMethodField('get_following')
    followers = serializers.SerializerMethodField('get_followers')
    posts = GetPostSerializer(include_author = False, many = True)
    liked_posts = LikedPostSerializer(many = True)

    def get_following(self, obj):
        serializer = ProfileSerializer(obj.following.all(), only_user = True, many=True)
        return serializer.data

    def get_followers(self, obj):
        serializer = ProfileSerializer(obj.followers.all(), only_user = True, many=True)
        return serializer.data

    class Meta:
        model = Profile
        fields = ['user', 'following', 'posts', 'followers', 'liked_posts']

class CommentSerializer(serializers.ModelSerializer):

    author = ProfileSerializer(only_user = True)

    class Meta:
        model = Comment
        fields = ['author', 'text']

class MessageSerializer(serializers.ModelSerializer):

    sender = serializers.SerializerMethodField('get_sender')
    receiver = serializers.SerializerMethodField('get_receiver')

    def get_sender(self, obj):
        serializer = ProfileSerializer(obj.sender, only_user = True)
        sender_id = serializer.data['user']['id']
        return sender_id

    def get_receiver(self, obj):
        serializer = ProfileSerializer(obj.receiver, only_user = True)
        receiver_id = serializer.data['user']['id']
        return receiver_id

    class Meta:
        model = Message
        fields = ['sender', 'receiver', 'text', 'created']

class ChatSerializer(serializers.ModelSerializer):
    
    def __init__(self, *args, request_user_id = None, **kwargs):
        self.request_user_id = request_user_id
        super().__init__(*args, **kwargs)

    messages = MessageSerializer(many = True)
    oppositeUserId = serializers.SerializerMethodField('get_opposite_user_id')

    def get_opposite_user_id(self, obj):
        opposite_user = obj.users.exclude(user__id = self.request_user_id)
        return opposite_user.get().user.id

    class Meta:
        model = Chat
        fields = ['messages', 'oppositeUserId']
