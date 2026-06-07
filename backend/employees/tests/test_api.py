import pytest
from rest_framework.test import APIClient
from employees.models import Employee


def create_employee(
    *,
    first_name="John",
    last_name="Doe",
    email="john@example.com",
    job_title="Engineer",
    country="India",
    department="Engineering",
    salary=100000
):
    return Employee.objects.create(
        first_name=first_name,
        last_name=last_name,
        email=email,
        job_title=job_title,
        country=country,
        department=department,
        salary=salary
    )

@pytest.mark.django_db
def test_create_employee_api():
    client = APIClient()

    payload = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "job_title": "Engineer",
        "country": "India",
        "department": "Engineering",
        "salary": 100000
    }

    response = client.post(
        "/api/employees/",
        payload,
        format="json"
    )

    assert response.status_code == 201


@pytest.mark.django_db
def test_country_salary_insights():
    ...


@pytest.mark.django_db
def test_employee_search_uses_default_search_parameter():
    client = APIClient()
    create_employee(
        first_name="Asha",
        last_name="Mehta",
        email="asha@example.com",
        department="Finance"
    )
    create_employee(
        first_name="Ravi",
        last_name="Kumar",
        email="ravi@example.com",
        department="Engineering"
    )

    response = client.get(
        "/api/employees/",
        {"search": "asha"}
    )

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["email"] == "asha@example.com"


@pytest.mark.django_db
def test_employee_search_supports_q_parameter_and_work_fields():
    client = APIClient()
    create_employee(
        first_name="Asha",
        last_name="Mehta",
        email="asha@example.com",
        job_title="Payroll Analyst",
        country="India",
        department="Finance"
    )
    create_employee(
        first_name="Ravi",
        last_name="Kumar",
        email="ravi@example.com",
        job_title="Backend Engineer",
        country="Canada",
        department="Engineering"
    )

    response = client.get(
        "/api/employees/",
        {"q": "payroll"}
    )

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["job_title"] == "Payroll Analyst"


@pytest.mark.django_db
def test_employee_search_can_be_combined_with_filters():
    client = APIClient()
    create_employee(
        first_name="Asha",
        last_name="Mehta",
        email="asha@example.com",
        job_title="Payroll Analyst",
        country="India",
        department="Finance"
    )
    create_employee(
        first_name="Asha",
        last_name="Brown",
        email="asha.brown@example.com",
        job_title="Payroll Analyst",
        country="Canada",
        department="Finance"
    )

    response = client.get(
        "/api/employees/",
        {
            "search": "asha",
            "country": "India",
        }
    )

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["country"] == "India"
