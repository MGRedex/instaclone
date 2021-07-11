from django.db import models
from api.models import Profile

class Chat(models.Model):
    started = models.DateTimeField(
        auto_now_add = True)
        
    users = models.ManyToManyField(
        Profile, 
        related_name = 'chats')


class Message(models.Model):
    text = models.CharField(
        max_length = 250)

    chat = models.ForeignKey(
        Chat, 
        related_name = 'messages', 
        on_delete = models.CASCADE)
        
    sender = models.ForeignKey(
        Profile, 
        related_name = 'sended_messages', 
        on_delete = models.CASCADE,
        blank = True)

    receiver = models.ForeignKey(
        Profile, 
        related_name = 'received_messages', 
        on_delete = models.CASCADE,
        blank = True)
    
    created = models.DateTimeField(editable = False, null = True)

    class Meta:
        ordering = ['created']