import type { Metadata } from "next";

import { LoginForm } from "@/components/login-form";
import { PageHero, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Treasurer login",
};

export default function LoginPage() {
  return (
    <>
      <PageHero
        kicker="Treasurer"
        title="Board Budget login"
        lede="Use the treasurer password to open the Board Budget and adjust year-end forecasts."
      />
      <Section>
        <LoginForm />
      </Section>
    </>
  );
}
