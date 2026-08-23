import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

import { marked } from 'marked';
import customHeadingId from 'marked-custom-heading-id';
import markedKatex from 'marked-katex-extension';

import tagIcon from './tag_icons.js';

const POSTS_DIR = './content/posts';
const OUTPUT_FILE = './blog/index.html';
const TEMPLATE_FILE = './blog/template.html';
const MIN_POST_PER_TAG = 2;

marked.use(customHeadingId());
// Configure marked to support KaTeX for math rendering
marked.use(
  markedKatex({
    throwOnError: false,
  }),
);

/**
 * Reads every Markdown post and returns them as render-ready objects, newest first.
 *
 * Frontmatter supplies `title`, `date`, `excerpt` and `tags`; the body is parsed to HTML here so
 * callers never handle Markdown. Tags are lowercased to give the filter buttons and the icon lookup
 * a single canonical form. The slug comes from the filename, which also determines the preview
 * image path, so a post's image is expected at `/assets/images/posts/<slug>.webp`.
 *
 * @returns {Array<Object>}: posts sorted by descending date, each with `title`, `date`, `date_str`,
 * `tags`, `excerpt`, `image`, `slug` and parsed `content`.
 */
function getPosts() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  const posts = [];

  files.forEach((file) => {
    const content = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { data, content: markdown } = matter(content);

    const slug = path.basename(file, '.md');

    posts.push({
      title: data.title,
      date: new Date(data.date),
      date_str: new Date(data.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      tags: (data.tags || []).map((tag) => tag.toLowerCase()),
      excerpt: data.excerpt,
      image: `/assets/images/posts/${slug}.webp`,
      slug,
      content: marked.parse(markdown),
    });
  });

  posts.sort((a, b) => b.date - a.date);

  return posts;
}

/**
 * Renders one tag filter button for the blog index.
 *
 * `data-tag` carries the tag to the client-side filter and `aria-pressed` starts false, since no
 * filter is active on first load.
 *
 * @param {string} tag: lowercase tag name.
 * @returns {string}: HTML for a single filter button.
 */
function generateTagItem(tag) {
  return `
              <button class="tag" type="button" data-tag="${tag}" aria-pressed="false">
                <i class="${tagIcon(tag)}" aria-hidden="true"></i>${tag}
              </button>`;
}

/**
 * Renders one post card for the blog index.
 *
 * `data-tags` holds the comma-separated tags that the client-side filter reads. `post.excerpt` is
 * injected raw, so excerpts must be plain text: Markdown and backticks in frontmatter reach the
 * page literally.
 *
 * @param {Object} post: a post as returned by `getPosts`.
 * @returns {string}: HTML for a single blog card.
 */
function generateBlogItem(post) {
  const postLink = `posts/${post.slug}.html`;

  const tagsHtml = post.tags
    .map((tag) => {
      return `<span class="tag"><i class="${tagIcon(tag)}" aria-hidden="true"></i>${tag}</span>`;
    })
    .join('\n');

  return `
      <article class="blog-item" data-tags="${post.tags.join(',')}">
        <div class="blog-image">
          <img src="${post.image}" alt="${post.title} preview image" loading="lazy">
        </div>
        <div class="blog-content">
          <h2><a href="${postLink}" class="card-link">${post.title}</a></h2>
          <div class="blog-meta">
            <span class="date">${post.date_str}</span>
          </div>
          <p class="excerpt">${post.excerpt}</p>
          <div class="tech-tags">
            ${tagsHtml}
          </div>
        </div>
      </article>`;
}

/**
 * Renders the standalone HTML page for a single post.
 *
 * The template deliberately emits no `<h1>`: the title comes from the first heading of the Markdown
 * body, so every post file must open with an H1 matching its frontmatter `title`.
 *
 * `post.excerpt` becomes the meta description verbatim, and `post.content` is already-parsed HTML
 * from `getPosts`. Neither is escaped.
 *
 * @param {Object} post: a post as returned by `getPosts`.
 * @returns {string}: complete HTML document for the post.
 */
function generatePostPage(post) {
  return `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${post.excerpt}" />
    <title>${post.title} - Brandon's Blog</title>

    <link rel="stylesheet" href="/assets/fonts/fontawesome/all.min.css" />
    <link rel="stylesheet" href="/css/style.css" />
    <link rel="stylesheet" href="/css/blog.css" />
    <link rel="stylesheet" href="/css/post.css" />

    <link rel="icon" href="/favicon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: light)" />
    <link rel="icon" href="/favicon-light.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
</head>
<body>
    <header>
        <nav>
            <div class="left">
                <a href="/">Brandon</a>
            </div>
            <div class="right">
                <a href="/">
                    <i class="fa-solid fa-house"></i>
                    <span>home</span>
                </a>
                <a href="/blog/" class="active">
                    <i class="fa-solid fa-pen"></i>
                    <span>blog</span>
                </a>
                <a href="/#contact">
                    <i class="fa-solid fa-envelope"></i>
                    <span>contact</span>
                </a>
            </div>
        </nav>
    </header>
    <main>
        <article class="post">
            <a href="/blog/" class="back-link"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Return to all posts</a>
            <header class="post-header">
                <div class="post-meta">
                    <span class="date">${post.date_str}</span>
                </div>
            </header>
            <div class="post-content">
                ${post.content}
            </div>
            <a href="/blog/" class="back-link"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Return to all posts</a>
        </article>
    </main>
    <footer>
        <p>Created by Brandon</p>
    </footer>
</body>
</html>`;
}

/**
 * Builds the blog index and one page per post.
 *
 * Overwrites `blog/index.html` and every file under `blog/posts/`, creating that directory if it is
 * missing. Stale pages are not removed, so a renamed or deleted Markdown file leaves its old HTML
 * behind until it is cleared by hand.
 *
 * Only tags reaching `MIN_POST_PER_TAG` become filter buttons.
 *
 * @returns {void}
 */
function buildBlog() {
  const posts = getPosts();
  const template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

  const allTags = [...new Set(posts.flatMap((post) => post.tags))];
  const filteredTags = allTags
    .filter((tag) => {
      const count = posts.filter((post) => post.tags.includes(tag)).length;
      return count >= MIN_POST_PER_TAG;
    })
    .sort();

  const blogItems = posts.map(generateBlogItem).join('\n');
  const tagFilters = filteredTags.map(generateTagItem).join('\n');
  let output = template.replace('<!-- BLOG_ITEMS -->', blogItems);
  output = output.replace('<!-- TAG_FILTERS -->', tagFilters);

  fs.writeFileSync(OUTPUT_FILE, output);
  console.log(`Generated ${OUTPUT_FILE} with ${posts.length} posts`);

  // Ensure the output directory exists
  const htmlDir = './blog/posts/';
  fs.mkdirSync(htmlDir, { recursive: true });

  posts.forEach((post) => {
    const postHtml = generatePostPage(post);
    const postPath = `./blog/posts/${post.slug}.html`;
    fs.writeFileSync(postPath, postHtml);
    console.log(`Generated ${postPath}`);
  });
}

buildBlog();
