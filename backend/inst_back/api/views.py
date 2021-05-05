from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.permissions import IsAuthenticated
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

class Feed(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        user_profile = Profile.objects.get(id=request.user.id)
        all_posts = [following_user.posts.all() for following_user in user_profile.following.all()]
        all_posts = reduce(lambda all_posts,posts: all_posts.union(posts), all_posts)
        serializer = PostSerializer(all_posts, many=True)
        return Response(serializer.data)

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
