import { CheckoutCard } from "@/components/CheckoutCard";

type Params = {
  params: Promise<{ publicToken: string }>;
};

export default async function CheckoutPage({ params }: Params) {
  const { publicToken } = await params;
  return <CheckoutCard publicToken={publicToken} />;
}
