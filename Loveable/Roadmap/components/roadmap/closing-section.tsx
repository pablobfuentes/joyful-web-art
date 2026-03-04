"use client"

import { useEffect, useState } from "react"

export function ClosingSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById("closing-section")
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.7) {
        setIsVisible(true)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section
      id="closing-section"
      className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 pb-24"
    >
      <div
        className={`transition-all duration-1200 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="w-16 h-px bg-primary/30 mx-auto mb-8" />

        <p className="text-xs font-medium tracking-[0.4em] uppercase text-muted-foreground mb-6">
          Tu rutina empieza aqui
        </p>

        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 text-balance leading-tight">
          Simple. Claro.
          <br />
          <span className="text-primary">Tuyo.</span>
        </h2>

        <p className="max-w-md mx-auto text-muted-foreground text-lg leading-relaxed mb-10">
          Sin complicaciones. Sin excesos. Solo lo que necesitas, cuando lo necesitas.
        </p>

        <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-medium text-sm tracking-wide uppercase rounded-full overflow-hidden transition-all duration-500 hover:gap-5">
          <span>Comenzar</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform duration-500 group-hover:translate-x-1"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  )
}
