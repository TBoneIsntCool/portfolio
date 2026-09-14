# TBone portfolio

## Structure
- `index.html`: homepage. Hero, then a short "About" summary and a 3-project
  preview (both link out to the full pages), then a footer
- `about-me.html`: full about page, with your bio and photo
- `projects.html`: full project list
- `projects/*.html`: one page per project, written as a small news-article
  layout (see "Adding a new project" below)
- `contact.html`: contact info and a form (not wired to a backend yet)
- `qualities.txt`: one phrase per line, used by the typing effect under your name
- `projects.json`: title, role, a pre-formatted `stats` line, and image path
  for each project card on the homepage and projects page
- `journal.html`: a second, unlisted grid in the same format as Projects,
  for anything you don't want on the main nav. Only reachable from the small
  "journal" link in the footer, and marked `noindex` so it won't turn up in
  search results
- `journal/*.html`, `journal.json`: same system as `projects/*.html` and
  `projects.json`, just pointed at a different folder
- `media/`: put your profile photo here (`profile.jpg`), and project or
  journal images under `media/projects/<slug>/<descriptive-name>.jpg` (e.g.
  `media/projects/vortex-studios/logo-wall.jpg`) or `media/journal/<slug>/...`.
  Name each file after what's actually in it so a folder full of them stays
  readable.
- `css/style.css`, `js/script.js`: styling and behavior

## Theme
Warm dark background (not pure black), no gradients anywhere. Type is Josefin
Sans for most headings and UI, Jost for the big "TBone" on the homepage (a wide,
bold geometric face in the Futura family), and Atkinson Hyperlegible for body
text, a typeface designed specifically for reading clarity. Photos render as
polaroids: a cream mat, a slight rotation, a soft shadow. Section headings get a
small hand-drawn wave mark instead of a straight hairline rule. A few soft,
blurred color blobs ("haze") sit behind key elements for warmth, built from
blurred solid shapes rather than CSS gradients. The homepage is intentionally
just the hero, with a small "scroll" cue leading to a short footer; About,
Projects, and Contact live on their own pages, reachable from the top nav.

Projects render as a small scrapbook: each one gets its own tilted polaroid,
staggered slightly so the grid feels placed rather than mechanically aligned.

## Adding your photo and project images
Drop files into `media/` using the paths already referenced (see the comments in
each HTML file, e.g. `media/profile.jpg`). Placeholders show that exact path
until a real file exists at it, then the image takes over automatically.

## Editing the typing phrases
Open `qualities.txt` and edit the list, one phrase per line, no punctuation needed.

## Adding a new project
1. Add an entry to `projects.json` (slug, title, role, a `stats` string like
   `"2026 &middot; 12K visits"` or anything else you want shown, and an
   image path). This is what powers the homepage preview and the full
   projects grid.
2. Duplicate any file in `projects/` (e.g. `projects/r440.html`) for the
   detail page, rename it to `projects/<slug>.html`, and update the header
   and content blocks.

### The project page format
Each project page is a header (title + a left-aligned line of stats) followed
by any number of content blocks, separated by a small wave mark
(`<span class="wave-mark small"></span>`). Every file has a comment at the
bottom showing exactly what to copy. Each block is:

```html
<div class="press-block">                 <!-- or: class="press-block media-right" -->
  <div class="press-media">
    <div class="tape-photo">                    <!-- cropped photo, taped at the top -->
      <span class="tape"></span>
      <img src="../media/projects/slug/name.jpg" alt="...">
    </div>
    <!-- or a framed photo instead: -->
    <!-- <div class="polaroid"><div class="shot"><img ...></div></div> -->
    <!-- or a video instead of a photo: -->
    <!-- <video controls src="../media/projects/slug/clip.mp4"></video> -->
  </div>
  <div class="press-text">
    <p>Whatever you want to say about this part.</p>
  </div>
</div>
```

- `.press-block` puts the media on the left, text on the right.
  `.press-block.media-right` flips it.
- Want text with nothing next to it? Add `.no-media` to `.press-block` and
  delete the `.press-media` div entirely.
- Blocks can repeat as many times as you want, in any order, mixing photo,
  video, and text-only blocks freely.

## The journal (unlisted)
`journal.html` and `journal/*.html` work exactly like Projects, just not
linked from the top nav, only from the small "journal" text in the footer of
every page. It's real and reachable by anyone who finds the link or the URL,
just not advertised. Add entries the same way as projects: add one to
`journal.json`, duplicate `journal/first-entry.html`, rename it, and write
whatever. Delete the placeholder `first-entry` once you've got a real one.

## Running it locally
`qualities.txt` and `projects.json` load via `fetch`, which browsers block on
`file://`. Preview with a local server from this folder, for example:

```
python3 -m http.server 8000
```

then open `http://localhost:8000`. Once this is deployed to `tboner.cc` it
will work the same way with no server command needed.

## Clean URLs (tboner.cc/about-me instead of /about-me.html)
Most static hosts (Netlify, Vercel, Cloudflare Pages, GitHub Pages) can serve
`about-me.html` at the URL `/about-me` automatically, or with a one-line config
rule (this depends on which host you pick). Ask when you've chosen a host and
this can be set up exactly.

## Still placeholder / needs your input
- Your profile photo and every project image (see above)
- Your age on the About page (currently a dashed `[ age ]` placeholder)
- The favicon (`media/favicon.svg`) is a placeholder; swap in your own file
  whenever you have one, the `<link>` tag already points at that same path
  on every page
- The contact form only prevents the page from reloading right now. It needs
  a backend or a service like Formspree to actually send anything
- The Discord "Copy" buttons on the contact page copy your tag/email to the
  clipboard. If you'd rather show an actual live Discord server widget
  (online member count, etc.) that needs a real server ID, not just your
  username, so let me know if you want that instead
