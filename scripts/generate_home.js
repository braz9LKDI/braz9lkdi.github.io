import fs from "fs";

const PROJECTS_FILE = "./content/projects.json";
const OUTPUT_FILE = "./index.html";
const TEMPLATE_FILE = "./template.html";

const TAG_ICONS = {
  javascript: "fa-brands fa-js",
  css: "fa-brands fa-css3-alt",
  html: "fa-brands fa-html5",
  react: "fa-brands fa-react",
  node: "fa-brands fa-node",
  python: "fa-brands fa-python",
};

function build() {
  console.log("Building home page...");

  const projectsRaw = fs.readFileSync(PROJECTS_FILE, "utf-8");
  const projects = JSON.parse(projectsRaw);

  const template = fs.readFileSync(TEMPLATE_FILE, "utf-8");

  const projectsHtml = projects
    .map((project) => {
      const tagsHtml = (project.tags || [])
        .map((tag) => {
          const iconClass = TAG_ICONS[tag.toLowerCase()] || "fa-solid fa-tag";
          return `<span class="tag"><i class="${iconClass}"></i>${tag}</span>`;
        })
        .join("\n\t\t\t\t\t\t");

      const idAttr = project.id ? `id="${project.id}"` : "";

      return `
				<div class="project-card" ${idAttr}>
					<div class="project-image">
						<img src="${project.image}" alt="${project.title}">
					</div>
					<div class="project-info">
						<h3>${project.title}</h3>
						<p>${project.description}</p>
					</div>
					<div class="tech-tags">
						${tagsHtml}
					</div>
					<div class="project-links">
						<a href="${project.links.code}" target="_blank" rel="noopener noreferrer">
							<i class="fa-brands fa-github"></i><span>Code</span>
						</a>
						<a href="${project.links.live}" target="_blank" rel="noopener noreferrer">
							<i class="fa-solid fa-globe"></i><span>Live</span>
						</a>
					</div>
				</div>`;
    })
    .join("\n");

  const finalHtml = template.replace("<!-- PROJECTS_LIST -->", projectsHtml);
  fs.writeFileSync(OUTPUT_FILE, finalHtml);
  console.log("Successfully generated index.html");
}

build();
