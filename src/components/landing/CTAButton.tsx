"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight } from "lucide-react";

interface CTAButtonProps {
  text: string;
  className?: string;
}

export default function CTAButton({ text, className = "" }: CTAButtonProps) {
  const { data: session } = useSession();

  const href = session ? "/dashboard/clone" : "/auth/register";

  return (
    <Link
      href={href}
      className={`btn-primary text-lg px-8 py-4 flex items-center gap-2 group ${className}`}
    >
      {text}
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}
