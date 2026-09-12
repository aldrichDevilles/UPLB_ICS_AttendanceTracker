import type { Metadata } from "next";
import "./styles.css";
export const metadata: Metadata = { title: "ICS Attendance", description: "Offline classroom attendance", manifest: "/manifest.json" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
