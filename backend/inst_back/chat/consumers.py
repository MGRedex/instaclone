from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from .models import *
from api.models import Profile
from channels.layers import get_channel_layer
from datetime import datetime

class ChatConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        '''
        Adding user channel to group named as his id 
        to let other user channels easily send messages by id
        provided in message["receiver"]
        (you can't just change self.channel_name that doesn't work)
        '''
        await self.channel_layer.group_add(f'{self.scope["user"].id}', self.channel_name)

        '''
        Appending just created group to groups 
        so superclass will do groups cleanup
        '''
        self.groups.append(f'{self.scope["user"].id}')

        print(f'USER {self.scope["user"].id} CONNECTED TO {self.channel_name}')

        await self.accept()

    async def receive_json(self, message):
        '''
        Message structure:
        {
            sender: id of user that sended the message,
            receiver: id of user that will receive the message,
            text: text of the message,
            created: message creation date that calculated on client (2016-03-14 14:20:43.393)
        }
        '''
        print(f'MESSAGE FROM {self.scope["user"].id} TO {message["receiver"]} RECEIVED')

        message_obj, new_chat = await self.create_message(message)

        if new_chat:
            await self.channel_layer.group_send(
                message["receiver"],
                {
                    'type': 'chat_start',
                    'oppositeUserId': self.scope["user"].id,
                    'messages': [],
                }
            )
        await self.channel_layer.group_send(
           message["receiver"],
            {
                'type': 'chat_message',
                'text': message['text'],
                'sender': self.scope['user'].id,
                'receiver': message['receiver'],
                'created': message['created'],
            }
        )

    async def disconnect(self, close_code):
        pass

    @database_sync_to_async
    def create_message(self, message):
        new_chat = False
        
        sender_profile = Profile.objects.get(user__id = self.scope['user'].id)
        receiver_profile = Profile.objects.get(user__id = message['receiver'])

        try:
            chat = Chat.objects.filter(users__user__id = self.scope["user"].id).get(users__user__id = int(message['receiver']))
        except Chat.DoesNotExist:
            print(f'CREATING CHAT BETWEEN {sender_profile.user.id} AND {receiver_profile.user.id}')
            chat = Chat.objects.create()
            chat.users.add(sender_profile)
            chat.users.add(receiver_profile)
            new_chat = True

        message_creation_date = datetime.strptime(message['created'], '%Y-%m-%d %H:%M:%S.%f')
        message = Message.objects.create(
            text = message['text'], 
            chat = chat, 
            sender = sender_profile, 
            receiver = receiver_profile,
            created = message_creation_date)

        return (message, new_chat)
    
    async def chat_message(self, event):
        print(f'MESSAGE FROM {self.scope["user"].id} TO {event["receiver"]} SENDED')

        await self.send_json(
            {
                'type': 'new_message',
                'text': event['text'],
                'sender': event['sender'],
                'receiver': event['receiver'],
                'created': event['created'],
            }
        )

    async def chat_start(self, event):
        print(f'CHAT BETWEEN {self.scope["user"].id} AND {event["oppositeUserId"]} SENDED')

        await self.send_json(
            {
                'type': 'new_chat',
                'oppositeUserId': event['oppositeUserId'],
                'messages': event['messages'],
            }
        )