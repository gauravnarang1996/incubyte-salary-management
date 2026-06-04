"use client";

import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalaryChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(
      "http://127.0.0.1:8000/api/insights/country/"
    )
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <ResponsiveContainer
      width="100%"
      height={400}
    >
      <BarChart data={data}>
        <XAxis dataKey="country" />

        <YAxis />

        <Tooltip />

        <Bar dataKey="avg_salary" />
      </BarChart>
    </ResponsiveContainer>
  );
}