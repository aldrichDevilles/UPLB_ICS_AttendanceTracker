import jwt from "jsonwebtoken";
import type { QrClaims } from "@/types";
const secret = () => {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error("JWT_SECRET is not configured");
  return value;
};
const TTL_SECONDS = 300;

export function signQrToken(courseId: string, sessionId: string) {
  return jwt.sign({ courseId, sessionId }, secret(), { algorithm: "HS256", expiresIn: TTL_SECONDS });
}

/** Validates server signature and the original five-minute display window, without using sync time. */
export function verifyOfflineQrToken(token: string): QrClaims {
  const claims = jwt.verify(token, secret(), { algorithms: ["HS256"], ignoreExpiration: true }) as QrClaims;
  if (!claims.courseId || !claims.sessionId || !Number.isInteger(claims.iat) || !Number.isInteger(claims.exp) || claims.exp - claims.iat !== TTL_SECONDS) {
    throw new Error("Invalid QR claims");
  }
  return claims;
}
