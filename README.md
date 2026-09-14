# TBone

Personal site for [tboner.cc](https://tboner.cc) — Roblox concert developer and owner of Vortex Studios.

## Stack

Plain HTML, CSS, and vanilla JavaScript. No framework, no build step, no dependencies. Headings and UI use Josefin Sans and Jost (Google Fonts); body text uses Atkinson Hyperlegible, chosen for reading clarity.

## Structure

- `index.html` — homepage: hero, a short About summary, a preview of recent projects
- `about-me.html` — full about page
- `projects.html` / `projects/*.html` — project index and individual project pages
- `journal.html` / `journal/*.html` — a second, unlisted index in the same format as Projects, linked only from the footer and marked `noindex`
- `contact.html` — contact info and a form (front-end only, not wired to a backend)
- `projects.json` / `journal.json` — data behind the project/journal grids (title, role, stats line, image path)
- `qualities.txt` — phrases used by the homepage typing effect, one per line
- `css/style.css`, `js/script.js` — styling and behavior
- `media/` — images, as `media/profile.jpg` and `media/<projects|journal>/<slug>/<name>.jpg`

## Design

Dark, warm background with no gradients. Photos render as polaroids or taped scrapbook-style photos. Section headings use a small hand-drawn wave mark in place of a straight rule. Soft blurred color shapes ("haze") sit behind key elements for warmth, built from blurred solid shapes rather than CSS gradients.

## Project and journal pages

Each project or journal page is a header (title + a line of stats) followed by any number of content blocks, separated by a small wave mark. A block is media on one side and text on the other:

```html
<div class="press-block">                 <!-- or class="press-block media-right" -->
  <div class="press-media">
    <div class="tape-photo">                     <!-- cropped, taped photo -->
      <span class="tape"></span>
      <img src="../media/projects/slug/name.jpg" alt="...">
    </div>
    <!-- or a polaroid-style photo: -->
    <!-- <div class="polaroid"><div class="shot"><img ...></div></div> -->
    <!-- or a video: -->
    <!-- <video controls src="../media/projects/slug/clip.mp4"></video> -->
  </div>
  <div class="press-text">
    <p>...</p>
  </div>
</div>
```

`.press-block.media-right` flips the layout. Adding `.no-media` to `.press-block` and removing the `.press-media` div gives a text-only block. Blocks can repeat in any order.

Images fall back to a visible placeholder (via `onerror`) until a real file exists at the referenced path, so adding an image is just a matter of saving the file at the right path — no markup changes needed.

## Local development

`fetch()` calls (for `qualities.txt`, `projects.json`, `journal.json`) don't work over `file://`, so the site needs to be served over HTTP:

```
python3 -m http.server 8000
```

## Deployment

Hosted on Cloudflare Pages, deployed automatically on push to `main`.
