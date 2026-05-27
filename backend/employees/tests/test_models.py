import pytest
from employees.models import Employee

@pytest.mark.django_db
def test_create_employee():
    employee = Employee.objects.create(
        first_name="John",
        last_name="Doe",
        email="john@example.com",
        job_title="Software Engineer",
        country="India",
        department="Engineering",
        salary=100000
    )

    assert employee.first_name == "John"