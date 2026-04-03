import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

export default function EraserReveal({ topSrc, bottomSrc, trigger }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const imageRef = useRef(null)
  const readyRef = useRef(false)

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || !imageRef.current) return

    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const w = rect.width
    const h = rect.height

    canvas.width = w * dpr
    canvas.height = h * dpr

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, w, h)

    // Mimic object-fit: contain — match the clean plate img positioning
    const img = imageRef.current
    const imgRatio = img.naturalWidth / img.naturalHeight
    const boxRatio = w / h
    let drawW, drawH, drawX, drawY
    if (imgRatio > boxRatio) {
      drawW = w
      drawH = w / imgRatio
      drawX = 0
      drawY = (h - drawH) / 2
    } else {
      drawH = h
      drawW = h * imgRatio
      drawX = (w - drawW) / 2
      drawY = 0
    }
    ctx.drawImage(img, drawX, drawY, drawW, drawH)

    readyRef.current = true
  }, [])

  // Load the top image and draw it onto canvas
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      imageRef.current = img
      setupCanvas()
    }
    img.src = topSrc
  }, [topSrc, setupCanvas])

  // Re-setup on resize
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) setupCanvas()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setupCanvas])

  // Run eraser animation when triggered
  useEffect(() => {
    if (!trigger || !readyRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const w = canvas.width / dpr
    const h = canvas.height / dpr

    // We already have dpr scaling applied via ctx.scale
    ctx.globalCompositeOperation = 'destination-out'

    const strokeCount = 12
    const strokeH = h / strokeCount
    const brushR = strokeH * 0.7

    const tl = gsap.timeline()

    for (let i = 0; i < strokeCount; i++) {
      const y = strokeH * i + strokeH / 2
      const leftToRight = i % 2 === 0
      const progress = { val: 0 }
      let lastVal = 0

      tl.to(progress, {
        val: 1,
        duration: 0.12,
        ease: 'power2.inOut',
        onUpdate: () => {
          // Draw eraser dots from lastVal to current val
          const steps = 12
          for (let s = 0; s <= steps; s++) {
            const t = lastVal + (progress.val - lastVal) * (s / steps)
            const x = leftToRight ? t * w : w - t * w
            const wobble = Math.sin(x * 0.04 + i * 2) * 2
            ctx.beginPath()
            ctx.arc(x, y + wobble, brushR, 0, Math.PI * 2)
            ctx.fill()
          }
          lastVal = progress.val
        },
      }, i === 0 ? 0 : '>-0.03')
    }
  }, [trigger])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Clean plate underneath */}
      <img
        src={bottomSrc}
        alt=""
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
      {/* Canvas with dirty plate drawn on it — gets erased */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  )
}
