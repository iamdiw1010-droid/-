import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * PhotoModal: ป๊อปอัปแสดงรูปภาพคู่รักสไตล์โพลารอยด์
 * - เปิดด้วยแอนิเมชัน scale + fade
 * - กรอบรูปโพลารอยด์เอียงเล็กน้อย เพิ่มความรู้สึกคลาสสิกและอบอุ่น
 * - ปิดได้ด้วยการแตะนอกกรอบหรือปุ่มกากบาท (X)
 */
export default function PhotoModal({ isOpen, onClose, photoSrc, coupleName }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          {/* การ์ดโพลารอยด์ */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -6 }}
            animate={{ scale: 1, opacity: 1, rotate: -1.5 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 4 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white text-slate-800 rounded-2xl p-3.5 pb-7 max-w-xs sm:max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
          >
            {/* ปุ่มปิด (X) */}
            <button
              type="button"
              onClick={onClose}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-night-900 border border-gold/40 text-gold flex items-center justify-center shadow-lg active:scale-90 transition-transform"
              aria-label="ปิดรูปภาพ"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* ส่วนรูปภาพ */}
            <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 mb-3 shadow-inner">
              <img
                src={photoSrc}
                alt="รูปคู่ของเรา"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>

            {/* ข้อความใต้ภาพสไตล์โพลารอยด์ */}
            <div className="text-center font-mali">
              <p className="text-sm font-bold text-slate-800">
                {coupleName || 'เรา & เธอ'} 💖
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                ความทรงจำใต้แสงจันทร์วันลอยกระทง
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
