"use client"

import { motion } from "framer-motion"
import Link from "next/link"

type Member = {
  name: string
  role: string
  avatar: string
  github: string
  glowColor: string
}

const members: Member[] = [
  {
    name: "Samar Shanubhog",
    role: "Team Leader & Frontend Devoleper",
    avatar: "/placeholder-user.jpg",
    github: "https://github.com/Samar-Shanubhog",
    glowColor: "#00BFFF",
  },
  {
    name: "Kishan A Bharadwaj",
    role: "Designer",
    avatar: "/placeholder-user.jpg",
    github: "https://github.com/kishanabharadwaj",
    glowColor: "#FF8C00",
  },
  {
    name: "Sameer S J",
    role: "Game Developer and designer",
    avatar: "/placeholder-user.jpg",
    github: "https://github.com/sameersj008",
    glowColor: "#32CD32",
  },
  {
    name: "Prahlad Kulkarni",
    role: "Designer and researcher",
    avatar: "/placeholder-user.jpg",
    github: "https://github.com/PrahladNK",
    glowColor: "#FFD700",
  },
  {
    name: "Sathwik Sastry",
    role: "Full Stack Developer",
    avatar: "/placeholder-user.jpg",
    github: "https://github.com/SathwikSastry",
    glowColor: "#00FFFF",
  },
]

export function Contributors() {
  return (
    <div
      className="mt-6 rounded-xl p-6"
      style={{
        background: "radial-gradient(1200px 400px at 50% 0%, rgba(0, 15, 45, 0.4) 0%, rgba(0,0,0,0) 70%)",
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {members.map((m, i) => (
          <motion.div
            key={m.github}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px -10% 0px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group relative rounded-lg border p-4"
            style={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(12px)",
              boxShadow: `0 0 20px rgba(0, 191, 255, 0.15)`,
            }}
          >
            <div className="flex flex-col items-center text-center">
              <img
                src={m.avatar || "/placeholder-user.jpg"}
                alt={`${m.name} avatar`}
                className="size-16 rounded-full object-cover"
              />
              <div className="mt-3">
                <p className="font-medium">{m.name}</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">{m.role}</p>
              </div>
              <Link
                href={m.github}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition"
                style={{
                  background: "linear-gradient(90deg, #FF8C00, #00BFFF)",
                  color: "#FFFFFF",
                  boxShadow: "0 0 30px rgba(255,140,0,0.5)",
                }}
              >
                View GitHub
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
