# SolveIt Frontend Shared Base

This base is the common ancestor for every feature branch. It contains the Vite/React entry points, modular route loader, route guards and path catalog, global styles, authentication/session infrastructure, API client, token storage, common authentication UI primitives, shared dashboard icon/styles, the shared KYC store, and the fallback page.

Feature UI pages are intentionally absent. Each feature branch should start from the commit that contains this base and then add one feature overlay.

