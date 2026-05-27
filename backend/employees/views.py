from django.shortcuts import render
from rest_framework import viewsets
from .models import Employee
from .serializers import EmployeeSerializer
from django.db.models import Avg, Min, Max, Count
from rest_framework.decorators import api_view
from rest_framework.response import Response
# Create your views here.

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

@api_view(["GET"])
def country_salary_insights(request):

    data = (
        Employee.objects
        .values("country")
        .annotate(
            avg_salary=Avg("salary"),
            min_salary=Min("salary"),
            max_salary=Max("salary"),
            employee_count=Count("id")
        )
    )

    return Response(data)


@api_view(["GET"])
def job_title_salary_insights(request):

    data = (
        Employee.objects
        .values("country", "job_title")
        .annotate(
            avg_salary=Avg("salary")
        )
    )

    return Response(data)