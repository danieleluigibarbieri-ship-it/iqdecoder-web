import { ResultPanel } from "@/components/ResultPanel";

type Params = {
  params: Promise<{ publicToken: string }>;
};

type Search = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function ResultPage({ params, searchParams }: Params & Search) {
  const { publicToken } = await params;
  const { lang } = await searchParams;
  return <ResultPanel publicToken={publicToken} locale={lang ?? "en"} />;
}
