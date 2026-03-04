"use client"

import { useEffect, useRef, useState } from "react"

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY / docHeight
      setProgress(scrolled)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-border/50">
      <div
        className="h-full bg-primary transition-[width] duration-100 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}

export function FloatingNav() {
  const [activeStep, setActiveStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400)

      const sections = document.querySelectorAll("[data-step]")
      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.5 && rect.bottom > 0) {
          setActiveStep(i)
        }
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-3"
      aria-label="Navegación del roadmap"
    >
      {[0, 1, 2, 3].map((i) => (
        <button
          key={i}
          onClick={() => {
            const el = document.querySelector(`[data-step="${i}"]`)
            el?.scrollIntoView({ behavior: "smooth", block: "center" })
          }}
          className={`group relative flex items-center justify-center transition-all duration-500 ${
            activeStep === i ? "scale-100" : "scale-75 opacity-50 hover:opacity-80"
          }`}
          aria-label={`Ir al paso ${i + 1}`}
        >
          <span
            className={`block rounded-full transition-all duration-500 ${
              activeStep === i
                ? "w-3 h-3 bg-primary"
                : "w-2 h-2 bg-muted-foreground/30"
            }`}
          />
          {activeStep === i && (
            <span className="absolute w-6 h-6 rounded-full border border-primary/30 animate-ping-slow" />
          )}
        </button>
      ))}
    </nav>
  )
}
