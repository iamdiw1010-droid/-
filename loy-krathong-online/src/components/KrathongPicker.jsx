import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import KrathongSVG from './KrathongSVG'

const KRATHONG_OPTIONS = [
  {
    id: 'banana',
    name: 'กระทงใบตอง',
    tag: 'คลาสสิก อบอุ่น',
    desc: 'ใบตองพับจีบประณีต พร้อมดอกดาวเรืองทอง',
  },
  {
    id: 'lotus',
    name: 'กระทงดอกบัว',
    tag: 'หวานละมุน',
    desc: 'กลีบบัวสีชมพูขาว ซ้อนไล่เฉดอย่างอ่อนหวาน',
  },
  {
    id: 'pastel',
    name: 'กระทงพาสเทล',
    tag: 'มินิมอล โรแมนติก',
    desc: 'โทนสีหวานเรียบหรู ประดับมุกใต้แสงจันทร์',
  },
]

/**
 * KrathongPicker: ตัวเลือกกระทง 3 สไตล์
 * - พรีวิวขนาดใหญ่ด้านบนพร้อมแอนิเมชันสลับที่นุ่มนวล
 * - การ์ดตัวเลือก 3 แบบ แตะสลับได้ง่าย มีสถานะเรืองแสง
 */
export default function KrathongPicker({ selectedVariant, onSelect }) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* ส่วนพรีวิวกระทงขนาดใหญ่ด้านบน */}
      <div className="relative w-48 h-40 sm:w-56 sm:h-44 flex items-center justify-center mb-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedVariant}
            initial={{ opacity: 0, scale: 0.82, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full h-full flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(255,207,107,0.35)]"
          >
            <KrathongSVG variant={selectedVariant} className="w-full h-full object-contain" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* หัวข้อ */}
      <h3 className="text-sm font-medium text-cream-100/90 mb-3 text-center tracking-wide">
        แตะเลือกรูปแบบกระทงคู่ใจ
      </h3>

      {/* แถบการ์ดตัวเลือก 3 แบบ */}
      <div className="grid grid-cols-3 gap-2.5 w-full">
        {KRATHONG_OPTIONS.map((option) => {
          const isSelected = selectedVariant === option.id
          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              whileTap={{ scale: 0.95 }}
              className={`relative flex flex-col items-center p-2 rounded-2xl transition-all duration-300 text-left cursor-pointer outline-none ${
                isSelected
                  ? 'bg-white/20 border-2 border-gold shadow-glow-gold'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10 opacity-75 hover:opacity-100'
              }`}
              aria-label={`เลือก${option.name}`}
              aria-pressed={isSelected}
            >
              {/* แสงเรืองเมื่อถูกเลือก */}
              {isSelected && (
                <motion.div
                  layoutId="picker-active-glow"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-t from-gold/20 to-transparent pointer-events-none"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              {/* ไอคอนกระทงจำลองในการ์ด */}
              <div className="w-12 h-10 mb-1 flex items-center justify-center pointer-events-none">
                <KrathongSVG variant={option.id} className="w-full h-full object-contain" />
              </div>

              {/* ชื่อกระทง */}
              <span className={`text-xs font-semibold text-center leading-tight mb-0.5 ${isSelected ? 'text-gold' : 'text-cream-100'}`}>
                {option.name}
              </span>

              {/* แท็กสั้นๆ */}
              <span className="text-[10px] text-cream-100/70 text-center scale-90">
                {option.tag}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
