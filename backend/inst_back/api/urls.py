from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
urlpatterns = [
    path('auth/registration/', UserRegister.as_view(), name = 'user_register'),
    path('auth/token/', TokenObtainPairView.as_view(), name = 'token_obtain_pair'),
    path('auth/token/refresh', TokenRefreshView.as_view(), name = 'token_refresh'),
    path('auth/token/verify', TokenVerifyView.as_view(), name = 'token_verify'),
    path('auth/rest-auth/', include('rest_auth.urls')),
    path('userinfo/<int:pk>/', UserInfoDetail.as_view(), name="user_info"),
    path('feed/', Feed.as_view(), name="feed"),
    # path('followedusersinfo/<int:pk>/', FollowedUsersView.as_view(), "followedusers"),
]
