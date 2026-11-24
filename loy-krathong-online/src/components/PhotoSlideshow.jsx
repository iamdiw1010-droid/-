import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CONFIG } from '../config'

// มุมเอียงคงที่สำหรับแต่ละลำดับรูป (-3 ถึง +3 องศา)
const ROTATIONS = [-2.2, 1.8, -1.5, 2.5, -2.8, 1.4, -1.9, 2.1]

/**
 * PhotoSlideshow: สไลด์โชว์ภาพความทรงจำคู่รักสไตล์โพลารอยด์
 * - ลบคำบรรยายใต้ภาพออกตามความต้องการ เน้นภาพคู่รักชัดเจนเต็มตา
 * - Auto-play ทุก slideshowIntervalMs พัก 8 วินาทีเมื่อผู้ใช้ปัดเอง
 * - Ken Burns เอฟเฟกต์ซูมเบาๆ 1 -> 1.06
 * - Swipe ซ้าย/ขวา ปัดเปลี่ยนรูป (drag > 80px)
 * - แตะค้างหรือดับเบิลคลิกเพื่อ Zoom ขยายรูปเต็มจอ
 * - ปุ่ม "กลับไปดูกระทงที่ลอยไปแล้ว", "ย้อนอ่านจดหมาย" และ "ลอยกระทงอีกอัน"
 */
