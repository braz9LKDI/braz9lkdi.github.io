import fs from 'fs';

import tagIcon from './tag_icons.js';

const PROJECTS_FILE = './content/projects.json';
const OUTPUT_FILE = './index.html';
const TEMPLATE_FILE = './template.html';

/**
 * Builds the home page from the project data and writes it to `index.html`.
 *
 * Reads `content/projects.json` and `template.html`, renders a card for every project and
 * substitutes the result into the template's placeholder comment. The existing `index.html` is
 * overwritten in place.
 *
 * Featured projects are sorted to the front rather than filtered, so `featured` controls position
 * in the slider and never hides a project. `Array.prototype.sort` is stable, so projects keep their
 * `projects.json` order within each group: reordering the file reorders the page.
 *
 * @returns {void}
 */
function build() {
  console.log('Building home page...');

  const projectsRaw = fs.readFileSync(PROJECTS_FILE, 'utf-8');
  const projects = JSON.parse(projectsRaw);

  const template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

  /**
   * Escapes the characters that would break out of a double-quoted HTML attribute.
   *
   * Only `&` and `"` are replaced. The result is interpolated into `data-en` and `data-es`
   * attributes.
   *
   * @param {string} text: raw title or description from `projects.json`.
   * @returns {string}: text safe to place inside a double-quoted attribute.
   */
  const escapeText = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

  const ordered = [...projects].sort((a, b) => b.featured - a.featured);

  const projectsHtml = ordered
    .map((project) => {
      const tagsHtml = (project.tags || [])
        .map((tag) => {
          return `<span class="tag"><i class="${tagIcon(tag)}"></i>${tag}</span>`;
        })
        .join('\n');

      const linksHtml = [
        project.links?.code
          ? `<a href="${project.links.code}" target="_blank" rel="noopener noreferrer">
            <i class="fa-brands fa-github"></i><span data-lang="project-code">Code</span>
          </a>`
          : '',
        project.links?.live
          ? `<a href="${project.links.live}" target="_blank" rel="noopener noreferrer">
            <i class="fa-solid fa-globe"></i><span data-lang="project-live">Live</span>
          </a>`
          : '',
      ].join('\n');

      const idAttr = project.id ? `id="${project.id}"` : '';

      return `
            <div class="project-card" ${idAttr}>
              <div class="project-image">
                <img src="${project.image}" alt="${project.text.en.title}">
              </div>
              <div class="project-info">
                <h3 data-en="${escapeText(project.text.en.title)}" data-es="${escapeText(project.text.es.title)}">${project.text.en.title}</h3>
                <p data-en="${escapeText(project.text.en.description)}" data-es="${escapeText(project.text.es.description)}">${project.text.en.description}</p>
              </div>
              <div class="tech-tags">
                ${tagsHtml}
              </div>
              <div class="project-links">
                ${linksHtml}
              </div>
            </div>`;
    })
    .join('\n');

  const finalHtml = template.replace('<!-- PROJECTS_LIST -->', projectsHtml);
  fs.writeFileSync(OUTPUT_FILE, finalHtml);
  console.log('Successfully generated index.html');
}

build();
