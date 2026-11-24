import { useState, useEffect, useRef, useCallback } from 'react'
import { CONFIG } from '../config'

/**
 * Custom Hook สำหรับจัดการระบบเสียงและเพลงประกอบ
 * - รองรับ autoplay policy ของ iOS/Android ผ่าน user gesture
 * - Fade-in ระดับเสียง 1.5 วินาที
 * - หยุดเล่นเมื่อสลับแท็บ และเล่นต่อเมื่อกลับมา
 * - ซ่อนตัวอย่างเงียบๆ เมื่อไม่มีไฟล์เพลงหรือเล่นไม่ได้
 */
export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  
  const audioRef = useRef(null)
  const fadeIntervalRef = useRef(null)
  const wasPlayingRef = useRef(false)

  // สร้าง Audio element เมื่อเริ่มต้น
  useEffect(() => {
    const audio = new Audio(CONFIG.musicSrc)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0
    audioRef.current = audio

    const handleError = () => {
      // หากไม่มีไฟล์เพลง หรือไม่สามารถโหลดได้
      setIsAvailable(false)
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    audio.addEventListener('error', handleError)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('ended', handleEnded)
      audio.pause()
      audio.src = ''
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
    }
  }, [])

  // Fade-in เสียงแบบนุ่มนวล
  const startFadeIn = useCallback((targetVolume, durationMs = 1500) => {
    if (!audioRef.current) return
    const audio = audioRef.current
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)

    const steps = 30
    const stepTime = durationMs / steps
    const stepVolume = targetVolume / steps
    audio.volume = 0

    let currentStep = 0
    fadeIntervalRef.current = setInterval(() => {
      currentStep++
      if (!audioRef.current) {
        clearInterval(fadeIntervalRef.current)
        return
      }
      const nextVolume = Math.min(targetVolume, currentStep * stepVolume)
      audioRef.current.volume = nextVolume

      if (currentStep >= steps) {
        audioRef.current.volume = targetVolume
        clearInterval(fadeIntervalRef.current)
        fadeIntervalRef.current = null
      }
    }, stepTime)
  }, [])

  // ฟังก์ชันเริ่มเล่นเพลง (เรียกโดยตรงจาก user gesture เช่น ปุ่มแตะเริ่ม)
  const playAudio = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.play()
      .then(() => {
        setIsPlaying(true)
        setIsAvailable(true)
        if (!isMuted) {
          startFadeIn(CONFIG.musicVolume, 1500)
        }
      })
      .catch((err) => {
        // หากเล่นไม่ได้หรือไม่มีไฟล์เพลง ให้เงียบและปิดสถานะ
        console.warn('Audio playback not available:', err?.message || err)
        setIsAvailable(false)
        setIsPlaying(false)
      })
  }, [isMuted, startFadeIn])

  // สลับสถานะ Mute / Unmute
  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.muted = false
      audio.volume = CONFIG.musicVolume
      setIsMuted(false)
      if (!isPlaying) {
        audio.play().then(() => setIsPlaying(true)).catch(() => {})
      }
    } else {
      audio.muted = true
      setIsMuted(true)
    }
  }, [isMuted, isPlaying])

  // จัดการ visibilitychange: หยุดเมื่อแท็บซ่อน และเล่นต่อเมื่อกลับมา
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current
      if (!audio) return

      if (document.hidden) {
        wasPlayingRef.current = !audio.paused && !audio.muted
        if (wasPlayingRef.current) {
          audio.pause()
          setIsPlaying(false)
        }
      } else {
        if (wasPlayingRef.current && !isMuted) {
          audio.play()
            .then(() => {
              setIsPlaying(true)
            })
            .catch(() => {})
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isMuted])

  return {
    isPlaying,
    isMuted,
    isAvailable,
    playAudio,
    toggleMute,
  }
}
