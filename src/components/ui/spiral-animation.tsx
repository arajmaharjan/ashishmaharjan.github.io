'use client'
import { useEffect, useRef, useState } from 'react'

class Vector2D {
    constructor(public x: number, public y: number) {}
    static random(min: number, max: number): number {
        return min + Math.random() * (max - min)
    }
}

class Vector3D {
    constructor(public x: number, public y: number, public z: number) {}
}

class AnimationController {
    private time = 0
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private size: number
    private stars: Star[] = []
    private disposed = false
    private animId = 0
    private lastFrameTime = 0
    private phase: 'spiral' | 'transition' | 'drift' = 'spiral'
    private driftTime = 0
    private transitionTime = 0
    private readonly transitionDuration = 2 // seconds to ease from spiral into drift

    readonly changeEventTime = 0.32
    readonly cameraZ = -400
    readonly cameraTravelDistance = 3400
    readonly startDotYOffset = 28
    readonly viewZoom = 100
    private readonly numberOfStars = 2000
    private readonly trailLength = 50
    private readonly spiralDuration = 12 // seconds for the spiral phase
    // Switch to drift at this fraction — stars are fully dispersed
    // but camera hasn't flown past them yet
    private readonly driftSwitchTime = 0.72

    public onSpiralComplete?: () => void

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, size: number) {
        this.canvas = canvas
        this.ctx = ctx
        this.size = size

        const origRandom = Math.random
        let seed = 1234
        Math.random = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
        for (let i = 0; i < this.numberOfStars; i++) {
            this.stars.push(new Star(this.cameraZ, this.cameraTravelDistance))
        }
        Math.random = origRandom

        this.lastFrameTime = performance.now() / 1000
        this.animate()
    }

    private animate() {
        if (this.disposed) return
        this.animId = requestAnimationFrame(() => this.animate())

        const now = performance.now() / 1000
        const delta = Math.min(now - this.lastFrameTime, 0.05)
        this.lastFrameTime = now

        if (this.phase === 'spiral') {
            this.time += delta / this.spiralDuration
            if (this.time >= this.driftSwitchTime) {
                this.time = this.driftSwitchTime
                this.phase = 'transition'
                this.transitionTime = 0
                this.driftTime = 0
                this.onSpiralComplete?.()
            }
        } else if (this.phase === 'transition') {
            this.transitionTime += delta
            this.driftTime += delta
            if (this.transitionTime >= this.transitionDuration) {
                this.phase = 'drift'
            }
        } else {
            this.driftTime += delta
        }

        this.render()
    }

    public ease(p: number, g: number): number {
        if (p < 0.5) return 0.5 * Math.pow(2 * p, g)
        else return 1 - 0.5 * Math.pow(2 * (1 - p), g)
    }

    public easeOutElastic(x: number): number {
        const c4 = (2 * Math.PI) / 4.5
        if (x <= 0) return 0
        if (x >= 1) return 1
        return Math.pow(2, -8 * x) * Math.sin((x * 8 - 0.75) * c4) + 1
    }

    public map(value: number, start1: number, stop1: number, start2: number, stop2: number): number {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
    }

    public constrain(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max)
    }

    public lerp(start: number, end: number, t: number): number {
        return start * (1 - t) + end * t
    }

    public spiralPath(p: number): Vector2D {
        p = this.constrain(1.2 * p, 0, 1)
        p = this.ease(p, 1.8)
        const numberOfSpiralTurns = 6
        const theta = 2 * Math.PI * numberOfSpiralTurns * Math.sqrt(p)
        const r = 170 * Math.sqrt(p)
        return new Vector2D(r * Math.cos(theta), r * Math.sin(theta) + this.startDotYOffset)
    }

    public showProjectedDot(position: Vector3D, sizeFactor: number, cycleTime: number, alpha: number = 1) {
        const t2 = this.constrain(this.map(cycleTime, this.changeEventTime, 1, 0, 1), 0, 1)
        const newCameraZ = this.cameraZ + this.ease(Math.pow(t2, 1.2), 1.8) * this.cameraTravelDistance

        if (position.z > newCameraZ) {
            const dotDepthFromCamera = position.z - newCameraZ
            const x = this.viewZoom * position.x / dotDepthFromCamera
            const y = this.viewZoom * position.y / dotDepthFromCamera
            const sw = 400 * sizeFactor / dotDepthFromCamera

            this.ctx.globalAlpha = alpha
            this.ctx.lineWidth = sw
            this.ctx.beginPath()
            this.ctx.arc(x, y, 0.5, 0, Math.PI * 2)
            this.ctx.fill()
            this.ctx.globalAlpha = 1
        }
    }

    public render() {
        const ctx = this.ctx
        if (!ctx) return

        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, this.size, this.size)

        if (this.phase === 'spiral') {
            this.renderSpiralFrame(ctx, 1)
        } else if (this.phase === 'transition') {
            // Smooth crossfade: spiral fades out, drift fades in
            const progress = this.transitionTime / this.transitionDuration
            // Ease the transition for smoothness
            const eased = progress * progress * (3 - 2 * progress) // smoothstep

            // Draw spiral fading out
            this.renderSpiralFrame(ctx, 1 - eased)
            // Draw drift fading in
            this.renderDriftFrame(ctx, eased)
        } else {
            this.renderDriftFrame(ctx, 1)
        }
    }

    private renderSpiralFrame(ctx: CanvasRenderingContext2D, alpha: number) {
        const t1 = this.constrain(this.map(this.time, 0, this.changeEventTime + 0.25, 0, 1), 0, 1)
        const t2 = this.constrain(this.map(this.time, this.changeEventTime, 1, 0, 1), 0, 1)

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.translate(this.size / 2, this.size / 2)
        ctx.rotate(-Math.PI * this.ease(t2, 2.7))

        for (let i = 0; i < this.trailLength; i++) {
            const f = this.map(i, 0, this.trailLength, 1.1, 0.1)
            const sw = (1.3 * (1 - t1) + 3.0 * Math.sin(Math.PI * t1)) * f
            ctx.fillStyle = 'white'
            ctx.lineWidth = sw
            const pathTime = t1 - 0.00015 * i
            const position = this.spiralPath(pathTime)
            ctx.beginPath()
            ctx.arc(position.x, position.y, sw / 2, 0, Math.PI * 2)
            ctx.fill()
        }

        ctx.fillStyle = 'white'
        for (const star of this.stars) {
            star.render(t1, this, this.time)
        }

        if (this.time > this.changeEventTime) {
            const dy = this.cameraZ * this.startDotYOffset / this.viewZoom
            const position = new Vector3D(0, dy, this.cameraTravelDistance)
            this.showProjectedDot(position, 2.5, this.time, alpha)
        }

        ctx.globalAlpha = 1
        ctx.restore()
    }

    private renderDriftFrame(ctx: CanvasRenderingContext2D, alpha: number) {
        const t2Frozen = this.constrain(this.map(this.driftSwitchTime, this.changeEventTime, 1, 0, 1), 0, 1)

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.translate(this.size / 2, this.size / 2)
        ctx.rotate(-Math.PI * this.ease(t2Frozen, 2.7))

        ctx.fillStyle = 'white'
        for (const star of this.stars) {
            star.renderDrift(this, this.driftTime, this.driftSwitchTime)
        }

        ctx.globalAlpha = 1
        ctx.restore()
    }

    public destroy() {
        this.disposed = true
        cancelAnimationFrame(this.animId)
    }
}

