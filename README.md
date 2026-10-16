# kishoremuniyasamy.is-a.dev

Personal portfolio of Kishore Muniyasamy — CSE (AI & ML), Sathyabama Institute of Science and Technology.

Plain HTML, CSS, and JavaScript modules. No build step and no runtime dependencies (the animation engine in `js/motion.js` is hand-written), so it deploys to GitHub Pages as-is.

## Edit content

Everything you see on the page — bio, projects, skills, journey, links — lives in **`js/content.js`**.

- **LinkedIn:** set `site.links.linkedin` to your profile URL (the button appears automatically).
- **Project screenshots:** save an image as `assets/projects/kestrel.webp` (or `mint.webp`) and set that project's `image` field to the path. It replaces the animated visual.
- **Resume:** replace `assets/Kishore_Muniyasamy_CV.pdf`, keeping the same file name.

## Run locally

ES modules need a server (opening `index.html` directly won't work):

```bash
python -m http.server 5510
```

Then open http://localhost:5510.

## Deploy (GitHub Pages + is-a.dev)

1. Create a GitHub repo (for example `KishoreXO/portfolio`) and push this folder to `main`.
2. Repo **Settings → Pages**: Source = *Deploy from a branch*, Branch = `main` / root.
3. Register the domain: fork [is-a-dev/register](https://github.com/is-a-dev/register), add `domains/kishoremuniyasamy.json`:

   ```json
   {
     "owner": { "username": "KishoreXO", "email": "kishoremuniyasamy4@gmail.com" },
     "records": { "CNAME": "kishorexo.github.io" }
   }
   ```

   and open a pull request. Check their README for the current format before submitting.
4. Once merged, **Settings → Pages → Custom domain** = `kishoremuniyasamy.is-a.dev` (the `CNAME` file here already says this), then tick **Enforce HTTPS**.

## Structure

```
index.html          markup and meta tags
css/style.css       design tokens, layout, responsive rules
js/content.js       all text content
js/main.js          rendering, intro, scroll animations, nav
js/motion.js        smooth scroll, tweens, scroll-scrub, reveals
js/neural.js        interactive neural-network hero background
js/text-fx.js       name split and role scramble effects
js/cursor.js        custom cursor and magnetic buttons
js/project-viz.js   animated Kestrel and Mint visuals
```

Respects `prefers-reduced-motion`; custom cursor and smooth wheel scrolling are desktop-only.
