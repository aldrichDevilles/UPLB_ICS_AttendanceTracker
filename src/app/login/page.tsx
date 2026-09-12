"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [id, setId] = useState(""); const [role, setRole] = useState<"student" | "lecturer">("student"); const [error, setError] = useState(""); const router = useRouter();
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError("");
    const result = await signIn("credentials", { id, role, redirect: false });
    if (result?.error) { setError("Sign-in failed. Check your ID."); return; }
    router.push(role === "lecturer" ? "/lecturer/session" : "/scan");
  }
  return <main><h1>Sign in</h1><form className="card" onSubmit={submit}><label htmlFor="id">University ID</label><input id="id" required value={id} onChange={(e) => setId(e.target.value)} /><label htmlFor="role">I am a</label><select id="role" value={role} onChange={(e) => setRole(e.target.value as "student" | "lecturer")}><option value="student">Student</option><option value="lecturer">Lecturer</option></select><p><button type="submit">Continue</button></p>{error && <p className="warning">{error}</p>}</form></main>;
}
