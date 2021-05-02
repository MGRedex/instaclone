from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.permissions import IsAuthenticated
from .serializers import *
from .models import *
from .serializers import *
from functools import reduce
# Create your views here.


class UserInfoDetail(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request, pk):
        model = Profile.objects.get(id = pk)
        serializer = ProfileSerializer(model)
        return Response(serializer.data)

class Feed(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        user_profile = Profile.objects.get(id=request.user.id-1)
        all_posts = [following_user.posts.all() for following_user in user_profile.following.all()]
        all_posts = reduce(lambda all_posts,posts: all_posts.union(posts), all_posts)
        serializer = PostSerializer(all_posts, many=True)
        return Response(serializer.data)