class Star {
    private dx: number
    private dy: number
    private spiralLocation: number
    private strokeWeightFactor: number
    private z: number
    private angle: number
    private distance: number
    private rotationDirection: number
    private expansionRate: number
    private finalScale: number
    // Drift velocities (set when spiral ends)
    private driftVx = 0
    private driftVy = 0
    private finalX = 0
    private finalY = 0
    private driftInitialized = false

    constructor(cameraZ: number, cameraTravelDistance: number) {
        this.angle = Math.random() * Math.PI * 2
        this.distance = 30 * Math.random() + 15
        this.rotationDirection = Math.random() > 0.5 ? 1 : -1
        this.expansionRate = 1.2 + Math.random() * 0.8
        this.finalScale = 0.7 + Math.random() * 0.6
        this.dx = this.distance * Math.cos(this.angle)
        this.dy = this.distance * Math.sin(this.angle)
        this.spiralLocation = (1 - Math.pow(1 - Math.random(), 3.0)) / 1.3
        this.z = Vector2D.random(0.5 * cameraZ, cameraTravelDistance + cameraZ)
        this.z = this.z * 0.7 + (cameraTravelDistance / 2) * 0.3 * this.spiralLocation
        this.strokeWeightFactor = Math.pow(Math.random(), 2.0)
    }

    private computeScreenPos(p: number, controller: AnimationController): { x: number, y: number } | null {
        const spiralPos = controller.spiralPath(this.spiralLocation)
        const q = p - this.spiralLocation
        if (q <= 0) return null

        const displacementProgress = controller.constrain(4 * q, 0, 1)
        const elasticEasing = controller.easeOutElastic(displacementProgress)
        const powerEasing = Math.pow(displacementProgress, 2)

        let easing: number
        if (displacementProgress < 0.3) {
            easing = controller.lerp(displacementProgress, powerEasing, displacementProgress / 0.3)
        } else if (displacementProgress < 0.7) {
            const t = (displacementProgress - 0.3) / 0.4
            easing = controller.lerp(powerEasing, elasticEasing, t)
        } else {
            easing = elasticEasing
        }

        let screenX: number, screenY: number

        if (displacementProgress < 0.3) {
            screenX = controller.lerp(spiralPos.x, spiralPos.x + this.dx * 0.3, easing / 0.3)
            screenY = controller.lerp(spiralPos.y, spiralPos.y + this.dy * 0.3, easing / 0.3)
        } else if (displacementProgress < 0.7) {
            const midProgress = (displacementProgress - 0.3) / 0.4
            const curveStrength = Math.sin(midProgress * Math.PI) * this.rotationDirection * 1.5
            const baseX = spiralPos.x + this.dx * 0.3
            const baseY = spiralPos.y + this.dy * 0.3
            const targetX = spiralPos.x + this.dx * 0.7
            const targetY = spiralPos.y + this.dy * 0.7
            const perpX = -this.dy * 0.4 * curveStrength
            const perpY = this.dx * 0.4 * curveStrength
            screenX = controller.lerp(baseX, targetX, midProgress) + perpX * midProgress
            screenY = controller.lerp(baseY, targetY, midProgress) + perpY * midProgress
        } else {
            const finalProgress = (displacementProgress - 0.7) / 0.3
            const baseX = spiralPos.x + this.dx * 0.7
            const baseY = spiralPos.y + this.dy * 0.7
            const targetDistance = this.distance * this.expansionRate * 1.5
            const spiralTurns = 1.2 * this.rotationDirection
            const spiralAngle = this.angle + spiralTurns * finalProgress * Math.PI
            const targetX = spiralPos.x + targetDistance * Math.cos(spiralAngle)
            const targetY = spiralPos.y + targetDistance * Math.sin(spiralAngle)
            screenX = controller.lerp(baseX, targetX, finalProgress)
            screenY = controller.lerp(baseY, targetY, finalProgress)
        }

        return { x: screenX, y: screenY }
    }

