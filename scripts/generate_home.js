import fs from "fs"

const PROJECTS_FILE = "./content/projects.json"
const OUTPUT_FILE = "./index.html"
const TEMPLATE_FILE = "./template.html"

const TAG_ICONS = {
	javascript: "fa-brands fa-js",
	css: "fa-brands fa-css3-alt",
	html: "fa-brands fa-html5",
	react: "fa-brands fa-react",
	node: "fa-brands fa-node",
	python: "fa-brands fa-python",
}


function build() {
	console.log("Building home page...")

	const projects_raw = fs.readFileSync(PROJECTS_FILE, "utf-8")
	const projects = JSON.parse(projects_raw)

	const template = fs.readFileSync(TEMPLATE_FILE, "utf-8")

	const projects_html = projects.map(project => {
		const tags_html = (project.tags || []).map(tag => {
			const icon_class = TAG_ICONS[tag.toLowerCase()] || "fa-solid fa-tag"
			return `<span class="tag"><i class="${icon_class}"></i>${tag}</span>`
		}).join("\n\t\t\t\t\t\t")

		const id_attr = project.id ? `id="${project.id}"` : ""

		return `
				<div class="project-card" ${id_attr}>
					<div class="project-image">
						<img src="${project.image}" alt="${project.title}">
					</div>
					<div class="project-info">
						<h3>${project.title}</h3>
						<p>${project.description}</p>
					</div>
					<div class="tech-tags">
						${tags_html}
					</div>
					<div class="project-links">
						<a href="${project.links.code}" target="_blank" rel="noopener noreferrer">
							<i class="fa-brands fa-github"></i><span>Code</span>
						</a>
						<a href="${project.links.live}" target="_blank" rel="noopener noreferrer">
							<i class="fa-solid fa-globe"></i><span>Live</span>
						</a>
					</div>
				</div>`
	}).join("\n")


	const final_html = template.replace("<!-- PROJECTS_LIST -->", projects_html)
	fs.writeFileSync(OUTPUT_FILE, final_html)
	console.log("Successfully generated index.html")
}

build()
