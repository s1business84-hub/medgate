"use client";

import { ReactNode } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/all";

interface SmoothScrollLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  duration?: number;
}

export function SmoothScrollLink({ 
  href, 
  children, 
  className = "", 
  duration = 1.2 
}: SmoothScrollLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollToPlugin);
      
      gsap.to(window, {
        duration,
        scrollTo: href,
        ease: "power3.inOut",
      });
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
