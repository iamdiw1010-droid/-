import React from 'react'

/**
 * KrathongSVG: เวกเตอร์กระทงความละเอียดสูง 3 สไตล์
 * - variant: "banana" (ใบตองคลาสสิก) | "lotus" (ดอกบัวชมพู) | "pastel" (มินิมอลพาสเทล)
 * - viewBox เดียวกัน (0 0 240 200) เพื่อความเสถียรของเลย์เอาต์
 * - มีเปลวเทียนกะพริบด้วย CSS flicker และแสงเรือง drop-shadow สีทอง
 */
export default function KrathongSVG({ variant = 'banana', className = 'w-full h-auto', style = {} }) {
  return (
    <svg
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      role="img"
      aria-label={`กระทงแบบ ${variant}`}
    >
      <defs>
        {/* แสงเรืองของเปลวไฟ */}
        <filter id="candle-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Gradient เปลวไฟ */}
        <linearGradient id="flame-grad" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="#ff5722" />
          <stop offset="45%" stopColor="#ffb300" />
          <stop offset="90%" stopColor="#fff9c4" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>

        <linearGradient id="inner-flame-grad" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="#ffca28" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>

        {/* Gradient เทียน */}
        <linearGradient id="candle-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffe58f" />
          <stop offset="50%" stopColor="#fffbe6" />
          <stop offset="100%" stopColor="#ffd666" />
        </linearGradient>

        {/* Gradient ฐานหยวกกล้วย */}
        <linearGradient id="banana-base-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8bc34a" />
          <stop offset="50%" stopColor="#689f38" />
          <stop offset="100%" stopColor="#33691e" />
        </linearGradient>

        {/* Gradient ใบตองเขียวสด */}
        <linearGradient id="leaf-grad-front" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#aed581" />
          <stop offset="60%" stopColor="#558b2f" />
          <stop offset="100%" stopColor="#2e7d32" />
        </linearGradient>

        <linearGradient id="leaf-grad-back" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#7cb342" />
          <stop offset="100%" stopColor="#1b5e20" />
        </linearGradient>

        {/* Gradient กลีบบัวชมพู */}
        <linearGradient id="lotus-petal-1" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#ff80ab" />
          <stop offset="100%" stopColor="#c2185b" />
        </linearGradient>

        <linearGradient id="lotus-petal-2" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#ffcdd2" />
          <stop offset="60%" stopColor="#f06292" />
          <stop offset="100%" stopColor="#880e4f" />
        </linearGradient>

        {/* Gradient พาสเทลมินิมอล */}
        <linearGradient id="pastel-petal-lavender" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3e8ff" />
          <stop offset="60%" stopColor="#d8b4fe" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>

        <linearGradient id="pastel-petal-pink" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdf2f8" />
          <stop offset="60%" stopColor="#fbcfe8" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>

        <linearGradient id="pastel-petal-blue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0f9ff" />
          <stop offset="60%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        <linearGradient id="pastel-base-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffdfa" />
          <stop offset="50%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
      </defs>

      {/* 1. ส่วนธูปและเทียน (ตำแหน่งกึ่งกลาง) */}
      <g id="incense-and-candle">
        {/* ธูป 3 ดอก */}
        <path d="M109 110 L104 65" stroke="#8d6e63" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="104" cy="65" r="1.8" fill="#ff5722" className="animate-pulse" />

        <path d="M115 110 L115 60" stroke="#795548" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="115" cy="60" r="1.8" fill="#ff7043" className="animate-pulse" />

        <path d="M121 110 L126 67" stroke="#8d6e63" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="126" cy="67" r="1.8" fill="#ff5722" className="animate-pulse" />

        {/* ตัวเทียนสีทองนวล */}
        <rect x="115" y="76" width="10" height="42" rx="3" fill="url(#candle-grad)" stroke="#d4b106" strokeWidth="0.8" />
        {/* ไส้เทียน */}
        <path d="M120 76 L120 68" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" />

        {/* เปลวเทียนกระพริบ (Flickering Flame) */}
        <g className="animate-flicker" style={{ transformOrigin: '120px 68px' }}>
          {/* แสงเรืองของเปลวเทียน */}
          <ellipse cx="120" cy="56" rx="16" ry="20" fill="rgba(255, 200, 70, 0.25)" filter="url(#candle-glow)" />

          {/* เปลวไฟชั้นนอกทรงหยดน้ำ */}
          <path
            d="M120 40 C114 50 110 58 113 65 C116 71 124 71 127 65 C130 58 126 50 120 40 Z"
            fill="url(#flame-grad)"
          />
          {/* เปลวไฟแกนในสีขาวสว่าง */}
          <path
            d="M120 48 C117 54 114 59 116 64 C118 68 122 68 124 64 C126 59 123 54 120 48 Z"
            fill="url(#inner-flame-grad)"
          />
        </g>
      </g>

      {/* 2. ตัวกระทงตามแต่ละสไตล์ */}

      {/* --- สไตล์ BANANA: กระทงใบตองคลาสสิก --- */}
      {variant === 'banana' && (
        <g id="krathong-banana">
          {/* ชั้นใบตองด้านหลังพับยอดแหลม */}
          <g fill="url(#leaf-grad-back)">
            {/* กลีบซ้ายไกล */}
            <path d="M42 135 C35 115 48 95 62 105 C75 115 72 135 62 145 Z" />
            <path d="M68 125 C62 100 80 82 96 95 C108 106 102 128 88 138 Z" />
            {/* กลีบขวาไกล */}
            <path d="M198 135 C205 115 192 95 178 105 C165 115 168 135 178 145 Z" />
            <path d="M172 125 C178 100 160 82 144 95 C132 106 138 128 152 138 Z" />
          </g>

          {/* ดอกดาวเรืองและดอกไม้ประดับรอบเทียน */}
          <g id="banana-flowers">
            {/* ดอกดาวเรืองซ้าย */}
            <circle cx="85" cy="118" r="14" fill="#ffa000" />
            <circle cx="85" cy="118" r="10" fill="#ffd54f" />
            <circle cx="85" cy="118" r="5" fill="#fff" opacity="0.6" />

            {/* ดอกดาวเรืองขวา */}
            <circle cx="155" cy="118" r="14" fill="#ffa000" />
            <circle cx="155" cy="118" r="10" fill="#ffd54f" />
            <circle cx="155" cy="118" r="5" fill="#fff" opacity="0.6" />

            {/* ดอกกล้วยไม้/บานไม่รู้โรยสีชมพูตรงกลาง */}
            <circle cx="102" cy="126" r="8" fill="#e91e63" />
            <circle cx="102" cy="126" r="4" fill="#f48fb1" />
            <circle cx="138" cy="126" r="8" fill="#e91e63" />
            <circle cx="138" cy="126" r="4" fill="#f48fb1" />
            <circle cx="120" cy="132" r="7" fill="#ffb300" />
          </g>

          {/* ฐานหยวกกล้วย */}
          <ellipse cx="120" cy="162" rx="88" ry="24" fill="url(#banana-base-grad)" stroke="#2e7d32" strokeWidth="2" />
          {/* ลายเนื้อหยวกกล้วย */}
          <ellipse cx="120" cy="158" rx="80" ry="18" fill="#7cb342" opacity="0.5" />

          {/* ชั้นกลีบกระทงใบตองพับจีบด้านหน้าซ้อนเรียงสวยงาม */}
          <g fill="url(#leaf-grad-front)" stroke="#1b5e20" strokeWidth="1.2">
            {/* กลีบที่ 1 (ซ้ายสุด) */}
            <path d="M36 150 C30 130 52 118 68 132 C78 142 66 160 48 162 Z" />
            {/* กลีบที่ 2 */}
            <path d="M60 148 C56 122 82 112 96 130 C104 144 88 165 72 166 Z" />
            {/* กลีบที่ 3 (ซ้ายกลาง) */}
            <path d="M88 146 C86 118 114 112 122 134 C126 150 110 168 96 168 Z" />
            {/* กลีบที่ 4 (ขวากลาง) */}
            <path d="M152 146 C154 118 126 112 118 134 C114 150 130 168 144 168 Z" />
            {/* กลีบที่ 5 */}
            <path d="M180 148 C184 122 158 112 144 130 C136 144 152 165 168 166 Z" />
            {/* กลีบที่ 6 (ขวาสุด) */}
            <path d="M204 150 C210 130 188 118 172 132 C162 142 174 160 192 162 Z" />
          </g>

          {/* หมุดปักกลีบใบตองสีทองเล็กๆ */}
          <g fill="#ffe082" stroke="#ff8f00" strokeWidth="0.8">
            <circle cx="56" cy="155" r="2.2" />
            <circle cx="82" cy="158" r="2.2" />
            <circle cx="108" cy="160" r="2.2" />
            <circle cx="132" cy="160" r="2.2" />
            <circle cx="158" cy="158" r="2.2" />
            <circle cx="184" cy="155" r="2.2" />
          </g>
        </g>
      )}

      {/* --- สไตล์ LOTUS: กระทงดอกบัวสีชมพูไล่เฉด --- */}
      {variant === 'lotus' && (
        <g id="krathong-lotus">
          {/* กลีบบัวชั้นหลัง (สีเข้ม) */}
          <g fill="url(#lotus-petal-2)" stroke="#ad1457" strokeWidth="1">
            <path d="M48 130 C45 95 75 75 92 98 C98 108 85 136 68 142 Z" />
            <path d="M80 115 C82 82 112 65 120 90 C125 106 108 130 96 138 Z" />
            <path d="M192 130 C195 95 165 75 148 98 C142 108 155 136 172 142 Z" />
            <path d="M160 115 C158 82 128 65 120 90 C115 106 132 130 144 138 Z" />
          </g>

          {/* เกสรบัวสีเหลืองทองตรงกลาง */}
          <ellipse cx="120" cy="132" rx="36" ry="12" fill="#ffd54f" stroke="#ff8f00" strokeWidth="1.2" />
          <g fill="#ff6f00">
            <circle cx="105" cy="130" r="2" />
            <circle cx="115" cy="132" r="2" />
            <circle cx="125" cy="131" r="2" />
            <circle cx="135" cy="130" r="2" />
            <circle cx="110" cy="134" r="1.8" />
            <circle cx="120" cy="135" r="1.8" />
            <circle cx="130" cy="134" r="1.8" />
          </g>

          {/* ฐานรองกลีบเลี้ยงสีเขียว */}
          <ellipse cx="120" cy="168" rx="86" ry="18" fill="#388e3c" stroke="#1b5e20" strokeWidth="1.5" />
          <path d="M38 165 C70 178 170 178 202 165 C185 182 55 182 38 165 Z" fill="#2e7d32" />

          {/* กลีบบัวชั้นกลางและหน้า (ไล่เฉดขาว-ชมพูระเรื่อ) */}
          <g fill="url(#lotus-petal-1)" stroke="#d81b60" strokeWidth="1.2">
            {/* กลีบซ้าย 1 */}
            <path d="M38 152 C32 125 60 108 80 128 C92 142 75 162 55 164 Z" />
            {/* กลีบซ้าย 2 */}
            <path d="M66 148 C65 116 98 100 112 124 C120 140 102 164 84 166 Z" />
            {/* กลีบกลาง */}
            <path d="M96 146 C102 110 138 110 144 146 C136 166 104 166 96 146 Z" />
            {/* กลีบขวา 2 */}
            <path d="M174 148 C175 116 142 100 128 124 C120 140 138 164 156 166 Z" />
            {/* กลีบขวา 1 */}
            <path d="M202 152 C208 125 180 108 160 128 C148 142 165 162 185 164 Z" />
          </g>

          {/* หยดน้ำค้างใสบนกลีบบัว */}
          <ellipse cx="108" cy="144" rx="2.5" ry="3.5" fill="#ffffff" opacity="0.85" />
          <ellipse cx="140" cy="150" rx="2" ry="3" fill="#ffffff" opacity="0.85" />
        </g>
      )}

      {/* --- สไตล์ PASTEL: กระทงมินิมอลพาสเทลโรแมนติก --- */}
      {variant === 'pastel' && (
        <g id="krathong-pastel">
          {/* กลีบหลังสีฟ้าอ่อนและม่วงพาสเทล */}
          <g stroke="#ffffff" strokeWidth="1.5">
            <path d="M54 132 C48 100 78 88 94 110 C104 124 90 145 74 148 Z" fill="url(#pastel-petal-blue)" />
            <path d="M186 132 C192 100 162 88 146 110 C136 124 150 145 166 148 Z" fill="url(#pastel-petal-blue)" />
            <path d="M88 122 C88 92 120 78 126 106 C130 124 114 146 98 148 Z" fill="url(#pastel-petal-lavender)" />
            <path d="M152 122 C152 92 120 78 114 106 C110 124 126 146 142 148 Z" fill="url(#pastel-petal-lavender)" />
          </g>

          {/* ฐานทรงกลมเรขาคณิตสีครีมนวล */}
          <ellipse cx="120" cy="166" rx="84" ry="20" fill="url(#pastel-base-grad)" stroke="#fed7aa" strokeWidth="2" />
          <ellipse cx="120" cy="163" rx="76" ry="14" fill="#fff" opacity="0.4" />

          {/* กลีบเรขาคณิตโค้งมนเรียบสีชมพูและลาเวนเดอร์ด้านหน้า */}
          <g stroke="#ffffff" strokeWidth="1.8">
            <path d="M42 152 C40 128 68 116 84 136 C95 150 78 166 60 166 Z" fill="url(#pastel-petal-pink)" />
            <path d="M74 148 C76 122 108 112 118 134 C124 148 106 168 88 168 Z" fill="url(#pastel-petal-lavender)" />
            <path d="M102 146 C108 116 132 116 138 146 C134 168 106 168 102 146 Z" fill="url(#pastel-petal-pink)" />
            <path d="M166 148 C164 122 132 112 122 134 C116 148 134 168 152 168 Z" fill="url(#pastel-petal-lavender)" />
            <path d="M198 152 C200 128 172 116 156 136 C145 150 162 166 180 166 Z" fill="url(#pastel-petal-pink)" />
          </g>

          {/* เม็ดมุกประดับรอบฐานกระทงมินิมอล */}
          <g fill="#ffffff" stroke="#e0e7ff" strokeWidth="0.8">
            <circle cx="58" cy="165" r="3.2" />
            <circle cx="86" cy="168" r="3.2" />
            <circle cx="120" cy="170" r="3.6" />
            <circle cx="154" cy="168" r="3.2" />
            <circle cx="182" cy="165" r="3.2" />
          </g>
        </g>
      )}

      {/* 3. แสงสะท้อนสีทองใต้กระทงกระทบผิวน้ำ */}
      <ellipse cx="120" cy="186" rx="70" ry="8" fill="rgba(255, 207, 107, 0.2)" />
    </svg>
  )
}
