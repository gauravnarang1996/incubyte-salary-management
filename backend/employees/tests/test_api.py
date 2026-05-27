import pytest
from rest_framework.test import APIClient

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