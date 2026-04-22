import fs from "fs"
import matter from "gray-matter"
import path from "path"

import { marked } from "marked"
import customHeadingId from "marked-custom-heading-id"
import marked_katex from "marked-katex-extension"

const POSTS_DIR = "./content/posts"
const OUTPUT_FILE = "./blog/index.html"
const TEMPLATE_FILE = "./blog/template.html"


marked.use(customHeadingId())
// Configure marked to support KaTeX for math rendering
marked.use(marked_katex({
	throwOnError: false
}))


// Read all Markdown files
function get_posts() {
	const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".md"))
	const posts = []

	files.forEach(file => {
		const content = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8")
		const { data, content: markdown } = matter(content)

		const slug = path.basename(file, ".md")

		posts.push({
			title: data.title,
			date: new Date(data.date),
			date_str: new Date(data.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
			tags: data.tags || [],
			excerpt: data.excerpt,
			image: `/assets/images/posts/${slug}.webp`,
			slug,
			content: marked.parse(markdown)
		})
	})

	posts.sort((a, b) => b.date - a.date)

	return posts
}

function generate_blog_item(post) {
	const tag_icons = {
		javascript: "fa-brands fa-js",
		css: "fa-brands fa-css3-alt",
		html: "fa-brands fa-html5",
		react: "fa-brands fa-react",
		node: "fa-brands fa-node"
	}

	const tags_HTML = post.tags.map(tag => {
		const icon = tag_icons[tag.toLowerCase()] || "fa-solid fa-tag"
		return `<span class="tag"><i class="${icon}" aria-hidden="true"></i>${tag}</span>`
	}).join("\n\t\t\t\t\t\t\t")

	return `
			<article class="blog-item" data-tags="${post.tags.join(",")}">
				<div class="blog-image">
					<img src="${post.image}" alt="${post.title} preview image" loading="lazy">
				</div>
				<div class="blog-content">
					<h2>${post.title}</h2>
					<div class="blog-meta">
						<span class="date">${post.date_str}</span>
					</div>
					<p class="excerpt">${post.excerpt}</p>
					<div class="post-footer">
						<div class="tech-tags">
							${tags_HTML}
						</div>
						<a href="posts/${post.slug}.html" class="read-more">Read more <i class="fa-solid fa-arrow-right"></i></a>
					</div>
				</div>
			</article>`
}

// Generate individual post page
function generate_post_page(post) {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="${post.excerpt}">
	<title>${post.title} - Brandon's Blog</title>

	<link rel="stylesheet" href="/assets/fonts/fontawesome/all.min.css" />
	<link rel="stylesheet" href="/css/style.css" />
	<link rel="stylesheet" href="/css/blog.css" />
	<link rel="stylesheet" href="/css/post.css" />

	<link rel="icon" href="/favicon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: light)">
	<link rel="icon" href="/favicon-light.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)">

	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
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

function build_blog() {
	const posts = get_posts()
	const template = fs.readFileSync(TEMPLATE_FILE, "utf-8")

	const blog_items = posts.map(generate_blog_item).join("\n")
	const output = template.replace("<!-- BLOG_ITEMS -->", blog_items)

	fs.writeFileSync(OUTPUT_FILE, output)
	console.log(`Generated ${OUTPUT_FILE} with ${posts.length} posts`)

	// Ensure the output directory exists
	const html_dir = "./blog/posts/"
	fs.mkdirSync(html_dir, { recursive: true })

	posts.forEach(post => {
		const post_HTML = generate_post_page(post)
		const post_path = `./blog/posts/${post.slug}.html`
		fs.writeFileSync(post_path, post_HTML)
		console.log(`Generated ${post_path}`)
	})
}

build_blog()
