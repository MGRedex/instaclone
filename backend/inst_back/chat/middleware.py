from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model

@database_sync_to_async
def get_user(user_id):
    User = get_user_model()
    try:
        return User.objects.get(id = user_id)
    except User.DoesNotExist:
        return 'AnonymousUser'

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        authentication = JWTAuthentication()
        try:
            raw_token = scope["query_string"].decode().split('=')[1]
            validated_token = authentication.get_validated_token(raw_token)
            scope['user'] = await get_user(validated_token['user_id'])
        except:
            raise

        return await self.inner(scope, receive, send)

def JWTAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))