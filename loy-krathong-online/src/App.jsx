import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CONFIG } from './config'
import { useAudio } from './hooks/useAudio'
import SceneBackground from './components/SceneBackground'
import MusicButton from './components/MusicButton'
import PasscodeGate from './components/PasscodeGate'
import LandingOverlay from './components/LandingOverlay'
import WishForm from './components/WishForm'
import FloatingKrathong from './components/FloatingKrathong'
import SurpriseCard from './components/SurpriseCard'
import PhotoSlideshow from './components/PhotoSlideshow'

/**
 * App: State Machine หลักของเว็บแอป
 * - stage: "gate" -> "landing" -> "craft" -> "releasing" -> "surprise"
 * - ใน stage "surprise": สลับระหว่าง 'letter' (จดหมาย), 'slideshow' (สไลด์โชว์โพลารอยด์) และ 'floating' (ชมกระทงลอยน้ำ)
 * - ควบคุมการเปลี่ยนผ่านฉากด้วย Framer Motion AnimatePresence
 */
export default function App() {
  // State Machine สำหรับสถานะหน้า (เริ่มต้นที่ "gate" ถ้าเปิดใช้งาน gateEnabled)
  const [stage, setStage] = useState(CONFIG.gateEnabled ? 'gate' : 'landing')

  // ข้อมูลกระทงและคำอธิษฐาน
  const [selectedVariant, setSelectedVariant] = useState('banana')
  const [coupleName] = useState(CONFIG.defaultCoupleName)
  const [wish, setWish] = useState('')
  const [activeWish, setActiveWish] = useState('')

  // จัดการระบบเสียง
  const { isPlaying, isMuted, isAvailable, playAudio, toggleMute } = useAudio()

  // จัดการมุมมองใน stage "surprise": 'letter' | 'slideshow' | 'floating'
  const [surpriseView, setSurpriseView] = useState('letter')
  const [loadedPhotos, setLoadedPhotos] = useState([])

  // 1. ปลดล็อกรหัสผ่านสำเร็จ (Gate -> Landing)
  const handleGateSuccess = () => {
    setStage('landing')
  }

  // 2. กดเริ่มจากหน้าแรก (Landing -> Craft)
  const handleStart = () => {
    // เรียกคำสั่งเล่นเพลงใน event handler ของการแตะโดยตรง เพื่อให้ผ่าน autoplay policy
    playAudio()
    setStage('craft')
  }

  // 3. ปล่อยกระทงลงน้ำ (Craft -> Releasing -> Surprise)
  const handleRelease = (finalWish) => {
    setActiveWish(finalWish)
    setStage('releasing')

    // รอครบ surpriseDelayMs (ค่าเริ่มต้น 3 วินาที) แล้วเข้าสู่โหมดเซอร์ไพรส์
    setTimeout(() => {
      setSurpriseView('letter')
      setStage('surprise')
    }, CONFIG.surpriseDelayMs)
  }

  // 4. ลอยกระทงอีกอัน (Surprise -> Craft) โดยคงชื่อคู่ไว้
  const handleReset = () => {
    setWish('')
    setSurpriseView('letter')
    setStage('craft')
  }

  // 5. Preload รูปภาพทั้งหมดตั้งแต่เริ่มเข้าสู่ stage "surprise"
  useEffect(() => {
    if (stage !== 'surprise') return
    let isCancelled = false

    const rawList = Array.isArray(CONFIG.photos) ? CONFIG.photos : []
    if (rawList.length === 0) {
      setLoadedPhotos([])
      return
    }

    const preloadImg = (item) =>
      new Promise((resolve) => {
        const img = new Image()
        img.src = item.src
        img.onload = () => resolve(item)
        img.onerror = () => resolve(null)
      })

    Promise.all(rawList.map(preloadImg)).then((results) => {
      if (!isCancelled) {
        const valid = results.filter(Boolean)
        setLoadedPhotos(valid)
      }
    })

    return () => {
      isCancelled = true
    }
  }, [stage])

  return (
    <main className="relative w-full h-[100dvh] overflow-hidden bg-night-900 select-none">
      {/* 1. Canvas ฉากหลังเต็มจอ (ท้องฟ้า ดาว พระจันทร์ โคมลอย ผิวน้ำ) */}
      <SceneBackground />

      {/* 2. ปุ่มควบคุมเสียงเพลงที่มุมขวาบน */}
      <MusicButton
        isPlaying={isPlaying}
        isMuted={isMuted}
        isAvailable={isAvailable}
        onToggle={toggleMute}
      />

      {/* 3. การเปลี่ยนผ่านแต่ละ Stage ด้วย AnimatePresence */}
      <AnimatePresence mode="wait">
        {stage === 'gate' && (
          <PasscodeGate key="gate" onSuccess={handleGateSuccess} />
        )}

        {stage === 'landing' && (
          <LandingOverlay key="landing" onStart={handleStart} />
        )}

        {stage === 'craft' && (
          <WishForm
            key="craft"
            coupleName={coupleName}
            wish={wish}
            setWish={setWish}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
            onSubmit={handleRelease}
          />
        )}
      </AnimatePresence>

      {/* 4. แสดงกระทงลอยน้ำในระยะ Releasing และ Surprise */}
      {(stage === 'releasing' || stage === 'surprise') && (
        <FloatingKrathong
          variant={selectedVariant}
          coupleName={coupleName}
          wish={stage === 'releasing' ? activeWish : ''}
        />
      )}

      {/* 5. ส่วนเซอร์ไพรส์ (จดหมาย, Photo Slideshow, และ ชมกระทงลอยน้ำ) */}
      <AnimatePresence mode="wait">
        {stage === 'surprise' && surpriseView === 'letter' && (
          <SurpriseCard
            key="surprise-card"
            coupleName={coupleName}
            hasPhotos={loadedPhotos.length > 0}
            onReset={handleReset}
            onOpenPhoto={() => setSurpriseView('slideshow')}
            onTransitionToSlideshow={() => setSurpriseView('slideshow')}
            skipIntro={false}
          />
        )}

        {stage === 'surprise' && surpriseView === 'slideshow' && loadedPhotos.length > 0 && (
          <PhotoSlideshow
            key="photo-slideshow"
            photos={loadedPhotos}
            onBackToLetter={() => setSurpriseView('letter')}
            onReset={handleReset}
            onViewKrathong={() => setSurpriseView('floating')}
          />
        )}

        {/* 6. มุมมองชื่นชมกระทงที่ลอยไปแล้วอย่างสงบ พร้อมแถบนำทางด้านล่าง */}
        {stage === 'surprise' && surpriseView === 'floating' && (
          <motion.div
            key="floating-view-toolbar"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-6 left-0 right-0 z-40 max-w-sm mx-auto px-4 flex items-center space-x-2"
          >
            {loadedPhotos.length > 0 && (
              <button
                type="button"
                onClick={() => setSurpriseView('slideshow')}
                className="flex-1 h-12 rounded-2xl glass-card text-cream-100 font-mali font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 border border-gold/40 shadow-lg active:scale-95 transition-transform"
                aria-label="ดูภาพความทรงจำ"
              >
                <span>📸</span>
                <span>ดูรูปภาพ</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setSurpriseView('letter')}
              className="flex-1 h-12 rounded-2xl glass-card text-cream-100 font-mali font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 border border-white/30 shadow-lg active:scale-95 transition-transform"
              aria-label="อ่านจดหมาย"
            >
              <span>💌</span>
              <span>อ่านจดหมาย</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-gold-dark via-gold to-gold-light text-night-900 font-mali font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-glow-gold active:scale-95 transition-transform"
              aria-label="ลอยกระทงอีกอัน"
            >
              <span>🪷</span>
              <span>ลอยอีกอัน</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
