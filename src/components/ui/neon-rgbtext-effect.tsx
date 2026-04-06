'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface NeonRGBTextEffectProps {
  text?: string
  font?: string
  fontSizePx?: number
  offsetAmount?: number
  className?: string
}

export function NeonRGBTextEffect({
  text = 'ASHISH MAHARJAN',
  font = '700 140px sans-serif',
  fontSizePx = 140,
  offsetAmount = 0.005,
  className,
}: NeonRGBTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl')
    if (!gl) return

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vertexShader, `
      attribute vec2 position;
      uniform float uAspect;
      varying vec2 vUv;
      void main() {
        vUv = vec2(position.x * 0.5 + 0.5, 1.0 - (position.y * 0.5 + 0.5));
        vec2 pos = position;
        pos.y *= 0.25;
        pos.x *= min(1.0, 1.0/uAspect);
        gl_Position = vec4(pos, 0.0, 1.0);
      }
    `)
    gl.compileShader(vertexShader)

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fragmentShader, `
      precision mediump float;
      uniform sampler2D uTexture;
      uniform vec2 uOffset;
      uniform vec3 uColor;
      varying vec2 vUv;

      void main() {
        vec2 distortedUv = vUv + vec2(uOffset.x, -uOffset.y);
        vec4 texel = texture2D(uTexture, distortedUv);
        gl_FragColor = vec4(uColor * texel.a * 1.5, texel.a);
      }
    `)
    gl.compileShader(fragmentShader)

    const program = gl.createProgram()!
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.useProgram(program)

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // Create text texture
    const textCanvas = document.createElement('canvas')
    const textCtx = textCanvas.getContext('2d')!
    textCanvas.width = 1024
    textCanvas.height = 256

    textCtx.fillStyle = 'rgba(0, 0, 0, 0)'
    textCtx.fillRect(0, 0, textCanvas.width, textCanvas.height)

    textCtx.fillStyle = '#ffffff'
    textCtx.font = font
    textCtx.textAlign = 'center'
    textCtx.textBaseline = 'middle'
    textCtx.fillText(text, textCanvas.width / 2, textCanvas.height / 2)

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    const textureLocation = gl.getUniformLocation(program, 'uTexture')
    const offsetLocation = gl.getUniformLocation(program, 'uOffset')
    const colorLocation = gl.getUniformLocation(program, 'uColor')
    const aspectLocation = gl.getUniformLocation(program, 'uAspect')

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)

    const setCanvasSize = () => {
      canvas.width = canvas.clientWidth * Math.min(window.devicePixelRatio, 2)
      canvas.height = canvas.clientHeight * Math.min(window.devicePixelRatio, 2)
      gl.viewport(0, 0, canvas.width, canvas.height)

      const aspect = canvas.width / canvas.height
      gl.uniform1f(aspectLocation, aspect)

      render()
    }

    const render = () => {
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      const channels = [
        { color: [1, 0, 0], offset: [offsetAmount, 0] },
        { color: [0, 1, 0], offset: [0, 0] },
        { color: [0, 0, 1], offset: [-offsetAmount, 0] },
      ]

      channels.forEach(({ color, offset }) => {
        gl.uniform2fv(offsetLocation, offset)
        gl.uniform3fv(colorLocation, color)
        gl.uniform1i(textureLocation, 0)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      })
    }

    setCanvasSize()

    window.addEventListener('resize', setCanvasSize)

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      gl.deleteBuffer(buffer)
      gl.deleteTexture(texture)
    }
  }, [text, font, offsetAmount])

  return (
    <canvas
      ref={canvasRef}
      className={cn('w-full h-full', className)}
    />
  )
}
