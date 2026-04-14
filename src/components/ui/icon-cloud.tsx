"use client"

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { renderToString } from "react-dom/server"

interface Icon {
  x: number
  y: number
  z: number
  scale: number
  opacity: number
  id: number
}

interface IconCloudProps {
  icons?: React.ReactNode[]
  images?: string[]
  labels?: string[]
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

const ICON_SIZE = 50
const RENDER_SIZE = 256 // High-res offscreen raster so hover-scale stays crisp
const SPHERE_RADIUS = 450
const SPHERE_RADIUS_X = 550
const CANVAS_SIZE = 1200

function computeIconPositions(icons?: React.ReactNode[], images?: string[]): Icon[] {
  const items = icons ?? images ?? []
  const newIcons: Icon[] = []
  const numIcons = items.length || 20

  const offset = 2 / numIcons
  const increment = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < numIcons; i++) {
    const y = i * offset - 1 + offset / 2
    const r = Math.sqrt(1 - y * y)
    const phi = i * increment

    const x = Math.cos(phi) * r
    const z = Math.sin(phi) * r

    newIcons.push({
      x: x * SPHERE_RADIUS_X,
      y: y * SPHERE_RADIUS,
      z: z * SPHERE_RADIUS,
      scale: 1,
      opacity: 1,
      id: i,
    })
  }
  return newIcons
}

