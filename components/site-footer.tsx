"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function SiteFooter() {
  return (
    <footer
      className="mt-12"
      style={{
        background: "rgba(0, 0, 20, 0.8)",
        padding: "40px 0",
        textAlign: "center",
        color: "#FFFFFF",
        fontSize: "1rem",
        textShadow: "0 0 10px rgba(0,191,255,0.8)",
      }}
      aria-labelledby="site-footer"
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <p id="site-footer" className="font-[var(--font-display)] text-lg">
          Built with NASA Open Data and AI
        </p>
        <p className="mt-1">
          Open Source Project —{" "}
          <Link
            href="https://github.com/SathwikSastry/Neotrack-frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[var(--color-accent)] underline-offset-4"
          >
            View on GitHub
          </Link>
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Badge
            className="px-3 py-1"
            style={{ background: "#00BFFF", color: "#001018", boxShadow: "0 0 12px rgba(0,191,255,0.6)" }}
          >
            Built with NASA Data
          </Badge>
          <Badge
            className="px-3 py-1"
            style={{ background: "#32CD32", color: "#001018", boxShadow: "0 0 12px rgba(50,205,50,0.6)" }}
          >
            Open Source
          </Badge>
        </div>
      </div>
    </footer>
  )
}
