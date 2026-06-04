from django.shortcuts import render
from rest_framework import viewsets
from .models import Employee
from .serializers import EmployeeSerializer
from django.db.models import Avg, Min, Max, Count, Sum
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


@api_view(["GET"])
def payroll_cost(request):

    total = Employee.objects.aggregate(
        total_payroll=Sum("salary")
    )

    return Response(total)


@api_view(["GET"])
def employees_by_country(request):

    data = (
        Employee.objects
        .values("country")
        .annotate(
            count=Count("id")
        )
    )

    return Response(data)

@api_view(["GET"])
def dashboard_metrics(request):

    total_employees = Employee.objects.count()

    avg_salary = (
        Employee.objects.aggregate(
            avg_salary=Avg("salary")
        )
    )

    countries = (
        Employee.objects
        .values("country")
        .distinct()
        .count()
    )

    payroll = (
        Employee.objects.aggregate(
            payroll=Sum("salary")
        )
    )

    return Response({
        "total_employees":
            total_employees,
        "avg_salary":
            avg_salary["avg_salary"],
        "countries":
            countries,
        "payroll":
            payroll["payroll"]
    })