export function IconCloud({ icons, images, labels }: IconCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [iconPositions] = useState(() => computeIconPositions(icons, images))
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [targetRotation, setTargetRotation] = useState<{
    x: number
    y: number
    startX: number
    startY: number
    distance: number
    startTime: number
    duration: number
  } | null>(null)
  const animationFrameRef = useRef<number>(0)
  const rotationRef = useRef({ x: 0, y: 0 })
  const iconCanvasesRef = useRef<HTMLCanvasElement[]>([])
  const imagesLoadedRef = useRef<boolean[]>([])

  // Create icon canvases once when icons/images change
  useEffect(() => {
    if (!icons && !images) return

    const items = icons ?? images ?? []
    imagesLoadedRef.current = new Array(items.length).fill(false)

    const newIconCanvases = items.map((item, index) => {
      const offscreen = document.createElement("canvas")
      offscreen.width = RENDER_SIZE
      offscreen.height = RENDER_SIZE
      const offCtx = offscreen.getContext("2d")

      if (offCtx) {
        offCtx.imageSmoothingEnabled = true
        offCtx.imageSmoothingQuality = "high"
        if (images) {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.src = items[index] as string
          img.onload = () => {
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height)
            const half = RENDER_SIZE / 2
            offCtx.beginPath()
            offCtx.arc(half, half, half, 0, Math.PI * 2)
            offCtx.closePath()
            offCtx.clip()
            offCtx.drawImage(img, 0, 0, RENDER_SIZE, RENDER_SIZE)
            imagesLoadedRef.current[index] = true
          }
        } else {
          const svgString = renderToString(item as React.ReactElement)
          // Replace any existing width/height with RENDER_SIZE so rasterisation
          // happens at high resolution (drawImage will still size to ICON_SIZE).
          const sized = svgString
            .replace(/\swidth="[^"]*"/, "")
            .replace(/\sheight="[^"]*"/, "")
            .replace(
              /<svg\b/,
              `<svg width="${RENDER_SIZE}" height="${RENDER_SIZE}"`
            )
          const img = new Image()
          img.src = "data:image/svg+xml;base64," + btoa(sized)
          img.onload = () => {
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height)
            offCtx.drawImage(img, 0, 0, RENDER_SIZE, RENDER_SIZE)
            imagesLoadedRef.current[index] = true
          }
        }
      }
      return offscreen
    })

    iconCanvasesRef.current = newIconCanvases
  }, [icons, images])

  // Compute projected screen positions for an icon
  const getScreenPos = useCallback(
    (icon: Icon) => {
      const cosX = Math.cos(rotationRef.current.x)
      const sinX = Math.sin(rotationRef.current.x)
      const cosY = Math.cos(rotationRef.current.y)
      const sinY = Math.sin(rotationRef.current.y)

      const rotatedX = icon.x * cosY - icon.z * sinY
      const rotatedZ = icon.x * sinY + icon.z * cosY
      const rotatedY = icon.y * cosX + rotatedZ * sinX

      const screenX = CANVAS_SIZE / 2 + rotatedX
      const screenY = CANVAS_SIZE / 2 + rotatedY
      const scale = (rotatedZ + 250) / 350

      return { screenX, screenY, scale, rotatedZ }
    },
    []
  )

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect || !canvasRef.current) return

    const scaleX = CANVAS_SIZE / rect.width
    const scaleY = CANVAS_SIZE / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    for (const icon of iconPositions) {
      const { screenX, screenY, scale } = getScreenPos(icon)
      const radius = (ICON_SIZE / 2) * scale
      const dx = x - screenX
      const dy = y - screenY

      if (dx * dx + dy * dy < radius * radius) {
        const targetX = -Math.atan2(
          icon.y,
          Math.sqrt(icon.x * icon.x + icon.z * icon.z)
        )
        const targetY = Math.atan2(icon.x, icon.z)

        const currentX = rotationRef.current.x
        const currentY = rotationRef.current.y
        const distance = Math.sqrt(
          Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2)
        )

        const duration = Math.min(2000, Math.max(800, distance * 1000))

        setTargetRotation({
          x: targetX,
          y: targetY,
          startX: currentX,
          startY: currentY,
          distance,
          startTime: performance.now(),
          duration,
        })
        return
      }
    }

    setIsDragging(true)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const scaleX = CANVAS_SIZE / rect.width
    const scaleY = CANVAS_SIZE / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    setMousePos({ x, y })

    // Hit-test for hover
    let found = -1
    for (let i = iconPositions.length - 1; i >= 0; i--) {
      const icon = iconPositions[i]
      const { screenX, screenY, scale } = getScreenPos(icon)
      const radius = (ICON_SIZE / 2) * scale
      const dx = x - screenX
      const dy = y - screenY
      if (dx * dx + dy * dy < radius * radius) {
        found = i
        break
      }
    }
    setHoveredIndex(found >= 0 ? found : null)

    if (isDragging) {
      const deltaX = e.clientX - lastMousePos.x
      const deltaY = e.clientY - lastMousePos.y

      rotationRef.current = {
        x: rotationRef.current.x + deltaY * 0.002,
        y: rotationRef.current.y + deltaX * 0.002,
      }

      setLastMousePos({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setHoveredIndex(null)
  }

  // Animation and rendering
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (canvas && ctx) {
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY)
        const dx = mousePos.x - centerX
        const dy = mousePos.y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const speed = 0.003 + (distance / maxDistance) * 0.01

        if (targetRotation) {
          const elapsed = performance.now() - targetRotation.startTime
          const progress = Math.min(1, elapsed / targetRotation.duration)
          const easedProgress = easeOutCubic(progress)

          rotationRef.current = {
            x:
              targetRotation.startX +
              (targetRotation.x - targetRotation.startX) * easedProgress,
            y:
              targetRotation.startY +
              (targetRotation.y - targetRotation.startY) * easedProgress,
          }

          if (progress >= 1) {
            setTargetRotation(null)
          }
        } else if (!isDragging) {
          rotationRef.current = {
            x: rotationRef.current.x + (dy / canvas.height) * speed,
            y: rotationRef.current.y + (dx / canvas.width) * speed,
          }
        }

        // Sort icons by z-depth so front icons render on top
        const sorted = iconPositions
          .map((icon, index) => {
            const cosX = Math.cos(rotationRef.current.x)
            const sinX = Math.sin(rotationRef.current.x)
            const cosY = Math.cos(rotationRef.current.y)
            const sinY = Math.sin(rotationRef.current.y)

            const rotatedX = icon.x * cosY - icon.z * sinY
            const rotatedZ = icon.x * sinY + icon.z * cosY
            const rotatedY = icon.y * cosX + rotatedZ * sinX

            return { icon, index, rotatedX, rotatedY, rotatedZ }
          })
          .sort((a, b) => a.rotatedZ - b.rotatedZ)

        sorted.forEach(({ index, rotatedX, rotatedY, rotatedZ }) => {
          const scale = (rotatedZ + 250) / 350
          const opacity = Math.max(0.15, Math.min(1, (rotatedZ + 180) / 250))
          const isHovered = hoveredIndex === index

          const hoverScale = isHovered ? 3.5 : 1
          const finalScale = scale * hoverScale
          const half = ICON_SIZE / 2

          ctx.save()
          ctx.translate(centerX + rotatedX, centerY + rotatedY)
          ctx.scale(finalScale, finalScale)
          ctx.globalAlpha = isHovered ? 1 : opacity

          if (icons || images) {
            if (
              iconCanvasesRef.current[index] &&
              imagesLoadedRef.current[index]
            ) {
              ctx.drawImage(
                iconCanvasesRef.current[index],
                -half,
                -half,
                ICON_SIZE,
                ICON_SIZE
              )
            }
          } else {
            ctx.beginPath()
            ctx.arc(0, 0, half, 0, Math.PI * 2)
            ctx.fillStyle = "#4444ff"
            ctx.fill()
            ctx.fillStyle = "white"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.font = `${half}px Arial`
            ctx.fillText(`${index + 1}`, 0, 0)
          }

          ctx.restore()

          // Draw tooltip label on hover
          if (isHovered && labels?.[index]) {
            const label = labels[index]
            ctx.save()
            ctx.font = "bold 28px 'Source Sans 3', sans-serif"
            const textWidth = ctx.measureText(label).width
            const px = 10
            const py = 6
            const tooltipW = textWidth + px * 2
            const tooltipH = 44
            const tooltipX = centerX + rotatedX - tooltipW / 2
            const tooltipY =
              centerY + rotatedY + half * finalScale + 8

            // Background pill
            ctx.globalAlpha = 0.92
            ctx.fillStyle = "#0f172a"
            ctx.beginPath()
            ctx.roundRect(tooltipX, tooltipY, tooltipW, tooltipH, 6)
            ctx.fill()
            ctx.strokeStyle = "rgba(148,163,184,0.3)"
            ctx.lineWidth = 1
            ctx.stroke()

            // Text
            ctx.globalAlpha = 1
            ctx.fillStyle = "#e2e8f0"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(label, centerX + rotatedX, tooltipY + tooltipH / 2)

            ctx.restore()
          }
        })

        animationFrameRef.current = requestAnimationFrame(animate)
      }

      animate()
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [
    icons,
    images,
    labels,
    iconPositions,
    isDragging,
    mousePos,
    hoveredIndex,
    targetRotation,
  ])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className="rounded-lg w-full max-w-[600px]"
      style={{ cursor: hoveredIndex !== null ? "pointer" : "grab" }}
      aria-label="Interactive 3D Icon Cloud"
      role="img"
    />
  )
}
