from django.contrib import admin
from .models import *

admin.site.register(Profile)
admin.site.register(Comment)

class PostAdmin(admin.ModelAdmin):
    readonly_fields = ('created',) 

admin.site.register(Post, PostAdmin)
