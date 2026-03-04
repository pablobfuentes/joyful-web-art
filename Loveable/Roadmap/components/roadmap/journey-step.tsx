"use client"

import { useEffect, useRef, useState } from "react"

interface JourneyStepProps {
  index: number
  icon: string
  title: string
  description: string
  side: "left" | "right"
  thresholdPercent: number
}

export function JourneyStep({
  index,
  icon,
  title,
  description,
  side,
  thresholdPercent,
}: JourneyStepProps) {
  const stepRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true)
          setHasAnimated(true)
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
    )

    if (stepRef.current) observer.observe(stepRef.current)
    return () => observer.disconnect()
  }, [hasAnimated])

  return (
    <div
      ref={stepRef}
      className={`relative flex items-center w-full ${
        side === "left" ? "justify-start" : "justify-end"
      }`}
      style={{ minHeight: "40vh" }}
    >
      <div
        className={`relative max-w-md px-6 lg:px-0 transition-all duration-1000 ease-out ${
          side === "left" ? "lg:pr-16 lg:text-right" : "lg:pl-16 lg:text-left"
        } ${
          isVisible
            ? "opacity-100 translate-y-0"
            : `opacity-0 ${side === "left" ? "-translate-x-12" : "translate-x-12"} translate-y-8`
        }`}
      >
        {/* Step number indicator */}
        <div
          className={`inline-flex items-center gap-3 mb-4 ${
            side === "left" ? "lg:flex-row-reverse" : ""
          }`}
        >
          <span
            className={`text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Paso {String(index).padStart(2, "0")}
          </span>
          <div
            className={`h-px bg-primary/30 transition-all duration-1000 delay-300 ${
              isVisible ? "w-12" : "w-0"
            }`}
          />
        </div>

        {/* Icon — floating, large, organic */}
        <div
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        >
          <span className="text-5xl block mb-4" role="img" aria-hidden="true">
            {icon}
          </span>
        </div>

        {/* Title — serif, large */}
        <h3
          className={`font-serif text-3xl lg:text-4xl text-foreground mb-3 text-balance leading-tight transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={`text-muted-foreground text-base lg:text-lg leading-relaxed text-pretty transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {description}
        </p>

        {/* Decorative floating particles */}
        {isVisible && (
          <div className="absolute inset-0 pointer-events-none overflow-visible" aria-hidden="true">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-primary/10 animate-float"
                style={{
                  width: `${6 + i * 4}px`,
                  height: `${6 + i * 4}px`,
                  top: `${20 + i * 25}%`,
                  [side === "left" ? "right" : "left"]: `${-20 - i * 15}px`,
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: `${3 + i}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
