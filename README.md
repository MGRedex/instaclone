# Instaclone

## Contents
1.[About the project](#about-the-project)
  1. [Description](#description)
  2. [Frontend](#frontend)
  3. [Backend](#backend)
  4. [Security](#security)

2.[How to run the project](#how-to-run-the-project)

3.[All features check list](#all-features-check-list)

## About the project

### Description
‼️**Instaclone is an android social app created as a practice project, not for production.**‼️

Initially, project was written using React-native and Firebase, later, due to backend practice, Firebase was changed to Python Django.

Since Instaclone is not yet complete, not all features are provided, so there is a
[list of planned features](#all-features-check-list)

### Frontend
Was written using:
- Javascript
- React-native
- Axios
- Expo
- Redux

### Backend
Was written using:
- Python
- Django
- Django Rest Framework
- SimpleJWT
- Channels
- PostgreSQL (was changed from MySQL)
- Redis

### Security
Since Instaclone is not for production, some security measures are not available (such as https and wss), but everyone can
do it localy with third-party software (like ngrok for https).

What about storage, PostgreSQL secured and available only for django connection, JWT tokens storage on client is a [secure storage](https://docs.expo.io/versions/latest/sdk/securestore/)
## How to run the project

#### Installing
1. Clone project repository
2. Download required python version (3.8) from [official website](https://www.python.org/downloads/). On linux you can install python [from command prompt](https://docs.python-guide.org/starting/install3/linux/).
3. Install pipenv and all required packages:
```
pip install pipenv

cd folder-with-cloned-project/backend

# Automatically will create venv and install required packages
pipenv install

# To enter in venv
pipenv shell

# To exit venv
exit
```
4. [Install PostgreSQL](https://www.postgresql.org/download/)
5. Install required npm packages
```
cd folder-with-cloned-project/backend

# Automatically will create venv and install required packages
pipenv install

# To enter in venv
pipenv shell

# To exit venv
exit
```
## All features check list
✔️ Chat

✔️ Feed

✔️ Post creating

✔️ Likes and comments

❌ Group chats

❌ Account statictic

❌ Stories

❌ Broadcasts

❌ Recomendation system

❌ Push notifications
