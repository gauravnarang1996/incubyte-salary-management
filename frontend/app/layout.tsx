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
        <nav className="p-4 border-b">
          <Link
            href="/"
            className="mr-4"
          >
            Dashboard
          </Link>

          <Link href="/employees">
            Employees
          </Link>
        </nav>

        {children}
      </body>
    </html>
  );
}