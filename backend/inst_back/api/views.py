from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from .models import *
from .serializers import *
from functools import reduce
# Create your views here.


class UserInfoDetail(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, pk):
        print(request)
        model = Profile.objects.get(user__id = pk)
        serializer = ProfileSerializer(model)
        return Response(serializer.data)

class LikeDislike(APIView):
    permission_classes = (IsAuthenticated,)
    def put(self, request, pk, action):
        if action == 'like':
            post = Post.objects.get(id = pk)
            user_profile = Profile.objects.get(user__id = request.user.id)
            post.likes.add(user_profile)
            return Response(status = 204)
        elif action == 'dislike':
            post = Post.objects.get(id = pk)
            user_profile = Profile.objects.get(user__id = request.user.id)
            post.likes.remove(user_profile)
            return Response(status = 204)
        else:
            return Response(status = 400)

class FollowUnfollow(APIView):
    permission_classes = (IsAuthenticated,)
    def put(self, request, pk, action):
        if action == 'follow':
            following_profile = Profile.objects.get(user__id = pk)
            user_profile = Profile.objects.get(user__id = request.user.id)
            user_profile.following.add(following_profile)
            return Response(status = 204)
        elif action == 'unfollow':
            following_profile = Profile.objects.get(user__id = pk)
            user_profile = Profile.objects.get(user__id = request.user.id)
            user_profile.following.remove(following_profile)
            return Response(status = 204)
        else:
            return Response(status = 400)

class Feed(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        user_profile = Profile.objects.get(user__id=2)
        all_posts = [following_user.posts.all() for following_user in user_profile.following.all()]
        all_posts = reduce(lambda all_posts,posts: all_posts.union(posts), all_posts)
        all_posts = all_posts.order_by('-created')
        serializer = GetPostSerializer(all_posts, many=True)
        return Response(serializer.data)

class CreatePost(APIView):
    permission_classes = (IsAuthenticated,)
    parsers = (MultiPartParser,)
    def post(self, request):
        serializer = CreatePostSerializer(data = request.data)
        if serializer.is_valid():
            post_author = Profile.objects.get(user__id = request.user.id)
            post = serializer.save(author=post_author) 
            return Response(status = 200)
        else:
            return Response(serializer._errors, status = 400)

class UserRegister(APIView):
    def post(self, request):
        serializer = UserSerializer(include_password = True, data = request.data)
        if serializer.is_valid():
            user = serializer.save()
            Profile.objects.create(user = user)
            refresh_token = RefreshToken.for_user(user)
            return Response(data={
                'refresh': str(refresh_token),
                'access': str(refresh_token.access_token),
            },status=200)
        else:
            return Response(serializer._errors, status = 400)

class UserLogout(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        try:
            token = RefreshToken(request.data['refresh_token'])
            token.blacklist()

            return Response(status = 205)
        except Exception as e:
            return Response(status = 400)

