# Expert Authentication Package

- Branch: `feature/expert-auth`
- Owner: Farah
- Feature routes: `/expert/login`, `/expert/register`, `/expert/forgot-password`, `/expert/reset-password`, `/expert/verify-email`, `/expert/verify-email/:id/:hash`, and `/expert/email-verified`.
- Feature pages: login, register, forgot password, reset password, email verification, and email verified.
- Shared expert infrastructure: the single `AuthProvider`, `useAuth`, route guards, token manager, API client, and expert authentication service.
- Excluded UI features: landing page, user authentication pages, admin authentication pages, admin dashboard pages, expert dashboard pages, and user dashboard pages.

