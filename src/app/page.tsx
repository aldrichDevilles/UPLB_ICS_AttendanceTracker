import Link from "next/link";
export default function Home() { return <main><h1>ICS Attendance</h1><p>Reliable classroom check-ins, even when the connection drops.</p><p><Link href="/login">Sign in</Link> · <Link href="/scan">Scan attendance</Link> · <Link href="/lecturer/session">Lecturer session</Link></p></main>; }
