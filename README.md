# ICS Attendance Checker

An offline-first Next.js PWA for classroom check-ins. The scanner stores scans in IndexedDB immediately, then forwards them when the browser regains connectivity.

## Run it

1. Copy `.env.example` to `.env.local` and set a PostgreSQL `DATABASE_URL`, `JWT_SECRET`, and NextAuth values.
2. Install packages with `npm install`.
3. Create the database tables: `npx prisma migrate dev --name init`.
4. Start the app: `npm run dev`.

The sample credentials provider is deliberately a development adapter: it accepts a supplied university ID and role. Replace its `authorize` implementation in `src/lib/auth.ts` with the institution's SSO or directory verification before deployment.

## Security model

- `/api/qr/generate` requires a lecturer session and signs a five-minute, HS256 JWT.
- `/api/sync` requires a student session and takes the student ID from that session, never from the queued record.
- Sync validates the QR signature and its immutable `iat`/`exp` five-minute lifetime without comparing expiry to delayed sync time, then applies a 50 m Haversine geofence.
- API endpoints are `NetworkOnly` in the service-worker configuration; queued records remain in Dexie until the server acknowledges their local IDs.

Because an offline client has no trusted clock or network witness, it cannot cryptographically prove the physical instant a QR was scanned. This implementation therefore verifies the server-issued QR's five-minute display window rather than treating client `scannedAt` as a security assertion; use device-attestation or an online timestamp service if proof of scan time is a deployment requirement.
