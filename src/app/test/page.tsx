import { Suspense } from "react";
import { TestRunner } from "@/components/TestRunner";

export default function TestPage() {
  return (
    <Suspense fallback={<main style={{ width: "min(920px, 94vw)", margin: "4rem auto" }}>Loading test...</main>}>
      <TestRunner />
    </Suspense>
  );
}
