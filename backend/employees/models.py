from django.db import models

# Create your models here.

class Employee(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    email = models.EmailField(unique=True)

    job_title = models.CharField(max_length=255)

    country = models.CharField(max_length=100)

    department = models.CharField(max_length=100)

    salary = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    date_joined = models.DateField(auto_now_add=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["country"]),
            models.Index(fields=["job_title"]),
            models.Index(fields=["salary"]),
        ]

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"