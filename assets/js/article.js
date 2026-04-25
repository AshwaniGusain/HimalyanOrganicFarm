const ARTICLES_SOURCE = 'assets/content/articles.txt';

function parseArticles(raw) {
  const blocks = raw
    .split('\n===ARTICLE===\n')
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const separator = '\n---\n';
      const separatorIndex = block.indexOf(separator);
      if (separatorIndex === -1) {
        return null;
      }

      const metaText = block.slice(0, separatorIndex).trim();
      const bodyText = block.slice(separatorIndex + separator.length).trim();

      const meta = {};
      metaText.split('\n').forEach((line) => {
        const idx = line.indexOf(':');
        if (idx === -1) {
          return;
        }
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        meta[key] = value;
      });

      if (!meta.slug || !meta.title || !bodyText) {
        return null;
      }

      return {
        slug: meta.slug,
        title: meta.title,
        category: meta.category || 'Resource',
        date: meta.date || '',
        summary: meta.summary || '',
        body: bodyText
      };
    })
    .filter(Boolean);
}

function renderBody(container, body) {
  container.innerHTML = '';

  const chunks = body
    .split('\n\n')
    .map((part) => part.trim())
    .filter(Boolean);

  chunks.forEach((chunk) => {
    const lines = chunk.split('\n').map((line) => line.trim()).filter(Boolean);
    const isList = lines.length > 1 && lines.every((line) => line.startsWith('- '));

    if (isList) {
      const ul = document.createElement('ul');
      lines.forEach((line) => {
        const li = document.createElement('li');
        li.textContent = line.slice(2).trim();
        ul.appendChild(li);
      });
      container.appendChild(ul);
      return;
    }

    const p = document.createElement('p');
    p.textContent = chunk;
    container.appendChild(p);
  });
}

function renderArticleLinks(container, articles, currentSlug) {
  container.innerHTML = '<strong>More Resources</strong>';

  articles
    .filter((article) => article.slug !== currentSlug)
    .slice(0, 5)
    .forEach((article) => {
      const link = document.createElement('a');
      link.className = 'text-link';
      link.href = `article.html?article=${encodeURIComponent(article.slug)}`;
      link.textContent = article.title;
      container.appendChild(link);
    });
}

async function loadArticlePage() {
  const titleEl = document.querySelector('#article-title');
  const categoryEl = document.querySelector('#article-category');
  const dateEl = document.querySelector('#article-date');
  const bodyEl = document.querySelector('#article-body');
  const linksEl = document.querySelector('#article-links');
  const errorEl = document.querySelector('#article-error');

  if (!titleEl || !categoryEl || !dateEl || !bodyEl || !linksEl || !errorEl) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const requestedSlug = params.get('article');

  if (!requestedSlug) {
    errorEl.style.display = 'block';
    errorEl.textContent = 'No article selected. Please go back and choose an article.';
    titleEl.textContent = 'Article Not Found';
    return;
  }

  if (window.location.protocol === 'file:') {
    errorEl.style.display = 'block';
    errorEl.textContent =
      'Articles cannot be loaded on file:// pages. Open this site via http://localhost or a deployed domain so assets/content/articles.txt can be fetched.';
    titleEl.textContent = 'Article Unavailable';
    return;
  }

  try {
    const response = await fetch(ARTICLES_SOURCE, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Unable to load article source file.');
    }

    const raw = await response.text();
    const articles = parseArticles(raw);
    const article = articles.find((item) => item.slug === requestedSlug);

    if (!article) {
      errorEl.style.display = 'block';
      errorEl.textContent = 'Requested article was not found.';
      titleEl.textContent = 'Article Not Found';
      return;
    }

    categoryEl.textContent = article.category;
    titleEl.textContent = article.title;
    dateEl.textContent = article.date ? `Published: ${article.date}` : '';
    renderBody(bodyEl, article.body);
    renderArticleLinks(linksEl, articles, article.slug);

    document.title = `${article.title} | Himalyan Organic Farm`;
  } catch (error) {
    errorEl.style.display = 'block';
    errorEl.textContent =
      `Failed to load article: ${error.message || 'Unknown error'}. Ensure article.html is served over HTTP and assets/content/articles.txt is reachable.`;
    titleEl.textContent = 'Article Unavailable';
  }
}

loadArticlePage();
