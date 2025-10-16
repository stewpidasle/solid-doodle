"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"

interface ParticleLogoProps {
  /**
   * Text to display on the left side
   * @default "Stew Pidasle"
   */
  text?: string
  /**
   * Path to the logo SVG file
   * @default "/dodo-logo.svg"
   */
  logoPath?: string
  /**
   * Color for text particles when scattered
   * @default "#00DCFF"
   */
  textScatterColor?: string
  /**
   * Color for logo particles when scattered
   * @default "#FFD700"
   */
  logoScatterColor?: string
  /**
   * Base particle color when not scattered
   * @default "white"
   */
  baseColor?: string
  /**
   * Background color
   * @default "black"
   */
  backgroundColor?: string
  /**
   * Optional content to display below the particles
   */
  children?: React.ReactNode
}

export default function ParticleLogo({
  text = "StewPid",
  logoPath = "/dodo-logo.svg",
  textScatterColor = "#00DCFF",
  logoScatterColor = "#FFD700",
  baseColor = "white",
  backgroundColor = "black",
  children,
}: ParticleLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setIsMobile(window.innerWidth < 768)
    }

    updateCanvasSize()

    let particles: {
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
      color: string
      scatteredColor: string
      life: number
      isLogo: boolean
    }[] = []

    let textImageData: ImageData | null = null

    async function createTextImage() {
      if (!ctx || !canvas) return 0

      ctx.fillStyle = baseColor
      ctx.save()

      const logoHeight = isMobile ? 60 : 120

      // Measure text width
      ctx.font = `bold ${logoHeight}px Arial`
      const textWidth = ctx.measureText(text).width

      // Load and measure logo SVG
      const img = new Image()
      img.crossOrigin = "anonymous"
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = reject
        img.src = logoPath
      })

      // Calculate logo dimensions maintaining aspect ratio
      const logoAspectRatio = 150 / 150 // Original SVG dimensions
      const logoWidth = logoHeight * logoAspectRatio

      const logoSpacing = isMobile ? 30 : 60
      const totalWidth = textWidth + logoWidth + logoSpacing

      ctx.translate(canvas.width / 2 - totalWidth / 2, canvas.height / 2 - logoHeight / 2)

      // Draw text
      ctx.save()
      ctx.font = `bold ${logoHeight}px Arial`
      ctx.fillStyle = baseColor
      ctx.textBaseline = "top"
      ctx.fillText(text, 0, 0)
      ctx.restore()

      // Draw logo
      ctx.save()
      ctx.translate(textWidth + logoSpacing, 0)
      ctx.drawImage(img, 0, 0, logoWidth, logoHeight)
      ctx.restore()

      ctx.restore()

      textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      return 1
    }

    function createParticle(scale: number) {
      if (!ctx || !canvas || !textImageData) return null

      const data = textImageData.data

      for (let attempt = 0; attempt < 100; attempt++) {
        const x = Math.floor(Math.random() * canvas.width)
        const y = Math.floor(Math.random() * canvas.height)

        if (data[(y * canvas.width + x) * 4 + 3] > 128) {
          const logoHeight = isMobile ? 60 : 120
          ctx.font = `bold ${logoHeight}px Arial`
          const textWidth = ctx.measureText(text).width
          const logoWidth = logoHeight
          const logoSpacing = isMobile ? 30 : 60
          const totalWidth = textWidth + logoWidth + logoSpacing
          const centerX = canvas.width / 2
          const isLogoParticle = x >= centerX + totalWidth / 2 - logoWidth

          return {
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            size: Math.random() * 1 + 0.5,
            color: baseColor,
            scatteredColor: isLogoParticle ? logoScatterColor : textScatterColor,
            isLogo: isLogoParticle,
            life: Math.random() * 100 + 50,
          }
        }
      }

      return null
    }

    function createInitialParticles(scale: number) {
      const baseParticleCount = 7000
      const particleCount = Math.floor(baseParticleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)))
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(scale)
        if (particle) particles.push(particle)
      }
    }

    let animationFrameId: number

    function animate(scale: number) {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const { x: mouseX, y: mouseY } = mousePositionRef.current
      const maxDistance = 240

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance && (isTouchingRef.current || !("ontouchstart" in window))) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          const moveX = Math.cos(angle) * force * 60
          const moveY = Math.sin(angle) * force * 60
          p.x = p.baseX - moveX
          p.y = p.baseY - moveY

          ctx.fillStyle = p.scatteredColor
        } else {
          p.x += (p.baseX - p.x) * 0.1
          p.y += (p.baseY - p.y) * 0.1
          ctx.fillStyle = baseColor
        }

        ctx.fillRect(p.x, p.y, p.size, p.size)

        p.life--
        if (p.life <= 0) {
          const newParticle = createParticle(scale)
          if (newParticle) {
            particles[i] = newParticle
          } else {
            particles.splice(i, 1)
            i--
          }
        }
      }

      const baseParticleCount = 7000
      const targetParticleCount = Math.floor(
        baseParticleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)),
      )
      while (particles.length < targetParticleCount) {
        const newParticle = createParticle(scale)
        if (newParticle) particles.push(newParticle)
      }

      animationFrameId = requestAnimationFrame(() => animate(scale))
    }

    async function init() {
      const scale = await createTextImage()
      createInitialParticles(scale)
      animate(scale)
    }

    init()

    const handleResize = async () => {
      updateCanvasSize()
      const newScale = await createTextImage()
      particles = []
      createInitialParticles(newScale)
    }

    const handleMove = (x: number, y: number) => {
      mousePositionRef.current = { x, y }
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleTouchStart = () => {
      isTouchingRef.current = true
    }

    const handleTouchEnd = () => {
      isTouchingRef.current = false
      mousePositionRef.current = { x: 0, y: 0 }
    }

    const handleMouseLeave = () => {
      if (!("ontouchstart" in window)) {
        mousePositionRef.current = { x: 0, y: 0 }
      }
    }

    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("touchstart", handleTouchStart)
    canvas.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchend", handleTouchEnd)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile, text, logoPath, textScatterColor, logoScatterColor, baseColor, backgroundColor])

  return (
    <div className="relative w-full h-dvh flex flex-col items-center justify-center" style={{ backgroundColor }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute top-0 left-0 touch-none"
        aria-label={`Interactive particle effect with ${text} text and logo`}
      />
      {children && <div className="absolute bottom-[100px] text-center z-10">{children}</div>}
    </div>
  )
}
