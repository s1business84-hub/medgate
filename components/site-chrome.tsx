"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { MarketingHeader } from "@/components/home/marketing-header";
import { SiteFooter } from "@/components/home/site-footer";
import { Footer } from "@/components/sections/footer";

/**
 * Marketing routes use the light "clean healthcare SaaS" chrome; the
 * logged-in portal keeps the existing dark chrome. Anything not listed
 * here is treated as portal.
 */
const MARKETING_ROUTES = ["/", "/programs", "/student", "/for-hospitals", "/login"];

function isMarketing(pathname: string | null) {
  if (!pathname) return true;
  return MARKETING_ROUTES.includes(pathname);
}

export function SiteHeader() {
  return isMarketing(usePathname()) ? <MarketingHeader /> : <Header />;
}

export function SiteFooterSlot() {
  return isMarketing(usePathname()) ? <SiteFooter /> : <Footer />;
}
