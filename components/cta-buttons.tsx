"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTAButtons() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Button
        asChild
        className="min-w-48 h-12 px-6 text-base md:text-lg"
        style={{ background: "orange", color: "var(--color-primary-foreground)" }}
      >
        <Link href="/asteroid-info" aria-label="Go to asteroid information">
          Asteroid Info
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        className="min-w-48 h-12 px-6 text-base md:text-lg border bg-transparent"
        style={{ borderColor: "var(--color-border)", color: "var(--color-foreground)" }}
      >
        <Link href="/impact-zone" aria-label="Go to impact zone map">
          Impact Zone
        </Link>
      </Button>
    </div>
  )
}
