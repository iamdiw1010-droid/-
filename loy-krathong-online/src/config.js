/**
 * ค่าตั้งต้นและการตั้งค่าทั้งหมดของเว็บแอป
 * ผู้ใช้สามารถปรับเปลี่ยนข้อความและไฟล์ได้ที่นี่
 */
export const CONFIG = {
  // ด่านรหัสผ่านวันครบรอบ (Passcode Gate)
  gateEnabled: true,
  gateQuestion: "วันครบรอบของเราคือวันไหนนะ?",
  gateHint: "คำใบ้: วันแรกที่เราเริ่มต้นด้วยกัน ✨",
  gateAnswerDay: 25,
  gateAnswerMonth: 3,
  gateAnswerYearBE: 2568,
  gateSuccessText: "ถูกต้องลยยยยครับ 💛",
  gateMaxAttemptsBeforeHint: 2,

  // ข้อความทักทายหน้าแรก
  greeting: "สุขสันต์วันลอยกระทง ✨\nเป็นวันที่เราไปเดทกันครั้งแรกที่สวนรถไฟที่กรุงเทพ",
  
  // ข้อความบนปุ่มเริ่มต้น
  startButton: "แตะเพื่อเริ่มลอยกระทง",
  
  // ชื่อคู่รัก (กำหนดเป็น ดิว & จินนี่ โดยไม่ต้องกรอกเอง)
  defaultCoupleName: "ดิว & จินนี่",
  
  // ข้อความหวานๆ ในจดหมายเซอร์ไพรส์ (รองรับการขึ้นบรรทัดใหม่ \n)
  surpriseMessage: "ขอบคุณที่เป็นความสุขของเค้าในทุกๆวันนะ\nขอให้ทุกคำอวยพรสมปราถนา\nไว้จะพาไปเที่ยวบ่อยๆอีก รักนะ ❤️",
  
  // รายการรูปภาพสำหรับ Photo Slideshow (ลบคำบรรยายใต้ภาพออกแล้ว)
  photos: [
    { src: "/photos/1.jpg", caption: "" },
    { src: "/photos/2.jpg", caption: "" },
    { src: "/photos/3.jpg", caption: "" },
    { src: "/photos/4.jpg", caption: "" },
    { src: "/photos/5.jpg", caption: "" },
  ],
  slideshowIntervalMs: 4500,
  slideshowTitle: "ภาพความทรงจำของเรา",

  // เส้นทางไฟล์เพลงใน public/
  musicSrc: "/music.mp3",
  musicVolume: 0.4,
  
  // ระยะเวลารอ (มิลลิวินาที) ก่อนโคมเซอร์ไพรส์ลอยขึ้นมา (3 วินาที)
  surpriseDelayMs: 3000,
}
