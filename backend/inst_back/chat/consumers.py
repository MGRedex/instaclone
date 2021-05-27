from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from .models import *
from api.models import Profile
# MAKE IT JSON CONSUMER
class ChatConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        '''
        Changing channel name to user_id 
        to make possible sending messages by id
        '''
        self.channel_name = self.scope['user'].id
        print(f'USER {self.scope["user"].id} CONNECTED')
        await self.accept()

    async def receive_json(self, message):
        await create_message(message)
        print(f'MESSAGE FROM {self.scope["user"].id} TO {message["receiver"]} RECEIVED')
        await self.channel_layer.send(
            f'{message["receiver"]}',
            {
                'type': 'chat_message',
                'message': message['text'],
                'sender': self.scope['user'].id,
                'receiver': message['receiver'],
            })

    async def disconnect(self, close_code):
        pass

    @database_sync_to_async
    def fetch_messages(self, event):
        pass

    @database_sync_to_async
    def create_message(self, message):
        chat_users = sorted(
            [
                self.scope['user'].id, 
                int(message['receiver']),
            ])
        try:
            chat = Chat.objects.get(name = f'{chat_users[0]}_{chat_users[1]}')
        except:
            chat = Chat.objects.create(name = f'{chat_users[0]}_{chat_users[1]}')

        message = Message.objects.create(text = message['text'], chat = chat)

        profile1 = Profile.objects.get(user__id = chat_users[0])
        message.users.add(profile1)

        profile2 = Profile.objects.get(user__id = chat_users[1])
        message.users.add(profile2)

        return f'MESSAGE {message.id} CREATED BETWEEN {profile1.user.id} AND {profile2.user.id}'

    async def chat_message(self, event):
        await self.send_json({
            'message': event['text'],
            'sender': event['sender'],
            'receiver': event['receiver'],
        })
        print(f'MESSAGE FROM {self.scope["user"].id} TO {message["receiver"]} SENDED')