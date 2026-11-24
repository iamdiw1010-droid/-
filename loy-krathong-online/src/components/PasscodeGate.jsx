import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CONFIG } from '../config'

/**
 * PasscodeGate: ด่านรหัสผ่านวันครบรอบก่อนเข้าสู่หน้าหลัก
 * - ช่องกรอก วัน (DD) / เดือน (MM) / ปี (YY/YYYY)
 * - เลื่อนโฟกัสข้ามช่องอัตโนมัติเมื่อพิมพ์ครบ
 * - ตรวจสอบคำตอบแบบยืดหยุ่น: รองรับ พ.ศ. (2568 หรือ 68) และ ค.ศ. (2025 หรือ 25)
 * - เอฟเฟกต์การ์ดสั่นเมื่อตอบผิด และแสดงคำใบ้เมื่อผิดครบจำนวนครั้งที่กำหนด
 * - เอฟเฟกต์หัวใจลอยและความสำเร็จเมื่อตอบถูกต้อง
 */
export default function PasscodeGate({ onSuccess }) {
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'error' | 'success'
  const [attempts, setAttempts] = useState(0)
  const [isShaking, setIsShaking] = useState(false)

  const dayInputRef = useRef(null)
  const monthInputRef = useRef(null)
  const yearInputRef = useRef(null)

  // ตรวจสอบ prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  // โฟกัสช่องวันอัตโนมัติเมื่อเปิดหน้า
  useEffect(() => {
    const timer = setTimeout(() => {
      dayInputRef.current?.focus()
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  // จัดการการเปลี่ยนข้อความในช่อง วัน (DD)
  const handleDayChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2)
    setDay(val)
    if (status === 'error') setStatus('idle')
    if (val.length === 2) {
      monthInputRef.current?.focus()
    }
  }

  // จัดการการเปลี่ยนข้อความในช่อง เดือน (MM)
  const handleMonthChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2)
    setMonth(val)
    if (status === 'error') setStatus('idle')
    if (val.length === 2) {
      yearInputRef.current?.focus()
    }
  }

  // จัดการการเปลี่ยนข้อความในช่อง ปี (YY/YYYY)
  const handleYearChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
    setYear(val)
    if (status === 'error') setStatus('idle')
  }

  // จัดการกดปุ่ม Backspace เพื่อถอยกลับไปช่องก่อนหน้าอย่างเป็นธรรมชาติ
  const handleKeyDown = (e, field) => {
    if (e.key === 'Backspace') {
      if (field === 'year' && year === '') {
        monthInputRef.current?.focus()
      } else if (field === 'month' && month === '') {
        dayInputRef.current?.focus()
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      verifyPasscode()
    }
  }

  // ฟังก์ชันตรวจสอบความถูกต้องของรหัสผ่าน
  const verifyPasscode = () => {
    if (!day || !month || !year) {
      triggerError()
      return
    }

    const d = parseInt(day, 10)
    const m = parseInt(month, 10)
    const y = parseInt(year, 10)

    const targetDay = CONFIG.gateAnswerDay
    const targetMonth = CONFIG.gateAnswerMonth
    const targetYearBE = CONFIG.gateAnswerYearBE
    const targetYearCE = targetYearBE - 543

    // ตรวจสอบวันและเดือน
    const isDayMatch = d === targetDay
    const isMonthMatch = m === targetMonth

    // ตรวจสอบปี: รองรับ พ.ศ. เต็ม (2568), พ.ศ. 2 หลัก (68), ค.ศ. เต็ม (2025), และ ค.ศ. 2 หลัก (25)
    const isYearMatch = (
      y === targetYearBE ||
      y === (targetYearBE % 100) ||
      y === targetYearCE ||
      y === (targetYearCE % 100)
    )

    if (isDayMatch && isMonthMatch && isYearMatch) {
      // ตอบถูกต้อง
      setStatus('success')
      setTimeout(() => {
        onSuccess()
      }, 1200)
    } else {
      // ตอบผิด
      triggerError()
    }
  }

  // จัดการสถานะตอบผิด
  const triggerError = () => {
    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    setStatus('error')

    // เขย่าการ์ดเฉพาะเมื่อไม่ได้เปิด prefers-reduced-motion
    if (!prefersReducedMotion) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
    }

    // ล้างช่องกรอกและโฟกัสกลับไปที่ช่องวัน
    setDay('')
    setMonth('')
    setYear('')
    dayInputRef.current?.focus()
  }

  const showHint = attempts >= CONFIG.gateMaxAttemptsBeforeHint

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-20 flex flex-col items-center justify-center px-4 safe-top safe-bottom max-w-md mx-auto"
    >
      {/* การ์ดแก้วกลางจอ พร้อมแอนิเมชันสั่นเมื่อกรอกผิด */}
      <motion.div
        animate={isShaking ? { x: [-14, 14, -10, 10, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        className="glass-card rounded-3xl p-6 sm:p-7 w-full shadow-2xl relative overflow-hidden text-center border border-white/20"
      >
        {/* ไอคอนกุญแจหัวใจ */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur-md border border-gold/30 shadow-glow-gold flex items-center justify-center text-3xl">
          {status === 'success' ? '💖' : '🔐'}
        </div>

        {/* คำถามฟอนต์ Mali ตัวใหญ่ */}
        <h2 className="text-xl sm:text-2xl font-bold font-mali text-transparent bg-clip-text bg-gradient-to-r from-cream-100 via-gold-light to-gold mb-2 leading-relaxed">
          {CONFIG.gateQuestion}
        </h2>

        <p className="text-xs text-cream-100/75 mb-6 font-sarabun">
          ใส่วันสำคัญเพื่อปลดล็อกค่ำคืนวันลอยกระทงของเรา
        </p>

        {/* ช่องกรอกวันที่ 3 ช่อง: DD / MM / YY */}
        <div className="flex justify-center items-center space-x-2 sm:space-x-3 mb-5">
          {/* ช่องวัน (DD) */}
          <div className="flex flex-col items-center">
            <label htmlFor="gate-day" className="sr-only">วันที่ (DD)</label>
            <input
              id="gate-day"
              ref={dayInputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              value={day}
              onChange={handleDayChange}
              onKeyDown={(e) => handleKeyDown(e, 'day')}
              placeholder="DD"
              disabled={status === 'success'}
              className="w-16 sm:w-20 h-14 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mali rounded-2xl bg-white/10 border border-white/25 text-cream-100 placeholder-white/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/50 shadow-inner transition-all"
              aria-label="วันที่ (DD)"
            />
            <span className="text-[11px] text-cream-100/60 mt-1">วัน</span>
          </div>

          <span className="text-gold/50 text-xl font-bold self-center -mt-4">/</span>

          {/* ช่องเดือน (MM) */}
          <div className="flex flex-col items-center">
            <label htmlFor="gate-month" className="sr-only">เดือน (MM)</label>
            <input
              id="gate-month"
              ref={monthInputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              value={month}
              onChange={handleMonthChange}
              onKeyDown={(e) => handleKeyDown(e, 'month')}
              placeholder="MM"
              disabled={status === 'success'}
              className="w-16 sm:w-20 h-14 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mali rounded-2xl bg-white/10 border border-white/25 text-cream-100 placeholder-white/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/50 shadow-inner transition-all"
              aria-label="เดือน (MM)"
            />
            <span className="text-[11px] text-cream-100/60 mt-1">เดือน</span>
          </div>

          <span className="text-gold/50 text-xl font-bold self-center -mt-4">/</span>

          {/* ช่องปี (YY หรือ YYYY) */}
          <div className="flex flex-col items-center">
            <label htmlFor="gate-year" className="sr-only">ปี (YY หรือ YYYY)</label>
            <input
              id="gate-year"
              ref={yearInputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={year}
              onChange={handleYearChange}
              onKeyDown={(e) => handleKeyDown(e, 'year')}
              placeholder="ปี"
              disabled={status === 'success'}
              className="w-20 sm:w-24 h-14 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mali rounded-2xl bg-white/10 border border-white/25 text-cream-100 placeholder-white/30 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/50 shadow-inner transition-all"
              aria-label="ปี พ.ศ. หรือ ค.ศ."
            />
            <span className="text-[11px] text-cream-100/60 mt-1">ปี (พ.ศ./ค.ศ.)</span>
          </div>
        </div>

        {/* ข้อความแจ้งเตือนสถานะ พร้อม aria-live */}
        <div aria-live="polite" className="min-h-[28px] mb-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {status === 'success' && (
              <motion.p
                key="success"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-semibold font-mali text-gold drop-shadow-md flex items-center space-x-1"
              >
                <span>✨</span>
                <span>{CONFIG.gateSuccessText}</span>
                <span>💛</span>
              </motion.p>
            )}

            {status === 'error' && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-semibold font-mali text-rose-300 drop-shadow-md flex items-center space-x-1"
              >
                <span>ยังไม่ใช่นะ ลองนึกดูอีกที 🥺</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* คำใบ้เมื่อตอบผิดครบจำนวนครั้งที่กำหนด */}
        {showHint && status !== 'success' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-5 p-3 rounded-xl bg-gold/15 border border-gold/30 text-gold-light text-xs font-mali"
            aria-live="polite"
          >
            {CONFIG.gateHint}
          </motion.div>
        )}

        {/* ปุ่มเปิดดู ขนาดใหญ่ตามข้อกำหนด */}
        <button
          type="button"
          onClick={verifyPasscode}
          disabled={status === 'success'}
          className="w-full h-14 min-h-[52px] rounded-2xl bg-gradient-to-r from-gold-dark via-gold to-gold-light text-night-900 font-mali font-bold text-lg shadow-glow-gold active:scale-95 transition-transform flex items-center justify-center space-x-2 cursor-pointer outline-none border border-white/40 disabled:opacity-80"
          aria-label="เปิดดู"
        >
          <span>เปิดดู</span>
          <span className="text-xl">✨</span>
        </button>

        {/* ละอองหัวใจลอยขึ้นเมื่อตอบถูก */}
        {status === 'success' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {[
              { id: 1, x: -50, y: -40, delay: 0.1 },
              { id: 2, x: 50, y: -50, delay: 0.2 },
              { id: 3, x: 0, y: -70, delay: 0.3 },
              { id: 4, x: -30, y: -90, delay: 0.4 },
              { id: 5, x: 35, y: -85, delay: 0.5 },
            ].map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.4, 1.3, 1],
                  x: p.x,
                  y: p.y,
                }}
                transition={{ duration: 1.1, delay: p.delay, ease: 'easeOut' }}
                className="absolute text-2xl select-none"
              >
                💖
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
