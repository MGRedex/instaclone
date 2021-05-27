from django.db import models
from api.models import Profile

class Chat(models.Model):
    name = models.CharField(max_length = 50)
    started = models.DateTimeField(auto_now_add = True)

class Message(models.Model):
    text = models.CharField(max_length = 250)
    chat = models.ForeignKey(Chat, related_name = 'messages', on_delete=models.CASCADE)
    users = models.ManyToManyField(Profile, related_name = 'messages')