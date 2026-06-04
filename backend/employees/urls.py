from django.urls import path, include
from rest_framework.routers import DefaultRouter

#from .views import EmployeeViewSet, country_salary_insights, job_title_salary_insights
from .views import *
router = DefaultRouter()

router.register(
    "employees",
    EmployeeViewSet,
    basename="employees"
)

urlpatterns = [
    path("", include(router.urls)),
    path(
        "insights/country/",
        country_salary_insights
    ),

    path(
        "insights/job-title/",
        job_title_salary_insights
    ),
    path(
    "insights/payroll/",
        payroll_cost
    ),

    path(
        "insights/employees-by-country/",
        employees_by_country
    ),
    path(
    "dashboard/",
    dashboard_metrics
        ),

]