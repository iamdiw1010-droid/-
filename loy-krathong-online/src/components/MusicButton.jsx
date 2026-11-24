import React from 'react'
import { motion } from 'framer-motion'

/**
 * MusicButton: ปุ่มควบคุมเสียงเพลงมุมบนขวา
 * - ไอคอน SVG inline สลับระหว่างเปิดเสียงและปิดเสียง
 * - ซ่อนตัวเองอัตโนมัติหากไฟล์เพลงไม่มีหรือไม่พร้อมใช้งาน
 * - คำนึงถึง Safe Area บน iPhone
 */
export default function MusicButton({ isPlaying, isMuted, isAvailable, onToggle }) {
  if (!isAvailable) return null

  const isAudioActive = isPlaying && !isMuted

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.9 }}
      className={`fixed top-4 right-4 z-50 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 outline-none backdrop-blur-md safe-top-offset ${
        isAudioActive
          ? 'bg-gold/25 border border-gold/50 text-gold shadow-glow-gold'
          : 'bg-white/10 border border-white/20 text-cream-100/60'
      }`}
      style={{
        top: 'max(16px, env(safe-area-inset-top, 16px))',
        right: 'max(16px, env(safe-area-inset-right, 16px))',
      }}
      aria-label={isAudioActive ? 'ปิดเสียงเพลง' : 'เปิดเสียงเพลง'}
      title={isAudioActive ? 'ปิดเสียงเพลง' : 'เปิดเสียงเพลง'}
    >
      {isAudioActive ? (
        // ไอคอนเปิดเสียง (Speaker with sound waves)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 animate-pulse"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        // ไอคอนปิดเสียง (Speaker muted with cross)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </svg>
      )}
    </motion.button>
  )
}