    render(p: number, controller: AnimationController, cycleTime: number) {
        const pos = this.computeScreenPos(p, controller)
        if (!pos) return

        const vx = (this.z - controller.cameraZ) * pos.x / controller.viewZoom
        const vy = (this.z - controller.cameraZ) * pos.y / controller.viewZoom
        const position = new Vector3D(vx, vy, this.z)

        const q = p - this.spiralLocation
        const displacementProgress = controller.constrain(4 * q, 0, 1)
        let sizeMultiplier = 1.0
        if (displacementProgress < 0.6) {
            sizeMultiplier = 1.0 + displacementProgress * 0.2
        } else {
            const t = (displacementProgress - 0.6) / 0.4
            sizeMultiplier = 1.2 * (1.0 - t) + this.finalScale * t
        }

        const dotSize = 8.5 * this.strokeWeightFactor * sizeMultiplier
        controller.showProjectedDot(position, dotSize, cycleTime)
    }

    renderDrift(controller: AnimationController, driftTime: number, frozenTime: number) {
        // On first drift frame, compute final position and a slow drift velocity
        if (!this.driftInitialized) {
            this.driftInitialized = true
            // Use the frozen spiral time to get star positions at the moment we switched
            const t1Frozen = controller.constrain(
                controller.map(frozenTime, 0, controller.changeEventTime + 0.25, 0, 1), 0, 1
            )
            const pos = this.computeScreenPos(t1Frozen, controller)
            if (pos) {
                this.finalX = pos.x
                this.finalY = pos.y
            } else {
                const sp = controller.spiralPath(this.spiralLocation)
                this.finalX = sp.x
                this.finalY = sp.y
            }
            // Gentle outward drift
            const driftAngle = this.angle + (Math.random() - 0.5) * 0.5
            const driftSpeed = 1 + Math.random() * 3
            this.driftVx = Math.cos(driftAngle) * driftSpeed
            this.driftVy = Math.sin(driftAngle) * driftSpeed
        }

        const x = this.finalX + this.driftVx * driftTime
        const y = this.finalY + this.driftVy * driftTime

        const vx = (this.z - controller.cameraZ) * x / controller.viewZoom
        const vy = (this.z - controller.cameraZ) * y / controller.viewZoom

        // Project using the frozen camera position (not t2=1 which flies past everything)
        const t2Frozen = controller.constrain(
            controller.map(frozenTime, controller.changeEventTime, 1, 0, 1), 0, 1
        )
        const newCameraZ = controller.cameraZ + controller.ease(Math.pow(t2Frozen, 1.2), 1.8) * controller.cameraTravelDistance
        if (this.z > newCameraZ) {
            const depth = this.z - newCameraZ
            const sx = controller.viewZoom * vx / depth
            const sy = controller.viewZoom * vy / depth
            const sw = 400 * (8.5 * this.strokeWeightFactor * this.finalScale) / depth

            controller['ctx'].beginPath()
            controller['ctx'].arc(sx, sy, Math.max(sw * 0.5, 0.3), 0, Math.PI * 2)
            controller['ctx'].fill()
        }
    }
}

export function SpiralAnimation({ onComplete }: { onComplete?: () => void } = {}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<AnimationController | null>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight })
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || dimensions.width === 0) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const size = Math.max(dimensions.width, dimensions.height)

        canvas.width = size * dpr
        canvas.height = size * dpr
        canvas.style.width = `${dimensions.width}px`
        canvas.style.height = `${dimensions.height}px`
        ctx.scale(dpr, dpr)

        const anim = new AnimationController(canvas, ctx, size)
        anim.onSpiralComplete = onComplete
        animationRef.current = anim

        return () => {
            if (animationRef.current) {
                animationRef.current.destroy()
                animationRef.current = null
            }
        }
    }, [dimensions, onComplete])

    return (
        <div className="relative w-full h-full">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    )
}
