from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('auth/registration/', UserRegister.as_view(), name = 'user_register'),
    path('auth/logout/', UserLogout.as_view(), name = 'user_logout'),
    path('auth/token/', TokenObtainPairView.as_view(), name = 'token_obtain_pair'),
    path('auth/token/refresh', TokenRefreshView.as_view(), name = 'token_refresh'),
    path('auth/token/verify', TokenVerifyView.as_view(), name = 'token_verify'),
    path('auth/rest-auth/', include('rest_auth.urls')),
    path('userinfo/<int:pk>/', UserInfoDetail.as_view(), name="user_info"),
    path('feed/', Feed.as_view(), name="feed"),
    path('feed/<int:pk>/<str:action>/', LikeDislike.as_view(), name="like_dislike"),
    path('follow_system/<int:pk>/<str:action>/', FollowUnfollow.as_view(), name="follow_unfollow"),
    path('create_post/', CreatePost.as_view(), name="create_post"),
    path('post_comments/<int:post_id>/', PostComments.as_view(), name="post_comments"),
    # path('followedusersinfo/<int:pk>/', FollowedUsersView.as_view(), "followedusers"),
]
