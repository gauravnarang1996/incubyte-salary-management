import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="border-b px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center gap-4 text-sm font-medium">
            <Link href="/">
              Dashboard
            </Link>

            <Link href="/employees">
              Employees
            </Link>

            <Link href="/insights">
              Insights
            </Link>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
