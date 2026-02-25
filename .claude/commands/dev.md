---
description: Start the development server and open it in a browser
---

Please start the development server by following these steps:

1. Ensure you have all dependencies installed by running `npm install` if you haven't done so already.
2. Check for and kill any processes on port 3000 using `lsof -ti:3000 | xargs kill -9` (or `npx kill-port 3000` if available).
3. Run `npm run dev` in the background to start the Next.js development server.
4. Wait for the server to start successfully (look for "Ready" or "Compiled successfully" in the output).
5. Open the development server URL (http://localhost:3000) in the default browser.

If the server fails to start:
- Check if port 3000 is still in use
- Verify environment variables are set (.env.local)
- Check for build/compilation errors in the output

Keep the server running so the user can see their changes live.