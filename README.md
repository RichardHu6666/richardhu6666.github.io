# Richard Hu's research homepage

The site is a single-page Jekyll adaptation of [Minimalist Academic Portfolio](https://github.com/minimalacademicsite/minimalacademicsite.github.io) (MIT), which derives from Academic Pages and Minimal Mistakes. Its upstream Sass foundation is vendored in `_sass/` at commit `74e6a2788d94971b8ff6cbcb9ff7a89e764ee878`; see `LICENSE`.

## Update the site

- Edit `index.html` for the biography, research, projects, publication status, and education.
- Edit `_sass/_site.scss` for the local visual layer. The upstream Sass is otherwise unchanged.
- The optimized profile image is `assets/images/profile.jpg`.

The original photo, application CV, and interview presentation at the repository root are local source materials and are ignored by Git. They are also excluded from the Jekyll output. Do not add them to the site without reviewing their personal information.

For local development with Ruby and Bundler:

```sh
bundle install
bundle exec jekyll serve
```

Changes pushed to `main` are built and published by the GitHub Pages workflow. In the repository's Pages settings, select **GitHub Actions** as the build and deployment source.
