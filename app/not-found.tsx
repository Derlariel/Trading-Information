import Link from "next/link";

export default function NotFound() {
  return <div className="not-found"><span>404</span><h1>ไม่พบข้อมูลที่ต้องการ</h1><p>Symbol หรือหน้าที่คุณเปิดอาจไม่มีอยู่ในระบบ</p><Link href="/">กลับหน้าภาพรวม</Link></div>;
}
