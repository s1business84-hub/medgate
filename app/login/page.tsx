"use client";

import { Suspense } from "react";
import LoginForm from "./login-form";
import { ScrollableViewport, ScrollSection } from "@/components/scrollable-viewport";

export default function LoginPage() {
  return (
    <ScrollableViewport
      showProgress={true}
      showNavigationDots={true}
      showArrows={true}
      snapToSections={false}
    >
      <ScrollSection id="login">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </ScrollSection>
    </ScrollableViewport>
  );
}
