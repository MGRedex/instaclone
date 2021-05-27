import os
from django.core.asgi import get_asgi_application
from chat.middleware import JWTAuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import chat.routing
from chat.consumers import *
from django.urls import re_path

from channels.security.websocket import AllowedHostsOriginValidator
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'inst_back.settings')

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AllowedHostsOriginValidator(
        JWTAuthMiddlewareStack(
        URLRouter([
            re_path(r'^ws/chat/$', ChatConsumer.as_asgi())
            ]
        )
    ))
})
# (?P<token>[\w.]+)/