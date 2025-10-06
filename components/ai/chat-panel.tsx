"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

const STARTERS = [
  "What is an asteroid impact?",
  "How does Neotrack.Earth detect asteroids?",
  "Tell me about the DART mission.",
  "Compare an asteroid impact to a nuclear blast.",
  "Explain asteroid composition.",
]

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
]

export function ChatPanel() {
  const apiBase = (typeof window !== "undefined" && (window as any).__NEOTRACK_API_BASE__) || ""
  const [language, setLanguage] = useState<string>("en")
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "👋 Hello Explorer! I’m Neotrack AI — ask me anything about asteroids, impact energy, or space defense.",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  async function sendQuery(query: string) {
    const trimmed = query.trim()
    if (!trimmed) return
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: trimmed }])
    setInput("")
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/api/ask-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed, language }),
      })
      const data = await res.json()
      const answer = data?.response || "Sorry, I couldn't generate a response."
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: answer }])
    } catch (e) {
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: "Network error contacting Space AI. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    void sendQuery(input)
  }

  return (
    <div className="relative w-full">
      <div className="absolute inset-0 -z-10">
        {/* subtle animated stars/nebula */}
        <div className="pointer-events-none h-full w-full bg-[radial-gradient(ellipse_at_top,rgba(255,140,0,0.08),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(0,191,255,0.08),transparent_55%)] animate-pulse [animation-duration:5s]" />
      </div>

      <div
        className="mx-auto w-full max-w-[900px] rounded-2xl border border-[var(--color-border)]/60 bg-[color:rgba(255,255,255,0.05)]/40 backdrop-blur-xl shadow-[0_0_40px_rgba(255,140,0,0.18)]"
        style={{ boxShadow: "0 0 50px rgba(255,69,0,0.18)" }}
      >
        <div className="flex items-center justify-between p-4 md:p-6">
          <div>
            <h2 className="font-[var(--font-orbitron)] text-2xl md:text-3xl">Ask the Space AI</h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Explore the unknown. Ask about asteroids, impacts, or space technology — powered by Groq Intelligence.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="lang">Language</label>
            <select
              id="lang"
              className="rounded-md border bg-background px-2 py-1 text-sm"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select language"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Starters */}
        <div className="px-4 md:px-6 pb-2 flex flex-wrap gap-2">
          {STARTERS.map((s) => (
            <button
              key={s}
              className="text-xs md:text-sm rounded-full border border-[var(--color-border)]/70 bg-background/40 px-3 py-1 hover:brightness-110"
              onClick={() => sendQuery(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div ref={scrollRef} className="px-4 md:px-6 pt-2 h-[48vh] md:h-[56vh] overflow-y-auto custom-scroll">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className={`my-2 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[78%] rounded-xl bg-gradient-to-br from-[#FF8C00]/90 to-[#FF4500]/80 text-white shadow-[0_0_20px_rgba(255,140,0,0.35)] px-4 py-3"
                      : "max-w-[78%] rounded-xl bg-[rgba(255,255,255,0.06)] text-[var(--color-foreground)] border border-[rgba(0,191,255,0.25)] shadow-[0_0_20px_rgba(0,191,255,0.2)] px-4 py-3"
                  }
                >
                  {m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="my-2 flex justify-start">
              <div className="flex items-center gap-1 rounded-xl bg-[rgba(255,255,255,0.06)] border border-[rgba(0,191,255,0.25)] px-4 py-3">
                <span className="size-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0ms]" />
                <span className="size-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:120ms]" />
                <span className="size-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:240ms]" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={onSubmit} className="sticky bottom-0 p-3 md:p-4">
          <div className="mx-auto flex w-full max-w-[840px] items-center gap-2 rounded-full border border-[var(--color-border)] bg-background/70 backdrop-blur-md px-3 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about asteroids, impacts, or space tech..."
              className="flex-1 bg-transparent outline-none text-sm md:text-base"
              aria-label="Message Space AI"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  void sendQuery(input)
                }
              }}
            />
            <Button
              type="submit"
              className="rounded-full bg-gradient-to-r from-[#FF8C00] to-[#FF4500] px-4 py-2 text-white shadow-[0_0_20px_rgba(255,140,0,0.35)]"
              disabled={loading}
              aria-label="Send message"
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatPanel


