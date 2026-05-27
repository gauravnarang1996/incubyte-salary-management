from django.core.management.base import BaseCommand
from faker import Faker

from employees.models import Employee

fake = Faker()

class Command(BaseCommand):

    def handle(self, *args, **kwargs):

        batch = []

        for _ in range(10000):

            batch.append(
                Employee(
                    first_name=fake.first_name(),
                    last_name=fake.last_name(),
                    email=fake.unique.email(),
                    job_title=fake.job(),
                    country=fake.country(),
                    department="Engineering",
                    salary=fake.random_int(
                        min=30000,
                        max=250000
                    )
                )
            )

        Employee.objects.bulk_create(
            batch,
            batch_size=1000
        )

        self.stdout.write(
            self.style.SUCCESS(
                "10,000 employees seeded"
            )
        )