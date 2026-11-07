import { Container } from "@/components/ui/container";

export default function ExploreLoading() {
  return (
    <Container className="py-14">
      <div className="h-12 w-64 animate-pulse rounded-xl bg-lavender" />
      <div className="mt-4 h-5 w-96 max-w-full animate-pulse rounded-lg bg-lavender" />
      <div className="mt-8 h-12 w-full animate-pulse rounded-2xl bg-lavender" />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="aspect-[16/9] animate-pulse bg-lavender" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-24 animate-pulse rounded-full bg-lavender" />
              <div className="h-6 w-4/5 animate-pulse rounded-lg bg-lavender" />
              <div className="h-4 w-full animate-pulse rounded-lg bg-lavender" />
              <div className="h-4 w-2/3 animate-pulse rounded-lg bg-lavender" />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
