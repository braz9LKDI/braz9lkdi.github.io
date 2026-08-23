/**
 * Font Awesome classes for every tag used across projects and blog posts, keyed by lowercase name.
 *
 * Brand glyphs are used wherever Font Awesome Free ships one. The remaining entries fall back to a
 * solid icon picked for visual similarity, because the free tier has no brand glyph for them.
 */
const TAG_ICONS = {
  android: 'fa-brands fa-android',
  css: 'fa-brands fa-css3-alt',
  docker: 'fa-brands fa-docker',
  html: 'fa-brands fa-html5',
  java: 'fa-brands fa-java',
  javascript: 'fa-brands fa-js',
  node: 'fa-brands fa-node',
  python: 'fa-brands fa-python',
  react: 'fa-brands fa-react',

  // No brand glyph in Font Awesome Free, closest solid stand-in.
  'c++': 'fa-solid fa-code',
  django: 'fa-solid fa-server',
  gdscript: 'fa-solid fa-gamepad',
  godot: 'fa-solid fa-gamepad',
  jupyter: 'fa-solid fa-book',
  kotlin: 'fa-solid fa-code',
  kubernetes: 'fa-solid fa-dharmachakra',
  'next.js': 'fa-solid fa-n',
  nginx: 'fa-solid fa-server',
  postgresql: 'fa-solid fa-database',
  prisma: 'fa-solid fa-layer-group',
  racket: 'fa-solid fa-code',
  spring: 'fa-solid fa-leaf',
  typescript: 'fa-solid fa-code',
};

/**
 * Resolves a tag to the Font Awesome classes that render its icon.
 *
 * The lookup is case-insensitive, so tags keep their natural casing ("JavaScript", "PostgreSQL") in
 * the content files. Unknown tags degrade to a generic icon rather than rendering nothing, so a new
 * tag never leaves a blank space on a card.
 *
 * @param {string} tag: tag as written in `projects.json` or in a post's frontmatter.
 * @returns {string}: space-separated Font Awesome classes, or `fa-solid fa-tag` when the tag has no entry.
 */
export default function tagIcon(tag) {
  return TAG_ICONS[tag.toLowerCase()] || 'fa-solid fa-tag';
}
