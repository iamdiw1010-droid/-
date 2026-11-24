import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CONFIG } from '../config'

/**
 * SurpriseCard: ซองจดหมายเซอร์ไพรส์สุดพิเศษ
 * - โคมลอยดวงพิเศษลอยขึ้นมาแล้วเปลี่ยนเป็นการ์ดซองจดหมาย
 * - ซองจดหมายสีครีมพร้อมตราประทับหัวใจ ค่อยๆ เปิดฝา (3D rotateX)
 * - กระดาษจดหมายเลื่อนขึ้นพร้อมเอฟเฟกต์พิมพ์ดีด (Typewriter)
 * - เมื่อพิมพ์จบ: ถ้ามีรูปภาพ ให้รอ 1 วินาทีแล้วส่งสัญญาณเปลี่ยนเข้า Photo Slideshow
 * - ถ้าไม่มีรูปภาพ ให้แสดงปุ่ม "ลอยกระทงอีกอัน" ที่ท้ายจดหมายตามปกติ
 */
export default function SurpriseCard({
  coupleName,
  hasPhotos = false,
  onReset,
  onOpenPhoto,
  onTransitionToSlideshow,
  skipIntro = false,
}) {
  const [phase, setPhase] = useState(skipIntro ? 'opened' : 'rising-lantern')
  const [displayedText, setDisplayedText] = useState(skipIntro ? CONFIG.surpriseMessage : '')
  const [isTypingComplete, setIsTypingComplete] = useState(skipIntro)
  const [showSparkles, setShowSparkles] = useState(false)

  const typewriterTimeoutRef = useRef(null)
  const transitionTimeoutRef = useRef(null)

  // 1. ลำดับการเปลี่ยนจากโคมลอยเป็นซองจดหมาย
  useEffect(() => {
    if (skipIntro) return

    const lanternTimer = setTimeout(() => {
      setPhase('envelope-closed')
    }, 1800)

    const openTimer = setTimeout(() => {
      handleOpenEnvelope()
    }, 2600)

    return () => {
      clearTimeout(lanternTimer)
      clearTimeout(openTimer)
      if (typewriterTimeoutRef.current) clearTimeout(typewriterTimeoutRef.current)
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
    }
  }, [skipIntro])

  // เปิดซองจดหมายและเริ่มพิมพ์
  const handleOpenEnvelope = () => {
    setPhase('opened')
    setShowSparkles(true)
    setTimeout(() => setShowSparkles(false), 2500)
    startTypewriter()
  }

  // แอนิเมชันพิมพ์ทีละตัวอักษร
  const startTypewriter = () => {
    const fullText = CONFIG.surpriseMessage
    let currentIndex = 0
    setDisplayedText('')
    setIsTypingComplete(false)

    const typeNextChar = () => {
      if (currentIndex < fullText.length) {
        currentIndex++
        setDisplayedText(fullText.slice(0, currentIndex))
        typewriterTimeoutRef.current = setTimeout(typeNextChar, 38)
      } else {
        handleTypingDone()
      }
    }

    typewriterTimeoutRef.current = setTimeout(typeNextChar, 600)
  }

  // เมื่อพิมพ์ข้อความจบ
  const handleTypingDone = () => {
    setIsTypingComplete(true)

    // รอ 1 วินาที แล้วการ์ดจดหมายค่อยๆ เปลี่ยนเข้า Slideshow (ถ้ามีรูปภาพพร้อม)
    if (hasPhotos && onTransitionToSlideshow) {
      transitionTimeoutRef.current = setTimeout(() => {
        onTransitionToSlideshow()
      }, 1000)
    }
  }

  // แตะการ์ดเพื่อข้ามการพิมพ์
  const handleFastForward = () => {
    if (!isTypingComplete) {
      if (typewriterTimeoutRef.current) clearTimeout(typewriterTimeoutRef.current)
      setDisplayedText(CONFIG.surpriseMessage)
      handleTypingDone()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -45 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="fixed inset-0 z-30 flex items-center justify-center p-4 max-w-md mx-auto"
    >
      {/* เอฟเฟกต์ประกายไฟ/หัวใจกระจายตอนเปิดซอง */}
      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          {[...Array(16)].map((_, i) => {
            const angle = (i / 16) * Math.PI * 2
            const distance = 90 + Math.random() * 80
            const dx = Math.cos(angle) * distance
            const dy = Math.sin(angle) * distance
            const isHeart = i % 2 === 0
            return (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0.2, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 1.2,
                  x: dx,
                  y: dy,
                }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="absolute text-base select-none"
              >
                {isHeart ? '💖' : '✨'}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* 1. โคมลอยดวงพิเศษลอยขึ้นมากลางจอ */}
      <AnimatePresence>
        {phase === 'rising-lantern' && (
          <motion.div
            key="lantern"
            initial={{ y: 280, scale: 0.4, opacity: 0 }}
            animate={{ y: 0, scale: 1.3, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="flex flex-col items-center pointer-events-none"
          >
            <div className="w-24 h-32 rounded-2xl bg-gradient-to-t from-gold-dark via-gold to-white shadow-[0_0_50px_rgba(255,207,107,0.8)] border border-white/60 flex flex-col items-center justify-between p-2">
              <span className="text-xs text-night-900 font-mali font-bold">✨ มีอะไรจะบอก ✨</span>
              <span className="text-3xl animate-pulse">💌</span>
              <div className="w-4 h-4 rounded-full bg-white shadow-glow-candle" />
            </div>
            <p className="mt-3 text-sm font-mali text-gold drop-shadow-md">
              มีโคมความในใจส่งมาถึงคุณ...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. ซองจดหมายและกระดาษจดหมาย */}
      {phase !== 'rising-lantern' && (
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-full max-w-sm flex flex-col items-center"
        >
          {/* ซองจดหมายภายนอก */}
          <div className="relative w-full rounded-3xl bg-[#f5e9d3] border-2 border-[#d9c49d] shadow-[0_15px_40px_rgba(0,0,0,0.6)] p-1 overflow-hidden">
            {/* ฝาซองจดหมายด้านบน (3D rotateX) */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: phase === 'opened' ? -170 : 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
              className="absolute top-0 left-0 right-0 h-28 bg-[#eedec0] rounded-t-3xl border-b border-[#cca771] shadow-sm z-30 flex items-center justify-center pointer-events-none"
            >
              {/* ตราประทับขี้ผึ้งสีแดงหัวใจ */}
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-600 via-rose-700 to-red-900 border-2 border-red-400/60 shadow-md flex items-center justify-center text-white text-base">
                ❤️
              </div>
            </motion.div>

            {/* แผ่นกระดาษจดหมายด้านใน */}
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: phase === 'opened' ? 0 : 40 }}
              transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
              onClick={handleFastForward}
              className="relative bg-[#fffdf5] rounded-2xl p-5 pt-7 text-slate-800 shadow-inner min-h-[290px] flex flex-col justify-between cursor-pointer border border-[#f0e3ca]"
            >
              <div>
                {/* หัวจดหมาย */}
                <div className="flex items-center justify-between border-b border-rose-200 pb-2 mb-3">
                  <span className="text-xs font-mali font-semibold text-rose-500">
                    ถึง {coupleName || 'คนดีของฉัน'} 🌸
                  </span>
                  <span className="text-[11px] font-mali text-slate-400">
                    คืนวันลอยกระทง
                  </span>
                </div>

                {/* เนื้อหาจดหมาย พิมพ์ดีด */}
                <div className="text-base sm:text-lg font-mali text-slate-800 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto pr-1">
                  {displayedText}
                  {!isTypingComplete && (
                    <span className="inline-block w-2 h-4 ml-0.5 bg-rose-500 animate-pulse align-middle" />
                  )}
                </div>
              </div>

              {/* ข้อความกระตุ้นแตะข้ามตอนกำลังพิมพ์ */}
              {!isTypingComplete && (
                <p className="text-[10px] text-slate-400 text-center mt-2 italic font-sarabun">
                  (แตะที่การ์ดเพื่ออ่านทั้งหมดทันที)
                </p>
              )}
            </motion.div>
          </div>

          {/* แถบปุ่มท้ายจดหมาย (แสดงเมื่อไม่มีรูป หรือเมื่อย้อนกลับมาอ่าน) */}
          {isTypingComplete && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full mt-4 space-y-2.5 z-40"
            >
              {/* ปุ่มดูสไลด์โชว์ (ถ้ามีรูปภาพพร้อม) */}
              {hasPhotos && onOpenPhoto && (
                <button
                  type="button"
                  onClick={onOpenPhoto}
                  className="w-full h-13 min-h-[48px] rounded-2xl bg-gradient-to-r from-romance-pink via-rose-300 to-romance-rose text-night-900 font-mali font-bold text-base shadow-glow-pink active:scale-95 transition-transform flex items-center justify-center space-x-2 border border-white/50 cursor-pointer"
                  aria-label={CONFIG.slideshowTitle || 'ดูภาพความทรงจำของเรา'}
                >
                  <span>{CONFIG.slideshowTitle || 'ดูภาพความทรงจำของเรา'}</span>
                  <span className="text-lg">📸</span>
                </button>
              )}

              {/* ปุ่มลอยกระทงอีกอัน */}
              <button
                type="button"
                onClick={onReset}
                className="w-full h-13 min-h-[48px] rounded-2xl bg-night-800/80 hover:bg-night-700/80 backdrop-blur-md border border-gold/40 text-gold-light font-mali font-semibold text-base active:scale-95 transition-transform flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
                aria-label="ลอยกระทงอีกอัน"
              >
                <span>ลอยกระทงอีกอัน</span>
                <span className="text-lg">🪷</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
