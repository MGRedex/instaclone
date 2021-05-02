from django.urls import path, include
from .views import *

urlpatterns = [
    path('userinfo/<int:pk>/', UserInfoDetail.as_view(), name="userinfo"),
    path('feed/', Feed.as_view(), name="feed"),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    # path('followedusersinfo/<int:pk>/', FollowedUsersView.as_view(), "followedusers"),
]
