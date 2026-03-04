"use client"

import { useEffect, useRef, useState } from "react"
import { HeroSection } from "@/components/roadmap/hero-section"
import { JourneyStep } from "@/components/roadmap/journey-step"
import { ScrollProgress, FloatingNav } from "@/components/roadmap/scroll-progress"
import { ClosingSection } from "@/components/roadmap/closing-section"

const STEPS = [
  {
    icon: "📬",
    title: "Llega cuando lo esperas",
    description:
      "Sin incertidumbre. Sin perseguir envios. Se integra naturalmente en tu mes.",
    side: "left" as const,
  },
  {
    icon: "🎯",
    title: "Todo tiene un proposito",
    description:
      "Cada producto cumple una funcion dentro de la rutina. Nada sobra. Nada confunde.",
    side: "right" as const,
  },
  {
    icon: "📖",
    title: "Sabes exactamente como usarlo",
    description:
      "Instrucciones claras. Pasos simples. Sin presion por hacerlo perfecto.",
    side: "left" as const,
  },
  {
    icon: "🔄",
    title: "La rutina se completa",
    description:
      "Usas lo necesario. Sin acumulacion. La continuidad se vuelve parte de tu cuidado.",
    side: "right" as const,
  },
]

export default function RoadmapPage() {
  const journeyRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [drawProgress, setDrawProgress] = useState(0)
  const [totalLength, setTotalLength] = useState(0)
  const [dotPositions, setDotPositions] = useState<{ x: number; y: number }[]>([])

  // Initialize path
  useEffect(() => {
    if (!pathRef.current) return
    const length = pathRef.current.getTotalLength()
    setTotalLength(length)
    pathRef.current.style.strokeDasharray = `${length}`
    pathRef.current.style.strokeDashoffset = `${length}`

    // Calculate dot positions
    const positions = [0.15, 0.38, 0.62, 0.85].map((p) => {
      const point = pathRef.current!.getPointAtLength(length * p)
      return { x: point.x, y: point.y }
    })
    setDotPositions(positions)
  }, [])

  // Scroll handler for path drawing
  useEffect(() => {
    const handleScroll = () => {
      if (!journeyRef.current || totalLength === 0 || !pathRef.current) return

      const rect = journeyRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const scrollStart = rect.top + window.scrollY - windowHeight * 0.6
      const scrollEnd = rect.bottom + window.scrollY - windowHeight * 0.3
      const currentScroll = window.scrollY
      const progress = Math.min(
        Math.max((currentScroll - scrollStart) / (scrollEnd - scrollStart), 0),
        1
      )

      setDrawProgress(progress)
      pathRef.current.style.strokeDashoffset = `${totalLength * (1 - progress)}`
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [totalLength])

  const stepThresholds = [0.15, 0.38, 0.62, 0.85]

  return (
    <main className="relative bg-background overflow-x-hidden">
      <ScrollProgress />
      <FloatingNav />

      <HeroSection />

      {/* Journey Section with SVG path */}
      <div ref={journeyRef} className="relative max-w-6xl mx-auto px-6 lg:px-12">
        {/* SVG flowing path - centered */}
        <svg
          ref={svgRef}
          className="absolute left-1/2 top-0 -translate-x-1/2 h-full pointer-events-none hidden lg:block"
          width="200"
          viewBox="0 0 200 2000"
          fill="none"
          preserveAspectRatio="xMidYMin slice"
          aria-hidden="true"
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.42 0.1 155)" stopOpacity="0.6" />
              <stop offset="50%" stopColor="oklch(0.42 0.1 155)" />
              <stop offset="100%" stopColor="oklch(0.42 0.1 155)" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Ghost path */}
          <path
            d="M 100 0 
               C 100 60, 160 100, 160 200
               C 160 320, 40 360, 40 500
               C 40 640, 160 680, 160 820
               C 160 960, 40 1000, 40 1140
               C 40 1280, 160 1320, 160 1460
               C 160 1580, 40 1620, 40 1700
               C 40 1800, 100 1880, 100 2000"
            stroke="oklch(0.42 0.1 155 / 0.06)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Drawn path */}
          <path
            ref={pathRef}
            d="M 100 0 
               C 100 60, 160 100, 160 200
               C 160 320, 40 360, 40 500
               C 40 640, 160 680, 160 820
               C 160 960, 40 1000, 40 1140
               C 40 1280, 160 1320, 160 1460
               C 160 1580, 40 1620, 40 1700
               C 40 1800, 100 1880, 100 2000"
            stroke="url(#pathGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            filter="url(#glow)"
          />

          {/* Anchor dots */}
          {dotPositions.map((pos, i) => {
            const isActive = drawProgress >= stepThresholds[i]
            return (
              <g key={i}>
                {/* Outer pulse ring */}
                {isActive && (
                  <circle cx={pos.x} cy={pos.y} r="12" fill="none" stroke="oklch(0.42 0.1 155 / 0.2)" strokeWidth="1">
                    <animate attributeName="r" values="8;18;8" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Main dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isActive ? 6 : 3}
                  fill={isActive ? "oklch(0.42 0.1 155)" : "oklch(0.42 0.1 155 / 0.15)"}
                  className="transition-all duration-700"
                />
                {/* Inner highlight */}
                {isActive && (
                  <circle cx={pos.x} cy={pos.y} r="2" fill="oklch(0.97 0.005 80)" />
                )}
              </g>
            )
          })}

          {/* Traveling dot */}
          {drawProgress > 0.02 && pathRef.current && (
            (() => {
              const point = pathRef.current.getPointAtLength(totalLength * drawProgress)
              return (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="oklch(0.42 0.1 155)"
                  filter="url(#glow)"
                >
                  <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )
            })()
          )}
        </svg>

        {/* Mobile center line */}
        <div className="lg:hidden absolute left-6 top-0 bottom-0 w-px" aria-hidden="true">
          <div className="h-full bg-primary/10" />
          <div
            className="absolute top-0 left-0 w-full bg-primary/40 transition-[height] duration-100"
            style={{ height: `${drawProgress * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative">
          {STEPS.map((step, i) => (
            <div
              key={i}
              data-step={i}
              className={`relative flex items-center min-h-[55vh] ${
                step.side === "left"
                  ? "lg:justify-start"
                  : "lg:justify-end"
              }`}
            >
              <div
                className={`w-full lg:w-[45%] pl-12 lg:pl-0 ${
                  step.side === "left" ? "lg:pr-24" : "lg:pl-24"
                }`}
              >
                <JourneyStep
                  index={i + 1}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  side={step.side}
                  thresholdPercent={stepThresholds[i]}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <ClosingSection />
    </main>
  )
}
