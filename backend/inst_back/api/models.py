from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(
        User,
        related_name = ("Profile"), 
        on_delete=models.CASCADE)
    
    email = models.EmailField(
        max_length=254)

    following = models.ManyToManyField(
        'self', 
        related_name=("followers"),
        blank=True,
        symmetrical=False)
        

    def __str__(self):
        return f"{self.user.username}"

    
class Post(models.Model):
    caption = models.CharField(
        max_length=50)

    created = models.DateTimeField(
        auto_now_add=True)

    author = models.ForeignKey(
        "Profile",
        related_name=("Posts"), 
        on_delete=models.CASCADE)

    likes = models.ManyToManyField(
        "Profile",
        related_name=("LikedPosts"),
        blank=True)

    def __str__(self):
        return f"{self.caption}"



    
