import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import convert from 'heic-convert'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const RAW_DIR = path.join(rootDir, 'photos-raw')
const OUT_DIR = path.join(rootDir, 'public', 'photos')
const CAPTIONS_FILE = path.join(RAW_DIR, 'captions.json')
const MANIFEST_FILE = path.join(OUT_DIR, 'manifest.json')

const ALLOWED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'])

/**
 * ดึงวันที่ถ่ายรูปจาก EXIF Buffer (ถ้ามี) หรือใช้เวลาแก้ไขไฟล์
 */
function getPhotoDate(filePath, exifBuffer, fileStat) {
  if (exifBuffer && Buffer.isBuffer(exifBuffer)) {
    try {
      const exifStr = exifBuffer.toString('binary')
      // ค้นหาแพทเทิร์นวันเวลา EXIF: YYYY:MM:DD HH:MM:SS
      const match = exifStr.match(/(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/)
      if (match) {
        const [, year, month, day, hour, min, sec] = match
        const date = new Date(Date.UTC(+year, +month - 1, +day, +hour, +min, +sec))
        if (!isNaN(date.getTime())) {
          return date.getTime()
        }
      }
    } catch {
      // ข้ามไปใช้ fileStat
    }
  }
  return fileStat.mtimeMs || fileStat.birthtimeMs || 0
}

/**
 * สคริปต์หลักสำหรับประมวลผลรูปภาพ
 */
async function optimizePhotos() {
  console.log('🌸 [Photo Optimizer] เริ่มต้นระบบเตรียมรูปภาพสำหรับ Photo Slideshow...')

  // 1. ตรวจสอบโฟลเดอร์ต้นทาง
  if (!fs.existsSync(RAW_DIR)) {
    console.log('\nℹ️ ไม่พบโฟลเดอร์ photos-raw/')
    console.log('📌 วิธีใช้: สร้างโฟลเดอร์ photos-raw/ แล้วนำรูปภาพคู่รักมาวาง จากนั้นรัน npm run photos อีกครั้ง\n')
    return
  }

  const rawEntries = fs.readdirSync(RAW_DIR)
  const candidateFiles = rawEntries.filter((file) => {
    const ext = path.extname(file).toLowerCase()
    return ALLOWED_EXTS.has(ext)
  })

  if (candidateFiles.length === 0) {
    console.log('\nℹ️ ไม่พบรูปภาพที่รองรับในโฟลเดอร์ photos-raw/')
    console.log('📌 รองรับนามสกุล: jpg, jpeg, png, webp, heic, heif')
    console.log('📌 นำรูปภาพมาวางใน photos-raw/ แล้วรัน npm run photos อีกครั้ง\n')
    return
  }

  // โหลดแคปชันต้นฉบับถ้ามี
  let captionsMap = {}
  if (fs.existsSync(CAPTIONS_FILE)) {
    try {
      captionsMap = JSON.parse(fs.readFileSync(CAPTIONS_FILE, 'utf-8'))
    } catch (err) {
      console.warn('⚠️ ไม่สามารถอ่านไฟล์ captions.json ได้:', err.message)
    }
  }

  // 2. อ่านข้อมูลเบื้องต้นและวันที่เพื่อเรียงลำดับ
  console.log(`📸 พบไฟล์รูปภาพทั้งหมด ${candidateFiles.length} รูป กำลังตรวจสอบข้อมูลและเรียงลำดับ...`)

  const parsedList = []
  const skippedFiles = []
  let totalRawBytes = 0

  for (const fileName of candidateFiles) {
    const filePath = path.join(RAW_DIR, fileName)
    try {
      const stat = fs.statSync(filePath)
      totalRawBytes += stat.size
      const ext = path.extname(fileName).toLowerCase()

      let date = stat.mtimeMs
      let exifBuffer = null

      // ลองอ่าน EXIF สำหรับ jpg/jpeg/webp
      if (['.jpg', '.jpeg', '.webp'].includes(ext)) {
        try {
          const meta = await sharp(filePath).metadata()
          exifBuffer = meta.exif
        } catch {
          // ใช้ stat ปกติ
        }
      }
      date = getPhotoDate(filePath, exifBuffer, stat)

      parsedList.push({
        fileName,
        filePath,
        ext,
        date,
        rawSize: stat.size,
      })
    } catch (err) {
      skippedFiles.push({ fileName, reason: err.message })
    }
  }

  // เรียงลำดับตามวันที่ถ่าย (เก่าไปใหม่)
  parsedList.sort((a, b) => a.date - b.date)

  // 3. ล้างโฟลเดอร์ปลายทาง public/photos/
  if (fs.existsSync(OUT_DIR)) {
    fs.rmSync(OUT_DIR, { recursive: true, force: true })
  }
  fs.mkdirSync(OUT_DIR, { recursive: true })

  // 4. ประมวลผลทีละไม่เกิน 4 รูปพร้อมกัน (Concurrency Limit: 4)
  const CONCURRENCY = 4
  const manifestPhotos = []
  let totalOptimizedBytes = 0
  let processedCount = 0

  async function processItem(item, index) {
    const { fileName, filePath, ext } = item
    const targetName = `p${String(index + 1).padStart(2, '0')}.webp`
    const targetPath = path.join(OUT_DIR, targetName)

    try {
      let inputBuffer = fs.readFileSync(filePath)

      // ถ้าเป็น HEIC/HEIF ให้แปลงเป็น JPEG ก่อนส่งให้ sharp
      if (ext === '.heic' || ext === '.heif') {
        try {
          inputBuffer = await convert({
            buffer: inputBuffer,
            format: 'JPEG',
            quality: 1,
          })
        } catch (convErr) {
          throw new Error(`แปลงไฟล์ HEIC ล้มเหลว: ${convErr.message}`)
        }
      }

      // ปรับขนาดรูป หมุนตาม EXIF แปลงเป็น WebP คุณภาพ 78 ลบ Metadata/GPS
      const image = sharp(inputBuffer).rotate() // auto-rotate based on EXIF
      const resized = image.resize({
        width: 1280,
        height: 1280,
        fit: 'inside',
        withoutEnlargement: true,
      }).webp({ quality: 78 })

      const { data, info } = await resized.toBuffer({ resolveWithObject: true })
      fs.writeFileSync(targetPath, data)

      totalOptimizedBytes += info.size
      processedCount++

      const caption = captionsMap[fileName] || ''
      manifestPhotos.push({
        index,
        src: `/photos/${targetName}`,
        w: info.width,
        h: info.height,
        caption,
      })

      console.log(`  [${processedCount}/${parsedList.length}] ✓ ${fileName} -> ${targetName} (${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB)`)
    } catch (err) {
      skippedFiles.push({ fileName, reason: err.message })
      console.warn(`  ✗ ข้ามไฟล์ ${fileName}: ${err.message}`)
    }
  }

  // ทยอยประมวลผลทีละ 4 รูป
  for (let i = 0; i < parsedList.length; i += CONCURRENCY) {
    const chunk = parsedList.slice(i, i + CONCURRENCY)
    await Promise.all(chunk.map((item, idx) => processItem(item, i + idx)))
  }

  // จัดเรียง manifest ให้ตรงตามลำดับ p01, p02...
  manifestPhotos.sort((a, b) => a.index - b.index)
  const finalPhotos = manifestPhotos.map(({ src, w, h, caption }) => ({
    src,
    w,
    h,
    caption,
  }))

  // 5. บันทึก manifest.json
  fs.writeFileSync(
    MANIFEST_FILE,
    JSON.stringify({ photos: finalPhotos }, null, 2),
    'utf-8'
  )

  // 6. สรุปผล
  console.log('\n=============================================')
  console.log('✨ สรุปการเตรียมรูปภาพ (Optimization Summary)')
  console.log('=============================================')
  console.log(`📁 รูปภาพที่ประมวลผลสำเร็จ: ${finalPhotos.length} รูป`)
  const rawMB = (totalRawBytes / (1024 * 1024)).toFixed(2)
  const optMB = (totalOptimizedBytes / (1024 * 1024)).toFixed(2)
  const savedPercent = totalRawBytes > 0 ? (((totalRawBytes - totalOptimizedBytes) / totalRawBytes) * 100).toFixed(1) : 0
  console.log(`💾 ขนาดรวมก่อนบีบอัด: ${rawMB} MB`)
  console.log(`⚡ ขนาดรวมหลังแปลง WebP: ${optMB} MB (ลดลง ${savedPercent}%)`)

  if (skippedFiles.length > 0) {
    console.log(`\n⚠️ รูปที่ข้ามเพราะอ่านไม่ได้ (${skippedFiles.length} ไฟล์):`)
    skippedFiles.forEach(f => console.log(`  - ${f.fileName}: ${f.reason}`))
  }

  if (finalPhotos.length > 40) {
    console.log(`\n⚠️ แจ้งเตือน: มีรูปภาพทั้งหมด ${finalPhotos.length} รูป (แนะนำให้คัดเลือกเหลือประมาณ 10-25 รูป เพื่อให้โหลดได้รวดเร็วและลื่นไหลที่สุดบนมือถือ)`)
  }

  console.log(`📄 สร้างไฟล์ Manifest แล้วที่: public/photos/manifest.json`)
  console.log('🎉 เสร็จสมบูรณ์ พร้อมเปิดชมใน Photo Slideshow!\n')
}

optimizePhotos().catch((err) => {
  console.error('❌ เกิดข้อผิดพลาดในการประมวลผลรูปภาพ:', err)
  process.exit(1)
})
