# nwhator.github.io — Publishing & Game

This repository is a GitHub Pages user site. The `docs/` folder contains a small Tetris game at `docs/game/index.html`.

What I changed for you

- Enhanced the Tetris game with a next-piece preview, pause/resume, high-DPI scaling and mobile touch controls.

Where the game will be available

- If you publish the repo as a GitHub Pages user site (default behaviour for `nwhator.github.io`), the game will be available at:

  <https://nwhator.github.io/game/>

If you intended to use a custom domain (`stormyhub.me`) restore the `CNAME` by renaming `CNAME.bak` back to `CNAME` and ensure your DNS is configured to point to GitHub Pages.

How to publish (GitHub Pages settings)

1. On GitHub, open this repository's Settings → Pages.
2. Under "Build and deployment" / "Source" choose:
   - Branch: `main`
   - Folder: `/docs`
3. Save. GitHub will queue a deployment; after a minute the site should become available.

Local testing
You can serve the `docs` folder locally to test the game in a browser:

```bash
python -m http.server 8000 --directory docs
# then open http://localhost:8000/game
```

If you want me to push these changes (create a commit and push to `main`) I can do that for you — tell me and I'll create a small commit with a useful message.

How to restore the custom domain (if you changed your mind)

1. Rename the backup `CNAME.bak` to `CNAME` (or copy its contents into a new `CNAME` file at repo root).
2. Ensure DNS A records and/or ALIAS/ANAME point to GitHub Pages IPs (or follow GitHub's custom domain docs).
3. In the Pages settings, set the custom domain to `stormyhub.me` and enforce HTTPS when available.

Notes & suggestions

- I started a local server in the workspace so you can preview the game at `http://localhost:8000/game`.
- Next optional improvements I can add: hold-piece, ghost-piece, sound effects, persistent high scores, or a small UI for mobile controls. Pick one and I can implement it.

— Changes applied by the workspace assistant
