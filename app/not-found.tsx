import Link from "next/link";
export default function NotFound() {
  return (
    <section className="empty not-found">
      <span className="eyebrow">404 · PAGE NOT FOUND</span>
      <h1>This page is off the table.</h1>
      <p>Browse our game library or return to the home page.</p>
      <Link className="primary" href="/">
        Back to Home
      </Link>
    </section>
  );
}
