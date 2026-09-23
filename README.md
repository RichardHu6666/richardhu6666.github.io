# XiangyunHu's research homepage

The site is a single-page Jekyll adaptation of [Minimalist Academic Portfolio](https://github.com/minimalacademicsite/minimalacademicsite.github.io) (MIT), which derives from Academic Pages and Minimal Mistakes. Its upstream Sass foundation is vendored in `_sass/` at commit `74e6a2788d94971b8ff6cbcb9ff7a89e764ee878`; see `LICENSE`.

## Update the site

- Edit `index.html` for the biography, research, projects, publication status, and education.
- Edit `_config.yml` for the author details shown in the sidebar: name, role
  (`author.description`), affiliation, `author_interests`, and any links
  (`author.email`, `author.cv`, `author.googlescholar`, `author.github`,
  `author.linkedin`, `author.orcid`, `author.arxiv`). A link only appears once
  its field has a value; `author.cv` is a path relative to the site root.
- Edit `_sass/_site.scss` for the local visual layer. The upstream Sass is
  otherwise unchanged.
- `assets/js/site.js` holds the only page behaviour: collapsing the navigation
  when it stops fitting, and the scrolled masthead state.
- The optimized profile image is `assets/images/profile.jpg` (square, 900×900).
- Institution marks live in `assets/images/institutions/` and are referenced
  from two places: the education entries in `index.html`, and the sidebar via
  `author.affiliation_logo` in `_config.yml`. Both marks are official artwork
  taken from the institutions and used to identify the affiliation:

  | File | Institution | Source |
  | --- | --- | --- |
  | `casia.png` | Institute of Automation, Chinese Academy of Sciences | [ia.ac.cn 形象标识](http://www.ia.ac.cn/gkjj/xxbs/) |
  | `seu.png` | Southeast University | [Southeast University seal](https://www.urongda.com/logos/4132010286) |

  They are trademarks of their institutions and are not covered by this
  repository's MIT licence. Regenerate the web-sized versions from the
  originals with `python .preview/prepare-logos.py`.
- Headings use EB Garamond and body text Source Sans 3, both self-hosted as
  Latin-subset `woff2` files in `assets/fonts/`. No third-party font request is
  made at runtime.
- Project figures live in `assets/images/research/` and are referenced from
  `index.html`. The originals stay in `pics/`, which is git-ignored because one
  of them is ~30 MB; the committed derivatives total ~380 KB. To refresh them,
  drop replacements into `pics/` and re-run:

  ```sh
  python .preview/prepare-figures.py
  ```

  That script also normalizes format: the source files arrived with a WebP
  carrying a `.jpg` extension and a 13086×5883 PNG, neither of which belongs on
  a web page.

The original photo, application CV, and interview presentation at the repository root are local source materials and are ignored by Git. They are also excluded from the Jekyll output. Do not add them to the site without reviewing their personal information.

## Design notes

The visual layer is deliberately small and lives in one file:

- `_sass/_site.scss` — all site-specific styling, imported last so it wins over
  the vendored foundation without needing `!important`. This is where the design
  tokens (typefaces, ink colours, rhythm) are defined.
- `_layouts/default.html` — the page shell: a two-column grid (`.shell`) holding
  the author rail and the content column.
- `_includes/author-profile.html` — the sidebar rail, driven by `_config.yml`.

Section anchors are offset for the fixed masthead with `scroll-margin-top`, so
in-page navigation works without JavaScript.

## Local development

With Ruby and Bundler:

```sh
bundle install
bundle exec jekyll serve
```

### Checks

Run these before pushing.

```sh
ruby .preview/liquidcheck.rb      # templates, sidebar guards, head metadata
python .preview/contrast.py       # WCAG AA contrast for the ink palette
```

`liquidcheck.rb` parses every template with the same Liquid gem the Pages build
uses and renders two includes against the real `_config.yml`. It catches three
things that would otherwise only surface in a failed Pages run or on the live
site:

- A Liquid syntax error in any template. Liquid has no nested tags: a
  `{% comment %}` block containing another tag breaks the build.
- Sidebar links rendering for author fields that are present but empty. Liquid
  treats an empty string as truthy, and neither `!= blank` nor `strip != empty`
  filters it out — the guard used here is `size > 0`.
- A head that would produce a poor shared link: missing `og:type`,
  `og:description` or `og:image`, a self-repeating `<title>`, or an ld+json
  block that is not valid JSON (including a `"sameAs": null`).

`contrast.py` reads the palette straight out of `_sass/_site.scss` so it cannot
drift from what ships, and reports the darkest value each token would need.

### Sharing card

`assets/images/og-card.jpg` is the preview image for shared links. It is
generated rather than hand-made, so it stays in step with the page's own type
and palette:

```sh
python .preview/og-image.py       # writes assets/images/og-card.jpg
```

Re-run it when the name, role or affiliation changes. `_config.yml` points at it
through `og_image`.

### Preview without Ruby

`.preview/` also holds a development-only harness that compiles
`assets/css/main.scss` through `dart-sass` and writes a static page mirroring the
Jekyll output:

```sh
npm install --no-save sass
node .preview/build.mjs                     # writes .preview/index.html
PREVIEW_MEASURE=1 node .preview/build.mjs   # adds an on-page probe
```

The probe renders computed widths, contrast ratios and heading order into the
page, because headless Chrome cannot be driven over the DevTools pipe here.

`.preview/` is a scratch directory for inspecting the design and is not published.

## Deployment

Changes pushed to `main` are built and published by the GitHub Pages workflow. In the repository's Pages settings, select **GitHub Actions** as the build and deployment source.
