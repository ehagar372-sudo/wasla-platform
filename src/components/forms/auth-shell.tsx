import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

export function AuthShell({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <div className="hero-glow">
      <Container className="grid min-h-[calc(100vh-4.5rem)] place-items-center py-12">
        <div className="card w-full max-w-md p-7 sm:p-9">
          <h1 className="text-3xl font-black">{title}</h1>
          <p className="mb-8 mt-2 text-muted">{text}</p>
          {children}
        </div>
      </Container>
    </div>
  );
}
