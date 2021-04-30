from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.permissions import IsAuthenticated
from .serializers import *
from .models import *
from .serializers import *
# Create your views here.


class UserInfoDetail(APIView):
    def get(self, request, pk):
        model = Profile.objects.get(id = pk)
        serializer = ProfileSerializer(model)
        return Response(serializer.data)

class Feed(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        model = Post.objects.all()
        serializer = PostSerializer(model, many=True)
        return Response(serializer.data)