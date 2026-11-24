import React from 'react'
import { motion } from 'framer-motion'

/**
 * WishText: ข้อความคำอธิษฐานเรืองแสง
 * - ลอยขึ้นเหนือกระทง ลอยสูงขึ้นช้าๆ แล้วค่อยๆ จางหายภายใน ~4.5 วินาที
 * - ตัวอักษรสีทองอ่อนพร้อมแสงเรือง drop-shadow
 */
export default function WishText({ wish }) {
  if (!wish) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.92 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [10, -30, -65, -100],
        scale: [0.92, 1, 1, 0.95],
      }}
      transition={{
        duration: 4.5,
        times: [0, 0.18, 0.72, 1],
        ease: 'easeOut',
      }}
      className="pointer-events-none absolute bottom-44 sm:bottom-48 left-0 right-0 px-6 flex flex-col items-center text-center z-30"
    >
      <div className="bg-night-900/60 backdrop-blur-sm px-4 py-2 rounded-2xl border border-gold/30 shadow-glow-gold max-w-xs">
        <p className="text-sm font-mali font-medium text-cream-100 drop-shadow-[0_2px_8px_rgba(255,207,107,0.7)] leading-relaxed">
          &ldquo;{wish}&rdquo;
        </p>
      </div>
    </motion.div>
  )
}
