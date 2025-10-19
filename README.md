# Profile API with Cat Facts

A simple RESTful API endpoint (`GET /me`) that returns user profile info, current UTC timestamp, and a random cat fact from the Cat Facts API.

## Features
- Dynamic cat fact fetching on every request.
- Error handling for API failures (fallback message).
- TypeScript for type safety.
- Deployed on Railway.

## Local Setup
1. Clone repo: `git clone <your-repo-url>`
2. Install deps: `npm install`
3. Set env vars in `.env` (USER_EMAIL, USER_NAME).
4. Run dev: `npm run dev`
5. Test: `curl http://localhost:3000/me`

## Deployment
- Push to GitHub.
- Connect to [Railway](https://railway.app) or Heroku.
- Set env vars in dashboard.
- Endpoint: `<your-deployed-url>/me`

## Dependencies
- `express`: Web framework.
- `axios` or `node-fetch`: HTTP client (for cat facts).
- Dev: `typescript`, `ts-node`, `@types/*`.

## Tests
Manual: Hit `/me` multiple times—verify timestamp/fact update.
Automated: Add Jest if extending (not required).

## Notes
- No auth/rate limiting (add for prod).
- Logs to console for debugging.