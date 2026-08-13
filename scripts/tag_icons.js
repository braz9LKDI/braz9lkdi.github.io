const TAG_ICONS = {
  javascript: 'fa-brands fa-js',
  css: 'fa-brands fa-css3-alt',
  html: 'fa-brands fa-html5',
  react: 'fa-brands fa-react',
  node: 'fa-brands fa-node',
  python: 'fa-brands fa-python',
};

export default function tagIcon(tag) {
  return TAG_ICONS[tag.toLowerCase()] || 'fa-solid fa-tag';
}
