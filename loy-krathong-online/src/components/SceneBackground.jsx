import React, { useEffect, useRef } from 'react'

/**
 * SceneBackground: ฉากหลัง Canvas 60fps เต็มจอ
 * - ท้องฟ้าไล่เฉดสีค่ำคืนโรแมนติก
 * - ดวงดาวกะพริบด้วย sin wave
 * - พระจันทร์เต็มดวงพร้อมรัศมีแสงนวลและรอยพื้นผิว
 * - โคมลอยลอยขึ้นช้าๆ แกว่งไกวเป็นธรรมชาติ
 * - ผิวน้ำแม่น้ำพร้อมระลอกคลื่นและแสงสะท้อนดวงจันทร์/โคม
 * - รองรับ devicePixelRatio, visibilitychange และ prefers-reduced-motion
 */
export default function SceneBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let animationFrameId
    let isTabVisible = true
    let width = 0
    let height = 0
    let dpr = 1

    // ตรวจสอบ prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const speedMultiplier = prefersReducedMotion ? 0.25 : 1

    // รายการดาว
    let stars = []
    // รายการโคมลอย
    let lanterns = []

    const initElements = () => {
      // ปรับจำนวนดวงดาวตามความกว้างจอ
      const starCount = width < 500 ? 55 : 100
      stars = []
      const skyLimit = height * 0.62

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * skyLimit,
          radius: 0.5 + Math.random() * 1.3,
          baseAlpha: 0.25 + Math.random() * 0.5,
          twinkleSpeed: (0.0015 + Math.random() * 0.003) * speedMultiplier,
          phase: Math.random() * Math.PI * 2,
          color: Math.random() > 0.8 ? '#ffeef7' : '#fff9e8',
        })
      }

      // โคมลอย 9 - 13 ดวง
      const lanternCount = width < 500 ? 9 : 13
      lanterns = []
      for (let i = 0; i < lanternCount; i++) {
        lanterns.push({
          x: Math.random() * width,
          y: (skyLimit * 0.1) + Math.random() * (skyLimit * 0.85),
          scale: 0.45 + Math.random() * 0.65,
          speedY: (0.18 + Math.random() * 0.38) * speedMultiplier,
          swaySpeed: (0.001 + Math.random() * 0.002) * speedMultiplier,
          swayAmp: 10 + Math.random() * 18,
          phase: Math.random() * Math.PI * 2,
          flickerPhase: Math.random() * 10,
        })
      }
    }

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      initElements()
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    // วาดพระจันทร์เต็มดวง
    const drawMoon = (time) => {
      const moonX = width * 0.78
      const moonY = Math.max(55, height * 0.14)
      const moonRadius = Math.max(26, Math.min(width, height) * 0.075)

      // 1. ชั้นรัศมีแสงภายนอก (Multi-layer Radial Glow)
      // Glow ชั้นนอกสุด
      const glowGrad3 = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.8, moonX, moonY, moonRadius * 3.8)
      glowGrad3.addColorStop(0, 'rgba(255, 238, 175, 0.14)')
      glowGrad3.addColorStop(0.5, 'rgba(255, 215, 120, 0.06)')
      glowGrad3.addColorStop(1, 'rgba(255, 200, 100, 0)')
      ctx.fillStyle = glowGrad3
      ctx.beginPath()
      ctx.arc(moonX, moonY, moonRadius * 3.8, 0, Math.PI * 2)
      ctx.fill()

      // Glow ชั้นกลาง
      const glowGrad2 = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.9, moonX, moonY, moonRadius * 1.8)
      glowGrad2.addColorStop(0, 'rgba(255, 245, 210, 0.28)')
      glowGrad2.addColorStop(1, 'rgba(255, 220, 130, 0)')
      ctx.fillStyle = glowGrad2
      ctx.beginPath()
      ctx.arc(moonX, moonY, moonRadius * 1.8, 0, Math.PI * 2)
      ctx.fill()

      // 2. ตัวดวงจันทร์ (Moon Body)
      ctx.save()
      ctx.beginPath()
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2)
      ctx.clip()

      const moonGrad = ctx.createLinearGradient(moonX - moonRadius, moonY - moonRadius, moonX + moonRadius, moonY + moonRadius)
      moonGrad.addColorStop(0, '#fffdf2')
      moonGrad.addColorStop(0.7, '#fef0cb')
      moonGrad.addColorStop(1, '#fad794')
      ctx.fillStyle = moonGrad
      ctx.fillRect(moonX - moonRadius, moonY - moonRadius, moonRadius * 2, moonRadius * 2)

      // รอยผิวพระจันทร์จางๆ (Lunar Maria / Craters)
      ctx.fillStyle = 'rgba(210, 175, 115, 0.22)'
      const craters = [
        { dx: -0.3, dy: -0.25, r: 0.22 },
        { dx: 0.2, dy: -0.35, r: 0.18 },
        { dx: 0.35, dy: 0.1, r: 0.28 },
        { dx: -0.1, dy: 0.3, r: 0.2 },
        { dx: -0.4, dy: 0.15, r: 0.15 },
        { dx: 0.1, dy: 0.25, r: 0.16 },
      ]
      craters.forEach(c => {
        ctx.beginPath()
        ctx.arc(moonX + c.dx * moonRadius, moonY + c.dy * moonRadius, c.r * moonRadius, 0, Math.PI * 2)
        ctx.fill()
      })

      // ขอบเงาบางๆ ด้านล่าง
      const rimGrad = ctx.createRadialGradient(moonX - moonRadius * 0.3, moonY - moonRadius * 0.3, moonRadius * 0.5, moonX, moonY, moonRadius)
      rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0)')
      rimGrad.addColorStop(0.85, 'rgba(255, 240, 190, 0)')
      rimGrad.addColorStop(1, 'rgba(220, 160, 70, 0.25)')
      ctx.fillStyle = rimGrad
      ctx.fillRect(moonX - moonRadius, moonY - moonRadius, moonRadius * 2, moonRadius * 2)

      ctx.restore()
    }

    // วาดโคมลอยเดี่ยว
    const drawLantern = (lantern, time) => {
      const { x, y, scale, swayAmp, swaySpeed, phase, flickerPhase } = lantern
      const currentX = x + Math.sin(time * swaySpeed + phase) * swayAmp
      const w = 18 * scale
      const h = 24 * scale

      // คำนวณความโปร่งใสตามความสูง (เริ่มจางเมื่อใกล้ขอบบน)
      let alpha = 1
      if (y < height * 0.12) {
        alpha = Math.max(0, y / (height * 0.12))
      }

      ctx.save()
      ctx.globalAlpha = alpha

      // แสงเรืองรอบโคม
      const flicker = 1 + Math.sin(time * 0.006 + flickerPhase) * 0.12
      const glowGrad = ctx.createRadialGradient(currentX, y + h * 0.4, 2 * scale, currentX, y + h * 0.4, 30 * scale * flicker)
      glowGrad.addColorStop(0, 'rgba(255, 207, 107, 0.45)')
      glowGrad.addColorStop(0.4, 'rgba(255, 140, 30, 0.18)')
      glowGrad.addColorStop(1, 'rgba(255, 120, 0, 0)')
      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(currentX, y + h * 0.4, 30 * scale * flicker, 0, Math.PI * 2)
      ctx.fill()

      // โครงตัวโคมทรงกระบอกมน
      ctx.beginPath()
      const radius = 4 * scale
      const left = currentX - w / 2
      const right = currentX + w / 2
      const top = y - h / 2
      const bottom = y + h / 2

      ctx.moveTo(left + radius, top)
      ctx.lineTo(right - radius, top)
      ctx.quadraticCurveTo(right + 2 * scale, y, right - radius, bottom)
      ctx.lineTo(left + radius, bottom)
      ctx.quadraticCurveTo(left - 2 * scale, y, left + radius, top)
      ctx.closePath()

      // สีโคมลอยโทนส้มทองมีแสงสว่างตรงกลางล่าง
      const bodyGrad = ctx.createLinearGradient(currentX, top, currentX, bottom)
      bodyGrad.addColorStop(0, '#e5802b')
      bodyGrad.addColorStop(0.5, '#fba43a')
      bodyGrad.addColorStop(0.85, '#ffdc78')
      bodyGrad.addColorStop(1, '#ffc04d')
      ctx.fillStyle = bodyGrad
      ctx.fill()

      // แสงเทียนสว่างจ้าตรงฐานล่าง
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(currentX, bottom - 3 * scale, 2.5 * scale * flicker, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    // วาดผิวน้ำ คลื่น และเงาสะท้อน
    const drawWater = (time) => {
      const waterTop = height * 0.58

      // แม่น้ำไล่เฉดสีลึก
      const waterGrad = ctx.createLinearGradient(0, waterTop, 0, height)
      waterGrad.addColorStop(0, '#0f1738')
      waterGrad.addColorStop(0.35, '#0b112c')
      waterGrad.addColorStop(1, '#050817')
      ctx.fillStyle = waterGrad
      ctx.fillRect(0, waterTop, width, height - waterTop)

      // เส้นผิวน้ำที่ขอบตลิ่ง/ขอบฟ้า
      ctx.strokeStyle = 'rgba(80, 110, 180, 0.25)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, waterTop)
      ctx.lineTo(width, waterTop)
      ctx.stroke()

      // 1. เงาสะท้อนพระจันทร์บนผิวน้ำ (Moon Reflection Shimmer)
      const moonX = width * 0.78
      const shimmerLines = 28
      for (let i = 0; i < shimmerLines; i++) {
        const progress = i / shimmerLines
        const lineY = waterTop + Math.pow(progress, 1.4) * (height - waterTop) * 0.85
        const lineAmp = (8 + progress * 40)
        const shimmerOffset = Math.sin(time * 0.0025 + i * 0.45) * lineAmp
        const shimmerWidth = (14 + progress * 65) * (0.8 + Math.sin(time * 0.004 + i) * 0.2)
        const alpha = Math.max(0, (0.35 - progress * 0.25)) * (0.7 + Math.sin(time * 0.003 + i * 0.6) * 0.3)

        ctx.strokeStyle = `rgba(255, 235, 170, ${alpha.toFixed(3)})`
        ctx.lineWidth = 1.5 + progress * 2
        ctx.beginPath()
        ctx.moveTo(moonX + shimmerOffset - shimmerWidth / 2, lineY)
        ctx.lineTo(moonX + shimmerOffset + shimmerWidth / 2, lineY)
        ctx.stroke()
      }

      // 2. ระลอกคลื่นน้ำบางๆ ทั่วแม่น้ำ (Gentle Water Ripples)
      const rippleCount = 14
      for (let i = 0; i < rippleCount; i++) {
        const progress = i / rippleCount
        const currentY = waterTop + 6 + progress * (height - waterTop) * 0.9
        const waveSpeed = (0.0008 + progress * 0.0008) * speedMultiplier
        const waveOffset = Math.sin(time * waveSpeed + i * 1.5) * 15
        const waveAlpha = (0.12 - progress * 0.08) * (0.7 + Math.sin(time * 0.002 + i) * 0.3)

        ctx.strokeStyle = `rgba(135, 175, 255, ${Math.max(0.02, waveAlpha).toFixed(3)})`
        ctx.lineWidth = 1 + progress * 1.5
        ctx.beginPath()

        const segLength = 40
        for (let x = -20; x < width + 40; x += segLength) {
          const dy = Math.sin((x + waveOffset) * 0.025 + i) * (1.2 + progress * 2)
          if (x === -20) {
            ctx.moveTo(x, currentY + dy)
          } else {
            ctx.lineTo(x, currentY + dy)
          }
        }
        ctx.stroke()
      }

      // 3. จุดแสงสะท้อนโคมลอยบนน้ำ
      lanterns.forEach(lantern => {
        if (lantern.y > height * 0.35 && lantern.y < waterTop) {
          const currentX = lantern.x + Math.sin(time * lantern.swaySpeed + lantern.phase) * lantern.swayAmp
          const distFromWater = waterTop - lantern.y
          const reflY = waterTop + distFromWater * 0.35
          if (reflY < height) {
            const reflAlpha = (0.15 * (1 - distFromWater / (height * 0.3))) * lantern.scale
            if (reflAlpha > 0.01) {
              const reflW = (12 + Math.sin(time * 0.005 + lantern.phase) * 4) * lantern.scale
              ctx.strokeStyle = `rgba(255, 180, 80, ${reflAlpha.toFixed(3)})`
              ctx.lineWidth = 1.2
              ctx.beginPath()
              ctx.moveTo(currentX - reflW / 2, reflY)
              ctx.lineTo(currentX + reflW / 2, reflY)
              ctx.stroke()
            }
          }
        }
      })
    }

    // Main Render Loop
    let lastTime = 0
    const render = (time) => {
      if (!isTabVisible) return

      lastTime = time

      // 1. ท้องฟ้ายามค่ำคืน (Night Sky Gradient)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.62)
      skyGrad.addColorStop(0, '#090e24')
      skyGrad.addColorStop(0.45, '#141a46')
      skyGrad.addColorStop(0.8, '#23255c')
      skyGrad.addColorStop(1, '#2d2a6e')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, width, height)

      // 2. ดวงดาวกะพริบ (Twinkling Stars)
      stars.forEach(star => {
        const alpha = Math.max(0.08, Math.min(1, star.baseAlpha + Math.sin(time * star.twinkleSpeed + star.phase) * 0.4))
        ctx.fillStyle = star.color
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      // 3. พระจันทร์
      drawMoon(time)

      // 4. อัปเดตและวาดโคมลอย (Floating Lanterns)
      const skyLimit = height * 0.58
      lanterns.forEach(lantern => {
        lantern.y -= lantern.speedY
        // เมื่อลอยพ้นขอบบน ให้รีเซ็ตกลับมาขอบฟ้า
        if (lantern.y < -35) {
          lantern.y = skyLimit + Math.random() * 30
          lantern.x = Math.random() * width
          lantern.scale = 0.45 + Math.random() * 0.65
        }
        drawLantern(lantern, time)
      })

      // 5. ผิวน้ำและแสงสะท้อน
      drawWater(time)

      animationFrameId = requestAnimationFrame(render)
    }

    // จัดการ visibilitychange เพื่อประหยัดแบตเตอรี่และคงประสิทธิภาพ
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isTabVisible = false
        if (animationFrameId) cancelAnimationFrame(animationFrameId)
      } else {
        isTabVisible = true
        animationFrameId = requestAnimationFrame(render)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    animationFrameId = requestAnimationFrame(render)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}
