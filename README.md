# nwhator.github.io — Publishing & Game

This repository is a GitHub Pages user site. The `docs/` folder now contains a Tetris game at `docs/tetris/index.html` (the project was moved to the `/tetris` path).

What I changed for you

- Backed up the existing `CNAME` to `CNAME.bak` (it contained `stormyhub.me`) and removed the active `CNAME` so GitHub Pages will use the GitHub domain by default.
- Created a minimal Astro scaffold (builds to `docs/`) and copied the game into `public/tetris` so it will be available at `/tetris` after building. I also copied the game into `docs/tetris` so the site will serve from `docs/` immediately.
- Improved the Tetris game with: next-piece preview, pause/resume, high-DPI scaling, a bag-based piece generator (better randomness), and basic touch controls.

Where the game will be available

- If you publish the repo as a GitHub Pages user site (default behaviour for `nwhator.github.io`), the game will be available at:

  https://nwhator.github.io/tetris/

If you intended to use a custom domain (`stormyhub.me`) restore the `CNAME` by renaming `CNAME.bak` back to `CNAME` and ensure your DNS is configured to point to GitHub Pages.

How to publish (GitHub Pages settings)

1. On GitHub, open this repository's Settings → Pages.
2. Under "Build and deployment" / "Source" choose:
   - Branch: `main`
   - Folder: `/docs`
3. Save. GitHub will queue a deployment; after a minute the site should become available.

Local testing
You can serve the `docs` folder locally to test the game in a browser (I started a server in the workspace already):

```bash
python -m http.server 8000 --directory docs
# then open http://localhost:8000/tetris
```

Astro dev & build (optional)
If you want to use the Astro scaffold I added, install and run it locally:

```bash
npm install
npm run dev    # starts dev server (hot reload) — visit http://localhost:3000/tetris
npm run build  # builds to ./docs ready for GitHub Pages
```

If you want me to push these changes (create a commit and push to `main`) I can do that for you — tell me and I'll create a clean commit message.

How to restore the custom domain (if you changed your mind)

1. Rename the backup `CNAME.bak` to `CNAME` (or copy its contents into a new `CNAME` file at repo root).
2. Ensure DNS A records and/or ALIAS/ANAME point to GitHub Pages IPs (or follow GitHub's custom domain docs).
3. In the Pages settings, set the custom domain to `stormyhub.me` and enforce HTTPS when available.

Notes & suggestions

- I copied the live game into both `docs/tetris` (immediate Pages content) and `public/tetris` (Astro source). Edit whichever copy you prefer — I recommend using `public/tetris` if you plan to run the Astro dev workflow.
- Next optional improvements I can add: hold-piece, ghost-piece, sound effects, persistent high scores, or converting the game into an Astro component.

— Changes applied by the workspace assistant
