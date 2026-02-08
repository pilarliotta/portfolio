# Pilar Liotta Portfolio

Static site for my portfolio. Built with plain HTML/CSS/JS.

## Publish to GitHub Pages

1. Create a new repo on GitHub (e.g., `liottaP`).
2. Initialize and push local files:

```sh
# from the project folder
git init
git add .
git commit -m "Initial site"
git branch -M main
# replace URL with your repo's HTTPS URL
git remote add origin https://github.com/pilarliotta/liottaP.git
git push -u origin main
```

3. Enable Pages:
   - Open your repo → Settings → Pages.
   - Build and deployment: "Deploy from a branch".
   - Branch: `main`; Folder: `/ (root)`.
   - Save.

Your site will publish at:
- https://pilarliotta.github.io/liottaP/
  
If you name the repo `pilarliotta.github.io`, it will publish at the root:
- https://pilarliotta.github.io/

## Optional: Custom domain
- Add a `CNAME` file containing your domain (e.g., `pilarliotta.com`).
- Point DNS `A`/`AAAA` or `CNAME` records to GitHub Pages per docs.

## Troubleshooting
- 404s on images: GitHub is case-sensitive. Ensure paths and filenames match exactly.
- MOV videos: Prefer `mp4`/`webm` for cross‑browser playback.
- Jekyll interference: `.nojekyll` is included to serve assets as-is.

## Update workflow
Make edits → commit → `git push`. Pages redeploys automatically.
