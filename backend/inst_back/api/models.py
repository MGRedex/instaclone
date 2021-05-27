from django.db import models
from django.contrib.auth.models import User

def get_avatar_upload_url(instance, filename):
    filename = filename.split('.')
    format = filename[1]
    return f"{instance.user.id}/avatar/profile_image.{format}"

def get_post_upload_url(instance, filename):
    filename = filename.split('.')
    format = filename[1]
    return f"{instance.author.user.id}/posts/{instance.caption}.{format}"

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(
        User,
        related_name = ("profile"), 
        on_delete=models.CASCADE)

    avatar = models.ImageField(upload_to = get_avatar_upload_url, null = True, blank = True)

    following = models.ManyToManyField(
        'self', 
        related_name = ("followers"),
        blank = True,
        symmetrical = False)
        

    def __str__(self):
        return f"{self.user.username}"

class Post(models.Model):
    caption = models.CharField(
        max_length=50)

    created = models.DateTimeField(
        auto_now_add=True)

    author = models.ForeignKey(
        "profile",
        related_name=("posts"), 
        on_delete=models.CASCADE,
        blank = True)

    likes = models.ManyToManyField(
        "profile",
        related_name=("liked_posts"),
        blank = True)

    content = models.ImageField(upload_to = get_post_upload_url, null = True, blank = True)

    def __str__(self):
        return f"{self.caption}"


class Comment(models.Model):
    text = models.CharField(max_length = 500)

    author = models.ForeignKey(
        "profile",
        related_name=("comments"), 
        on_delete=models.CASCADE,
        blank = True)

    post = models.ForeignKey(
        "post",
        related_name=("comments"), 
        on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.text[:10]}"




    
