#!/bin/bash
echo 'Making migrations'
python manage.py migrate

echo 'Starting the server'
python manage.py runserver 0.0.0.0:8000