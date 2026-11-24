import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import KrathongSVG from './KrathongSVG'
import WishText from './WishText'

/**
 * FloatingKrathong: แอนิเมชันปล่อยกระทงลงสู่สายน้ำ
 * - แตะผิวน้ำพร้อมระลอกคลื่นกระเพื่อม 3 วง
 * - ลอยเฉียงออกไปสู่ความไกล ย่อส่วนลงอย่างสมจริง
 * - มีการโยกเบาๆ (bobbing) ตามกระแสน้ำ
 * - เงาสะท้อนบนผิวน้ำกลับด้านจางๆ
 * - ป้ายชื่อคู่รักใต้กระทง
 * - ละอองหัวใจสีชมพูลอยขึ้นเป็นระยะ
 */
export default function FloatingKrathong({ variant, coupleName, wish }) {
  const [hasTouchedWater, setHasTouchedWater] = useState(false)

  useEffect(() => {
    // เกิดระลอกคลื่นหลังจากกระทงเริ่มแตะน้ำ
    const timer = setTimeout(() => {
      setHasTouchedWater(true)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col items-center justify-center overflow-hidden">
      {/* ข้อความคำอธิษฐานลอยขึ้น */}
      <WishText wish={wish} />

      {/* กลุ่มกระทงที่ลอยไปตามสายน้ำ */}
      <motion.div
        initial={{ y: 160, x: 0, scale: 1.1, opacity: 0 }}
        animate={{
          y: [160, 40, -10, -60, -110],
          x: [0, 10, -8, 25, 45],
          scale: [1.1, 0.95, 0.85, 0.75, 0.62],
          opacity: [0, 1, 1, 1, 0.85],
        }}
        transition={{
          duration: 9,
          times: [0, 0.15, 0.4, 0.7, 1],
          ease: 'easeInOut',
        }}
        className="relative flex flex-col items-center"
      >
        {/* วงระลอกคลื่นน้ำเมื่อกระทงแตะผิวน้ำ */}
        {hasTouchedWater && (
          <div className="absolute top-[125px] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            {[0, 0.4, 0.8].map((delay, index) => (
              <motion.div
                key={index}
                initial={{ width: 40, height: 16, opacity: 0.8, scale: 0.6 }}
                animate={{ width: 220, height: 70, opacity: 0, scale: 1.8 }}
                transition={{
                  duration: 2.4,
                  delay,
                  repeat: 2,
                  ease: 'easeOut',
                }}
                className="absolute -top-3 -left-16 sm:-left-20 rounded-[100%] border border-gold/45 shadow-[0_0_12px_rgba(255,207,107,0.3)]"
              />
            ))}
          </div>
        )}

        {/* แสงเรืองบนผิวน้ำรอบกระทง */}
        <div className="absolute top-[70px] w-48 h-24 rounded-full bg-gradient-to-r from-gold/10 via-gold/30 to-gold/10 blur-xl pointer-events-none" />

        {/* ตัวกระทงพร้อมการโยกตามระลอกคลื่น (Bobbing) */}
        <motion.div
          animate={{
            y: [-3, 3, -3],
            rotate: [-1.8, 1.8, -1.8],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-44 h-36 flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(255,180,60,0.4)]"
        >
          <KrathongSVG variant={variant} className="w-full h-full object-contain" />
        </motion.div>

        {/* เงาสะท้อนกลับด้านใต้กระทงบนผิวน้ำ */}
        <div className="relative w-44 h-24 -mt-7 opacity-25 filter blur-[1.5px] scale-y-[-0.6] pointer-events-none overflow-hidden">
          <KrathongSVG variant={variant} className="w-full h-full object-contain" />
        </div>

        {/* ป้ายชื่อคู่ลอยใต้กระทง */}
        {coupleName && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.9, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-1 px-3 py-1 rounded-full bg-night-900/60 backdrop-blur-xs border border-gold/30 text-[11px] font-mali text-gold-light flex items-center space-x-1 shadow-sm"
          >
            <span>💕</span>
            <span>{coupleName}</span>
          </motion.div>
        )}

        {/* ละอองหัวใจสีชมพูลอยขึ้นเป็นระยะ */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-24 pointer-events-none">
          {[
            { id: 1, x: -20, delay: 1.0, size: 'text-xs' },
            { id: 2, x: 22, delay: 2.2, size: 'text-sm' },
            { id: 3, x: -8, delay: 3.4, size: 'text-[10px]' },
            { id: 4, x: 15, delay: 4.6, size: 'text-xs' },
          ].map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30, x: item.x, scale: 0.5 }}
              animate={{
                opacity: [0, 0.9, 0],
                y: [30, -40],
                x: [item.x, item.x + (item.x > 0 ? 10 : -10)],
                scale: [0.5, 1, 0.7],
              }}
              transition={{
                duration: 3,
                delay: item.delay,
                repeat: Infinity,
                repeatDelay: 2,
                ease: 'easeOut',
              }}
              className={`absolute left-1/2 ${item.size} select-none`}
            >
              💖
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
