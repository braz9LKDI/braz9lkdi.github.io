# Portfolio

I have always wanted a full HTML + CSS + JavaScript portfolio and here it is. It is highly inspired by this [video](https://www.youtube.com/watch?v=Slxdo0Dqxlk).

## Tooling

This portfolio uses my own [`style_config`](https://github.com/braz9LKDI/style_config) kit to keep the HTML, CSS, JavaScript and Markdown source consistent, mostly its `web/` stack with Markdown rules borrowed from `markdown/`:

- Prettier handles formatting across HTML, CSS, JavaScript, JSON and Markdown.

- ESLint catches JavaScript issues in both browser code and the Node scripts that generate the site.

- Stylelint keeps the CSS consistent, including project conventions like kebab-case class names and custom properties.

- html-validate checks the static HTML templates for invalid markup before the generated pages are rebuilt.

- markdownlint keeps the README and blog post source structurally tidy without fighting Prettier over wrapping.

- VS Code workspace settings wire the same formatter and linters into editor saves.

The tooling files in the root of this repository (`eslint.config.js`, `.stylelintrc.json`, `.htmlvalidate.json`, `.markdownlint.jsonc`, `.markdownlintignore`, `.prettierignore` and `.vscode/`) are adapted from those stacks with portfolio-specific ignores for generated HTML. The same setup can be adopted in another static web project by copying the `web/` folder, adding the Markdown rules from `markdown/` if needed and following their READMEs.
