## PR: Make downloads robust — yt-dlp resolution, resume, and health

This pull request adds several improvements to make the downloader robust and production-ready:

- Use yt-dlp to resolve playable media URLs and stream them directly, with format preferences (4K where requested).
- Forward Range headers so downloads support resume (206 Partial Content), and forward upstream Content-Range/Accept-Ranges headers.
- Retry upstream fetches with exponential backoff for transient errors.
- Pass Cookie header to yt-dlp and upstream requests to support restricted/private content when client provides cookies.
- Add a /api/health endpoint that reports whether yt-dlp is installed and its version.
- Add CI workflow (.github/workflows/ci.yml) that installs yt-dlp in the runner, installs dependencies, builds and runs tests/lint.

Operational notes
- Production servers must have yt-dlp installed and allow spawning child processes.
- Some content may require additional cookies/headers or may be blocked; provide cookies in the request if needed.

Testing
- Use /api/health to confirm yt-dlp availability in the environment.
- Try downloading a public video (YouTube, TikTok) with /api/download. Use Range header to test resume.

Signed-off-by: SAGE MADE IT <quophysage@gmail.com>
