"use client";

import { useState } from "react";

export default function AddEmployee() {
  const [firstName, setFirstName] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    await fetch(
      "http://127.0.0.1:8000/api/employees/",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          first_name: firstName,
          last_name: "Doe",
          email:
            "test@example.com",
          job_title:
            "Software Engineer",
          country: "India",
          department:
            "Engineering",
          salary: 100000,
        }),
      }
    );

    alert("Employee Added");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        className="border p-2"
        placeholder="First Name"
        value={firstName}
        onChange={(e) =>
          setFirstName(
            e.target.value
          )
        }
      />

      <button
        type="submit"
        className="border p-2"
      >
        Add Employee
      </button>
    </form>
  );
}