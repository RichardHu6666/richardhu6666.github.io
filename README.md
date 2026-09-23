# Richard Hu's research homepage

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
- Headings use EB Garamond and body text Source Sans 3, both self-hosted as
  Latin-subset `woff2` files in `assets/fonts/`. No third-party font request is
  made at runtime.

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

If the full Ruby toolchain is unavailable, `.preview/` contains a development-only
harness that compiles `assets/css/main.scss` through `dart-sass` and writes a
static page mirroring the Jekyll output:

```sh
npm install --no-save sass
node .preview/build.mjs      # writes .preview/index.html
```

`.preview/` is a scratch directory for inspecting the design and is not published.

## Deployment

Changes pushed to `main` are built and published by the GitHub Pages workflow. In the repository's Pages settings, select **GitHub Actions** as the build and deployment source.