export default function PhotoSlideshow({
  photos = [],
  onBackToLetter,
  onReset,
  onViewKrathong,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1) // 1: ถัดไป (ขวา), -1: ย้อนกลับ (ซ้าย)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isZoomed, setIsZoomed] = useState(false)
  const [hasCompletedFirstCycle, setHasCompletedFirstCycle] = useState(false)

  const autoPlayTimerRef = useRef(null)
  const pauseResumeTimeoutRef = useRef(null)
  const longPressTimerRef = useRef(null)

  const total = photos.length
  const currentPhoto = photos[currentIndex]

  // ตรวจสอบ prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  // เช็คเมื่อดูถึงรูปสุดท้ายในรอบแรก
  useEffect(() => {
    if (total > 0 && currentIndex === total - 1) {
      setHasCompletedFirstCycle(true)
    }
  }, [currentIndex, total])

  // ฟังก์ชันเลื่อนไปรูปถัดไป
  const handleNext = useCallback(() => {
    if (total <= 1) return
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % total)
  }, [total])

  // ฟังก์ชันย้อนกลับรูปก่อนหน้า
  const handlePrev = useCallback(() => {
    if (total <= 1) return
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  // หยุด Auto-play ชั่วคราว 8 วินาทีเมื่อผู้ใช้สัมผัสหรือปัดเอง แล้วค่อยเล่นต่อ
  const pauseAutoPlayTemporarily = useCallback(() => {
    if (pauseResumeTimeoutRef.current) clearTimeout(pauseResumeTimeoutRef.current)
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)

    pauseResumeTimeoutRef.current = setTimeout(() => {
      setIsPlaying(true)
    }, 8000)
  }, [])

  // ควบคุม Auto-play Timer
  useEffect(() => {
    if (!isPlaying || isZoomed || total <= 1) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
      return
    }

    autoPlayTimerRef.current = setInterval(() => {
      handleNext()
    }, CONFIG.slideshowIntervalMs || 4500)

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
    }
  }, [isPlaying, isZoomed, handleNext, total])

  // จัดการ visibilitychange: หยุดเมื่อแท็บซ่อน และเล่นต่อเมื่อกลับมา
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
      } else if (isPlaying && !isZoomed && total > 1) {
        if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
        autoPlayTimerRef.current = setInterval(handleNext, CONFIG.slideshowIntervalMs || 4500)
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      if (pauseResumeTimeoutRef.current) clearTimeout(pauseResumeTimeoutRef.current)
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current)
    }
  }, [isPlaying, isZoomed, handleNext, total])

  // คีย์บอร์ดลูกศรซ้าย/ขวา และ Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        pauseAutoPlayTemporarily()
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        pauseAutoPlayTemporarily()
        handlePrev()
      } else if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false)
        } else if (onBackToLetter) {
          onBackToLetter()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev, onBackToLetter, isZoomed, pauseAutoPlayTemporarily])

  // จัดการ Drag / Swipe
  const handleDragEnd = (event, info) => {
    pauseAutoPlayTemporarily()
    const offset = info.offset.x
    const velocity = info.velocity.x

    if (offset < -80 || velocity < -500) {
      handleNext()
    } else if (offset > 80 || velocity > 500) {
      handlePrev()
    }
  }

  // แตะค้าง (Long Press > 500ms) เพื่อ Zoom รูปเต็มจอ
  const handleTouchStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      setIsZoomed(true)
    }, 550)
  }

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current)
  }

  if (total === 0 || !currentPhoto) return null

  // คำนวณมุมเอียงของโพลารอยด์
  const rotationAngle = prefersReducedMotion ? 0 : ROTATIONS[currentIndex % ROTATIONS.length]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-between px-3 py-4 safe-top safe-bottom bg-black/45 backdrop-blur-md select-none overflow-hidden"
    >
      {/* ละอองหัวใจสีชมพูลอยขึ้นเบื้องหลัง */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[
            { id: 1, x: '15%', delay: 0 },
            { id: 2, x: '82%', delay: 1.5 },
            { id: 3, x: '35%', delay: 3.2 },
            { id: 4, x: '68%', delay: 4.8 },
            { id: 5, x: '50%', delay: 2.2 },
          ].map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 0, y: '105vh', scale: 0.4 }}
              animate={{
                opacity: [0, 0.7, 0],
                y: ['105vh', '-10vh'],
                scale: [0.4, 0.9, 0.6],
                x: [0, 15, -15, 0],
              }}
              transition={{
                duration: 7,
                delay: heart.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute text-xl"
              style={{ left: heart.x }}
            >
              💖
            </motion.div>
          ))}
        </div>
      )}

      {/* แถบด้านบน: หัวข้อ SlideshowTitle ฟอนต์ Mali */}
      <div
        data-no-fireworks
        className="w-full max-w-sm flex items-center justify-between pt-2 px-2 z-10"
      >
        <div className="flex items-center space-x-2">
          <span className="text-xl">✨</span>
          <h2 className="text-lg sm:text-xl font-bold font-mali text-transparent bg-clip-text bg-gradient-to-r from-cream-100 via-gold-light to-gold drop-shadow-md">
            {CONFIG.slideshowTitle || 'ภาพความทรงจำของเรา'}
          </h2>
        </div>

        {/* ปุ่มสลับเล่น / หยุดอัตโนมัติ */}
        {total > 1 && (
          <button
            type="button"
            data-no-fireworks
            onClick={() => {
              setIsPlaying(!isPlaying)
              if (!isPlaying) handleNext()
            }}
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-cream-100/80 text-xs font-mali flex items-center space-x-1 transition-all active:scale-95"
            aria-label={isPlaying ? 'หยุดชั่วคราว' : 'เล่นต่อเนื่อง'}
          >
            <span>{isPlaying ? '⏸️' : '▶️'}</span>
            <span>{isPlaying ? 'พัก' : 'เล่น'}</span>
          </button>
        )}
      </div>

      {/* ตรงกลาง: กรอบโพลารอยด์ พร้อม Swipe & Ken Burns (ไม่มีคำบรรยายใต้ภาพ) */}
      <div
        className="relative w-full max-w-[420px] flex items-center justify-center my-auto px-2 z-10"
        style={{ height: 'min(62dvh, 480px)' }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPhoto.src}
            custom={direction}
            drag={total > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={handleDragEnd}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={() => setIsZoomed(true)}
            initial={{
              opacity: 0,
              x: direction * 70,
              scale: 0.9,
              rotate: rotationAngle - direction * 3,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
              rotate: rotationAngle,
            }}
            exit={{
              opacity: 0,
              x: -direction * 70,
              scale: 0.92,
              rotate: rotationAngle + direction * 4,
            }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            data-no-fireworks
            style={{
              touchAction: 'pan-y',
              backgroundColor: '#fff6e5',
            }}
            className="relative w-full max-w-[88vw] rounded-2xl p-3 pb-6 shadow-[0_15px_40px_rgba(255,207,107,0.25)] border border-[#f0e3ca] cursor-grab active:cursor-grabbing flex flex-col justify-between"
          >
            {/* ประกายทองที่มุมกรอบรูป */}
            <div className="absolute top-2 right-2 text-gold animate-pulse text-sm pointer-events-none">
              ✨
            </div>

            {/* ส่วนรูปภาพ object-fit: contain รองรับทั้งแนวตั้งและแนวนอน */}
            <div className="w-full flex-1 min-h-[240px] max-h-[50dvh] rounded-xl overflow-hidden bg-night-900/10 flex items-center justify-center relative">
              <motion.img
                src={currentPhoto.src}
                alt="รูปภาพความทรงจำ"
                decoding="async"
                draggable={false}
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: [1, 1.06],
                      }
                }
                transition={{
                  duration: (CONFIG.slideshowIntervalMs || 4500) / 1000,
                  ease: 'linear',
                }}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ปุ่มลูกศรซ้าย/ขวาสำหรับจอใหญ่ (> 640px) */}
        {total > 1 && (
          <>
            <button
              type="button"
              data-no-fireworks
              onClick={() => {
                pauseAutoPlayTemporarily()
                handlePrev()
              }}
              className="hidden sm:flex absolute -left-14 top-1/2 -translate-y-1/2 w-12 h-12 min-w-[48px] min-h-[48px] rounded-full glass-panel border border-gold/40 text-gold items-center justify-center text-xl shadow-lg active:scale-95 transition-transform"
              aria-label="รูปก่อนหน้า"
            >
              ‹
            </button>
            <button
              type="button"
              data-no-fireworks
              onClick={() => {
                pauseAutoPlayTemporarily()
                handleNext()
              }}
              className="hidden sm:flex absolute -right-14 top-1/2 -translate-y-1/2 w-12 h-12 min-w-[48px] min-h-[48px] rounded-full glass-panel border border-gold/40 text-gold items-center justify-center text-xl shadow-lg active:scale-95 transition-transform"
              aria-label="รูปถัดไป"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* จุดบอกตำแหน่ง (Dots) และตัวนับตัวเลข */}
      {total > 1 && (
        <div data-no-fireworks className="flex flex-col items-center space-y-1 z-10">
          <div className="flex items-center space-x-1.5">
            {photos.map((_, idx) => (
              <button
                key={idx}
                type="button"
                data-no-fireworks
                onClick={() => {
                  pauseAutoPlayTemporarily()
                  setDirection(idx > currentIndex ? 1 : -1)
                  setCurrentIndex(idx)
                }}
                className={`transition-all rounded-full ${
                  currentIndex === idx
                    ? 'w-6 h-2 bg-gold shadow-glow-gold'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`ไปยังรูปที่ ${idx + 1}`}
              />
            ))}
          </div>
          <span className="text-xs text-cream-100/70 font-mali">
            {currentIndex + 1} / {total}
          </span>
        </div>
      )}

      {/* แถบปุ่มด้านล่าง */}
      <div data-no-fireworks className="w-full max-w-sm flex flex-col space-y-2 pt-2 z-10 px-1">
        {/* ปุ่มกลับไปดูกระทงที่ลอยไปแล้ว */}
        {onViewKrathong && (
          <button
            type="button"
            data-no-fireworks
            onClick={onViewKrathong}
            className="w-full h-11 min-h-[44px] rounded-2xl bg-gold/20 hover:bg-gold/30 backdrop-blur-md border border-gold/50 text-gold-light font-mali font-semibold text-xs sm:text-sm active:scale-95 transition-transform flex items-center justify-center space-x-1.5 shadow-md"
            aria-label="กลับไปดูกระทงที่ลอยไปแล้ว"
          >
            <span>🪷</span>
            <span>กลับไปดูกระทงที่ลอยไปแล้ว</span>
          </button>
        )}

        <div className="flex items-center space-x-2">
          {/* ปุ่มย้อนกลับไปอ่านจดหมาย */}
          <button
            type="button"
            data-no-fireworks
            onClick={onBackToLetter}
            className="flex-1 h-11 min-h-[44px] rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-cream-100 font-mali font-medium text-xs sm:text-sm active:scale-95 transition-transform flex items-center justify-center space-x-1"
            aria-label="ย้อนกลับไปอ่านจดหมาย"
          >
            <span>💌</span>
            <span>ย้อนอ่านจดหมาย</span>
          </button>

          {/* ปุ่มลอยกระทงอีกอัน (เรืองแสงเมื่อเล่นถึงรูปสุดท้ายในรอบแรก) */}
          <button
            type="button"
            data-no-fireworks
            onClick={onReset}
            className={`flex-1 h-11 min-h-[44px] rounded-2xl font-mali font-bold text-xs sm:text-sm active:scale-95 transition-transform flex items-center justify-center space-x-1 ${
              hasCompletedFirstCycle
                ? 'bg-gradient-to-r from-gold-dark via-gold to-gold-light text-night-900 shadow-glow-gold animate-pulse-glow border border-white/40'
                : 'bg-night-800/80 border border-gold/40 text-gold-light'
            }`}
            aria-label="ลอยกระทงอีกอัน"
          >
            <span>✨</span>
            <span>ลอยกระทงอีกอัน</span>
          </button>
        </div>
      </div>

      {/* Zoom Overlay เมื่อแตะค้างหรือดับเบิลคลิกรูป (ไม่มีข้อความใต้รูป) */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-lg cursor-zoom-out"
          >
            <div className="relative max-w-full max-h-[85vh] flex items-center justify-center">
              <img
                src={currentPhoto.src}
                alt="ขยายรูปภาพ"
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              />
            </div>
            <p className="text-[11px] text-cream-100/50 font-mali mt-3">
              (แตะที่ใดก็ได้เพื่อปิดการขยาย)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
