"use client"

import { useEffect, useRef, useState } from "react"

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const opacity = Math.max(0, 1 - scrollY / 600)
  const translateY = scrollY * 0.3

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      {/* Floating background organic shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/[0.04] blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-accent/[0.03] blur-3xl"
          style={{ transform: `translateY(${scrollY * -0.05}px)` }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-primary/[0.03] blur-2xl"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />
      </div>

      <div style={{ opacity, transform: `translateY(${translateY}px)` }}>
        {/* Overline */}
        <p className="text-xs font-medium tracking-[0.4em] uppercase text-muted-foreground mb-8">
          Tu experiencia
        </p>

        {/* Main heading */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 text-balance leading-[1.1]">
          Cada mes,
          <br />
          <span className="text-primary">un ritual</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-lg mx-auto text-muted-foreground text-lg lg:text-xl leading-relaxed text-pretty mb-12">
          No es solo un envio. Es una experiencia pensada para que tu rutina fluya sin esfuerzo.
        </p>

        {/* Scroll hint */}
        <div className="flex flex-col items-center gap-2 animate-bounce-gentle">
          <span className="text-xs tracking-widest uppercase text-muted-foreground/60">
            Descubre
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-muted-foreground/40"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </section>
  )
}
