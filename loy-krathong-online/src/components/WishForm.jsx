import React from 'react'
import { motion } from 'framer-motion'
import KrathongPicker from './KrathongPicker'

/**
 * WishForm: ส่วนประดิษฐ์กระทงและคำอธิษฐาน
 * - กำหนดชื่อคู่รักเป็น "ดิว & จินนี่" อัตโนมัติโดยไม่ต้องกรอก
 * - รองรับการ scroll เพื่อไม่ให้คีย์บอร์ดมือถือบังปุ่ม
 * - input font-size >= 16px กัน iOS auto-zoom
 * - มีตัวนับความยาวตัวอักษร
 * - ปุ่มปล่อยกระทงขนาดใหญ่ สะดวกต่อการแตะด้วยนิ้วโป้ง
 */
export default function WishForm({
  coupleName,
  wish,
  setWish,
  selectedVariant,
  setSelectedVariant,
  onSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault()
    // ถ้าคำอธิษฐานว่าง ให้ใช้ข้อความเริ่มต้น
    const finalWish = wish.trim() || 'ขอให้เรารักกันตลอดไป'
    onSubmit(finalWish)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto px-4 py-3 flex flex-col h-full safe-top safe-bottom z-10"
    >
      {/* ส่วนหัวการ์ด */}
      <div className="text-center mb-2">
        <h2 className="text-xl sm:text-2xl font-bold font-mali text-gold drop-shadow-md">
          เลือกกระทงของเรา 🪷
        </h2>
        {/* ป้ายชื่อคู่รัก ดิว & จินนี่ */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 mt-1 rounded-full bg-gold/15 border border-gold/35 text-gold-light text-xs font-mali font-medium shadow-sm">
          <span>💕</span>
          <span>{coupleName || 'ดิว & จินนี่'}</span>
          <span>💕</span>
        </div>
      </div>

      {/* กล่องเลื่อนเนื้อหา (Scrollable Container สำหรับจอเล็ก/เวลาคีย์บอร์ดเปิด) */}
      <div className="flex-1 overflow-y-auto px-1 py-1 space-y-4 rounded-3xl pb-24">
        {/* การ์ดแก้วบรรจุฟอร์ม */}
        <div className="glass-card rounded-3xl p-4 sm:p-5 space-y-4">
          {/* ตัวเลือกกระทง */}
          <KrathongPicker
            selectedVariant={selectedVariant}
            onSelect={setSelectedVariant}
          />

          <hr className="border-white/10 my-1" />

          {/* ช่องคำอธิษฐาน (ไม่ต้องกรอกชื่อแล้ว) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="wish-text" className="text-xs font-semibold text-gold-light flex items-center space-x-1">
                <span>🌙</span>
                <span>คำอธิษฐานใต้แสงจันทร์</span>
              </label>
              <span className="text-[11px] text-cream-100/50">
                {wish.length}/120
              </span>
            </div>
            <textarea
              id="wish-text"
              rows={3}
              maxLength={120}
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="ขอให้เรารักกันนานๆ มีรอยยิ้มให้กันทุกวัน สุขภาพแข็งแรง..."
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-cream-100 placeholder-white/35 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition duration-200 text-base resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* ปุ่มปล่อยกระทงด้านล่าง ติดที่ด้านล่างจอพร้อมเงาเรืองแสง */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-night-900 via-night-900/90 to-transparent max-w-md mx-auto z-20">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full h-14 min-h-[52px] rounded-2xl bg-gradient-to-r from-gold-dark via-gold to-gold-light text-night-900 font-mali font-bold text-lg shadow-glow-gold-lg active:scale-95 transition-transform flex items-center justify-center space-x-2 cursor-pointer outline-none border border-white/30"
          aria-label="ปล่อยกระทงลงน้ำ"
        >
          <span>ปล่อยกระทงลงน้ำ</span>
          <span className="text-xl">🌊</span>
        </button>
      </div>
    </motion.div>
  )
}
