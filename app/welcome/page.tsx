import Link from "next/link";

export default function Welcome() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col items-center bg-surface px-6 pb-10 pt-20 text-center">
      <div className="flex h-[140px] w-[140px] items-center justify-center rounded-full bg-primary text-7xl font-bold text-white">
        +
      </div>
      <h1 className="mt-12 text-3xl font-bold text-ink">
        Aapki sehat, aapki bhasha mein
      </h1>
      <p className="mt-4 text-base text-muted">
        AI se apni sehat ke baare mein poochho, Hindi ya Gujarati mein
      </p>
      <Link
        href="/language"
        className="mt-auto block w-full rounded-full bg-primary py-4 text-center text-base font-semibold text-white shadow-md"
      >
        Shuru karein
      </Link>
    </main>
  );
}