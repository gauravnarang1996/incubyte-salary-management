import SalaryChart
from "@/components/SalaryChart";

export default function InsightsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-semibold tracking-normal">
        Salary Insights
      </h1>

      <section className="rounded-lg border bg-card p-4">
        <SalaryChart />
      </section>
    </main>
  );
}
