from django.urls import path, include
from .views import *

urlpatterns = [
    path('userinfo/<int:pk>/', UserInfoDetail.as_view(), name="userinfo"),
    path('feed/', Feed.as_view(), name="feed"),
    # path('followedusersinfo/<int:pk>/', FollowedUsersView.as_view(), "followedusers"),
]
