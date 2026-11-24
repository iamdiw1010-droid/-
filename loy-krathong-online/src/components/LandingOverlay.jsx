import React from 'react'
import { motion } from 'framer-motion'
import { CONFIG } from '../config'

/**
 * LandingOverlay: หน้าต้อนรับสุดโรแมนติก
 * - แสดงข้อความต้อนรับตัวใหญ่ฟอนต์ Mali
 * - ไอคอนกระทงและพระจันทร์ลอยละมุน
 * - ปุ่มหลักขนาดใหญ่ กดง่ายด้วยนิ้วโป้ง พร้อมเอฟเฟกต์เรืองแสง pulse glow
 * - จัดการคลิกเพื่อสั่งเล่นเพลงตามข้อกำหนด autoplay
 */
export default function LandingOverlay({ onStart }) {
  // แยกบรรทัดของคำทักทายเพื่อทำ fade-in ทีละบรรทัด
  const greetingLines = CONFIG.greeting.split('\n')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-20 flex flex-col items-center justify-between px-5 py-8 safe-top safe-bottom max-w-md mx-auto"
    >
      {/* ส่วนบน: ตราสัญลักษณ์และดวงดาวประดับ */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="flex items-center space-x-2 text-gold/90 text-sm tracking-widest font-mali font-medium pt-3"
      >
        <span>✨</span>
        <span>คืนวันเพ็ญเดือนสิบสอง</span>
        <span>🌕</span>
      </motion.div>

      {/* ส่วนกลาง: ข้อความต้อนรับและกราฟิกลอยช้าๆ */}
      <div className="flex flex-col items-center text-center my-auto w-full px-2">
        {/* ไอคอนกระทง/ดวงจันทร์ลอยขึ้นลง */}
        <motion.div
          animate={{
            y: [-6, 6, -6],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-22 h-22 sm:w-24 sm:h-24 mb-5 rounded-full bg-white/10 backdrop-blur-md border border-gold/30 shadow-glow-gold flex items-center justify-center text-4xl sm:text-5xl"
        >
          🪷
        </motion.div>

        {/* ข้อความ Greeting ตัวใหญ่ฟอนต์ Mali */}
        <div className="space-y-2.5 mb-4 w-full">
          {greetingLines.map((line, idx) => (
            <motion.h1
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.25, duration: 0.8 }}
              className={`${
                idx === 0
                  ? 'text-2xl sm:text-3xl font-bold font-mali'
                  : 'text-base sm:text-lg font-semibold font-mali'
              } text-transparent bg-clip-text bg-gradient-to-r from-cream-100 via-gold-light to-gold drop-shadow-[0_2px_10px_rgba(255,207,107,0.3)] leading-relaxed`}
            >
              {line}
            </motion.h1>
          ))}
        </div>

        {/* คำบรรยายสั้นๆ อบอุ่น */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-cream-100/80 text-xs sm:text-sm font-sarabun max-w-xs leading-relaxed"
        >
          ขอเชิญคุณมาร่วมประดิษฐ์กระทง<br />
          และส่งคำอธิษฐานใต้แสงจันทร์ไปด้วยกัน
        </motion.p>
      </div>

      {/* ส่วนล่าง: ปุ่มเริ่มต้นขนาดใหญ่ */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.7 }}
        className="w-full pb-4"
      >
        <button
          type="button"
          onClick={onStart}
          className="w-full h-14 min-h-[52px] rounded-2xl bg-gradient-to-r from-gold-dark via-gold to-gold-light text-night-900 font-mali font-bold text-lg shadow-glow-gold-lg animate-pulse-glow active:scale-95 transition-transform flex items-center justify-center space-x-2 cursor-pointer outline-none border border-white/40"
          aria-label={CONFIG.startButton}
        >
          <span>{CONFIG.startButton}</span>
          <span className="text-xl">🪷</span>
        </button>
      </motion.div>
    </motion.div>
  )
}
