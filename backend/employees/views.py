from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Employee
from .serializers import EmployeeSerializer

class EmployeeViewSet(viewsets.ModelViewSet):

    queryset = Employee.objects.all().order_by("id")

    serializer_class = EmployeeSerializer

    filterset_fields = [
        "country",
        "job_title",
        "department"
    ]

    search_fields = [
        "first_name",
        "last_name",
        "email"
    ]