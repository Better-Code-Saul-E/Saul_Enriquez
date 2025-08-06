let currentSlide = [];
let slideClasses = [];

function changeSlide(step, slideshowIndex) {
    displaySlide(currentSlide[slideshowIndex] += step, slideshowIndex);
}

function displaySlide(slideNumber, slideshowIndex) {
    let slides = document.getElementsByClassName(slideClasses[slideshowIndex]);
    if (slides.length === 0) return;
    if (slideNumber > slides.length) { currentSlide[slideshowIndex] = 1; }
    if (slideNumber < 1) { currentSlide[slideshowIndex] = slides.length; }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[currentSlide[slideshowIndex] - 1].style.display = "block";
}

function checkImageExists(path) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = path;
  });
}

async function getImagePath(baseName) {
  const extensions = ['.png', '.jpg', '.svg', '.webp'];

  for (const ext of extensions) {
    const path = `icons/${baseName}${ext}`;
    const exists = await checkImageExists(path); 
    if (exists) {
      return path;
    }
  }

  return 'icons/placeholder.png';
}

async function createProjectArticle(project, index, showHero) {
  currentSlide[index] = 1;

  const slideClass = `slides${index}`;
  slideClasses[index] = slideClass;

  // Create article container
  const article = document.createElement('article');
  article.classList.add('project');

    const imagePathPromises = project.tech.map(icon => getImagePath(icon));
  const resolvedImagePaths = await Promise.all(imagePathPromises);

    const techIconsHTML = resolvedImagePaths.map((path, i) => 
    `<img src="${path}" alt="${project.tech[i]}" title="${project.tech[i]}">`
  ).join('');

  // Create project description HTML
  const descriptionHTML = `
    <div class="project-description">
      <p>${project.description}</p>
      <div class="tech-used">
        <h6>Built With</h6>
        ${techIconsHTML}
      </div>
      <div class="section-links">
        <h6>Links</h6>
        <div class="links">
        ${showHero ? `<a class="portfolio-link" href="portfolio.html">See All Projects</a>`: ""}
        <a class="portfolio-link" href="${project.github}" target="_blank">GitHub Repository</a>
        ${project.liveSite ? `<a class="portfolio-link" href="${project.liveSite}" target="_blank">Live Site</a>` : ''}
        </div>
      </div>
    </div>
  `;

  // Create slideshow container HTML
const slidesHTML = project.images.map((img, i) => `
    <div class="${slideClass}" style="display: ${i === 0 ? 'block' : 'none'};">
      <img src="images/${img}" alt="${project.title} screenshot ${i+1}">
    </div>
  `).join('');

  // Slideshow HTML with buttons calling changeSlide with index
  const slideshowHTML = `
    <div class="slideshow-container">
      ${slidesHTML}
      <div class="slideshow-buttons">
        <button class="prev" onclick="changeSlide(-1, ${index})">&#10094;</button>
        <button class="next" onclick="changeSlide(1, ${index})">&#10095;</button>
      </div>
    </div>
  `;

  // Set inner HTML for article
  article.innerHTML = `
    <h4>${project.title}</h4>
    <div class="project-content">
      ${descriptionHTML}
      ${slideshowHTML}
    </div>
  `;

  return article;
}


// Main function to load projects
async function loadProjects(showHeroOnly = false) {
  try {
    const response = await fetch('projects.json');
    if (!response.ok) throw new Error('Failed to fetch projects.json');

    const projects = await response.json();

    const filtered = showHeroOnly ? projects.filter(p => p.hero) : projects;

    const container = document.getElementById('portfolio-showcase');
    container.innerHTML = '';

      for (const [i, project] of filtered.entries()) {
      const projectArticle = await createProjectArticle(project, i, showHeroOnly);
      container.appendChild(projectArticle);
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}