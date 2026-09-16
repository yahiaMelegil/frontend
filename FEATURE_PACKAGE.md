# Expert Dashboard Package

- Branch: `feature/expert-dashboard`
- Feature pages found in the source project: expert dashboard home, expert profile, and expert KYC.
- Feature routes: `/expert/dashboard`, `/expert/profile`, and `/expert/kyc`.
- KYC UI: identity evidence, CV, work experience, qualifications, credentials, work samples, payout-readiness state, validation, submission state, and status display.
- KYC persistence in the supplied source is local shared storage through `src/features/kyc/data/kycStore.js`; no expert-dashboard KYC API service exists in the source.
- Shared expert infrastructure: the single `AuthProvider`, `useAuth`, protected route, token manager, API client, expert authentication service, shared dashboard icon/styles, and shared KYC store.
- Excluded UI features: landing page, user authentication pages, admin authentication pages, admin dashboard pages, expert authentication pages, and user dashboard pages.

