import { useEffect, useRef, useState } from 'react'
import Vara from 'vara'
import sharpiePng from './assets/sharpie.png'

let varaIdCounter = 0

const positions = [
  { top: '25%', left: '28%', rotate: -4 },
  { top: '35%', left: '42%', rotate: 5 },
  { top: '47%', left: '30%', rotate: -7 },
  { top: '57%', left: '38%', rotate: 3 },
  { top: '66%', left: '32%', rotate: -5 },
]

export default function HandwrittenMenu({ trigger, items }) {
  const [ids] = useState(() =>
    items.map(() => `vara-item-${++varaIdCounter}`)
  )
  const containerRef = useRef(null)
  const sharpieRef = useRef(null)
  const rafRef = useRef(null)
  const activeRef = useRef(false)

  // Track the drawing tip and move the sharpie
  const trackSharpie = () => {
    if (!activeRef.current || !containerRef.current || !sharpieRef.current) return

    const container = containerRef.current
    const sharpie = sharpieRef.current
    const containerRect = container.getBoundingClientRect()

    let tipFound = false

    for (const id of ids) {
      const el = document.getElementById(id)
      if (!el) continue

      const paths = el.querySelectorAll('path')
      for (const path of paths) {
        const dashOffset = parseFloat(path.style.strokeDashoffset)
        const totalLength = path.getTotalLength()

        if (dashOffset > 0.5 && dashOffset < totalLength - 1) {
          const visibleLength = totalLength - dashOffset
          const point = path.getPointAtLength(visibleLength)

          // Use DOMPoint + SVG's CTM to get screen coordinates
          const svg = path.closest('svg')
          if (!svg) continue

          const svgPoint = svg.createSVGPoint()
          svgPoint.x = point.x
          svgPoint.y = point.y
          const ctm = path.getScreenCTM()
          if (!ctm) continue
          const screenPoint = svgPoint.matrixTransform(ctm)

          const tipX = screenPoint.x - containerRect.left
          const tipY = screenPoint.y - containerRect.top

          sharpie.style.left = `${tipX}px`
          sharpie.style.top = `${tipY}px`
          sharpie.style.opacity = '1'
          tipFound = true
          break
        }
      }
      if (tipFound) break
    }

    if (!tipFound) {
      sharpie.style.opacity = '0'
    }

    rafRef.current = requestAnimationFrame(trackSharpie)
  }

  useEffect(() => {
    if (!trigger) return

    activeRef.current = true

    // Start tracking the sharpie position
    rafRef.current = requestAnimationFrame(trackSharpie)

    const isMobile = window.innerWidth <= 600
    const fontSize = isMobile ? 14 : 20
    const strokeWidth = isMobile ? 1.2 : 1.8

    // Stagger each item's Vara animation
    const timeouts = items.map((item, i) => {
      return setTimeout(() => {
        const el = document.getElementById(ids[i])
        if (!el) return
        el.innerHTML = ''

        new Vara(
          `#${ids[i]}`,
          '/shadows-into-light.json',
          [
            {
              text: item,
              fontSize,
              strokeWidth,
              color: '#1a1a1a',
              duration: 2000,
              letterSpacing: 1,
            },
          ],
          {
            fontSize,
            strokeWidth,
            color: '#1a1a1a',
          }
        )
      }, i * 2500)
    })

    // Hide sharpie after all items are done
    const hideTimeout = setTimeout(() => {
      activeRef.current = false
      if (sharpieRef.current) sharpieRef.current.style.opacity = '0'
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }, items.length * 2500 + 2500)

    return () => {
      activeRef.current = false
      timeouts.forEach(clearTimeout)
      clearTimeout(hideTimeout)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [trigger, items, ids])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 3,
      }}
    >
      {items.map((_, i) => {
        const pos = positions[i % positions.length]
        return (
          <div
            key={ids[i]}
            id={ids[i]}
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              transform: `rotate(${pos.rotate}deg)`,
              whiteSpace: 'nowrap',
            }}
          />
        )
      })}

      {/* Sharpie that follows the drawing tip */}
      <img
        ref={sharpieRef}
        src={sharpiePng}
        alt=""
        style={{
          position: 'absolute',
          width: '200px',
          height: 'auto',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 10,
          transformOrigin: 'bottom left',
          transform: 'translate(-2px, -100%)',
          transition: 'opacity 0.2s ease',
        }}
      />
    </div>
  )
}
