const STORAGE_KEY = "switch-games-catalog";
const DATA_VERSION_KEY = "games-data-version";
const DATA_VERSION = "v5-2026-06-30";

const ICON = {
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M19 19l-4-4"/></svg>`,
  sun: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
  moon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><circle cx="18" cy="18" r="3"/><path d="M22 20l-.5-1.5L20 18l1.5-.5L22 16l.5 1.5L24 18l-1.5.5z"/></svg>`,
  arrowUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  autofill: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
};

let catalog = { title: "", genres: [], games: [] };
let searchQuery = "";
let filterValue = "all";
let selectedGameId = null;
let editingGameId = null;

const catalogEl = document.getElementById("catalog");
const searchEl = document.getElementById("search");
const siteTitleEl = document.getElementById("site-title");
const detailModal = document.getElementById("detail-modal");
const gameModal = document.getElementById("game-modal");
const gameForm = document.getElementById("game-form");

const detailCover = document.getElementById("detail-cover");
const detailGenre = document.getElementById("detail-genre");
const detailTitle = document.getElementById("detail-title");
const detailTags = document.getElementById("detail-tags");
const detailDescription = document.getElementById("detail-description");
const detailGallery = document.getElementById("detail-gallery");
const detailDelete = document.getElementById("detail-delete");
const detailEdit = document.getElementById("detail-edit");

const gameFormTitle = document.getElementById("game-form-title");
const gameFormSubmit = document.getElementById("game-form-submit");
const genreFilterEl = document.getElementById("genre-filter");
const genreSelectEl = document.getElementById("game-genre");
const genreFilterEmpty = document.getElementById("genre-filter-empty");

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function placeholderCover(title, size = "card") {
  const hash = hashString(title);
  const colors = [
    ["#00f5ff", "#9d4edd"],
    ["#ff00aa", "#6366f1"],
    ["#39ff14", "#00f5ff"],
    ["#ff6b35", "#9d4edd"],
    ["#00f5ff", "#ff00aa"],
  ];
  const [c1, c2] = colors[hash % colors.length];
  const initials = title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");

  const w = size === "detail" ? 400 : 300;
  const h = size === "detail" ? 533 : 400;
  const fontSize = size === "detail" ? 64 : 48;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect width="100%" height="100%" fill="rgba(0,0,0,0.35)"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
      fill="white" font-family="Segoe UI,sans-serif" font-size="${fontSize}" font-weight="800">${initials}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function getCover(game) {
  return game.cover || placeholderCover(game.title);
}

function getAllImages(game) {
  const urls = [];
  if (game.cover) urls.push(game.cover);
  (game.images || []).filter(Boolean).forEach((url) => urls.push(url));
  return [...new Set(urls)];
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
}

const THEME_KEY = "switch-theme";

function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.toggle("light-theme");
  const btn = document.getElementById("theme-toggle");
  btn.innerHTML = (isLight ? ICON.sun : ICON.moon).replace('<svg', '<svg class="btn-icon"');
  btn.innerHTML += '<span class="btn-label"> Tema</span>';
  localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
}


function exportData() {
  const json = JSON.stringify(catalog, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "games-exported.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!Array.isArray(data.games) || !Array.isArray(data.genres) || !data.title) {
          alert("Arquivo inválido. O JSON deve conter 'title', 'genres' (array) e 'games' (array).");
          return;
        }
        catalog = data;
        saveToStorage();
        populateFilterGenres();
        render();
        alert("Dados importados com sucesso!");
      } catch {
        alert("Erro ao ler o arquivo. Verifique se é um JSON válido.");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

async function init() {
  const stored = loadFromStorage();

  const storedVersion = localStorage.getItem(DATA_VERSION_KEY);

  if (stored?.games?.length && storedVersion === DATA_VERSION) {
    catalog = stored;
  } else if (window.GAMES_DATA) {
    catalog = window.GAMES_DATA;
    localStorage.setItem(DATA_VERSION_KEY, window.GAMES_DATA.version || DATA_VERSION);
    saveToStorage();
  } else {
    catalog = { title: "Top Games Nintendo Switch", genres: [], games: [] };
  }

  sortGames();

  if (localStorage.getItem(THEME_KEY) === "light") {
    document.body.classList.add("light-theme");
    const btn = document.getElementById("theme-toggle");
    btn.innerHTML = ICON.sun.replace('<svg', '<svg class="btn-icon"');
    btn.innerHTML += '<span class="btn-label"> Tema</span>';
  }

  let migrated = false;
  catalog.games.forEach((g) => {
    if (g.multiplayer === undefined) {
      g.multiplayer = /\b(multiplay|coop)\b/i.test(`${g.tags || ""} ${g.raw || ""} ${g.title}`);
      if (g.multiplayer) migrated = true;
    }
    if (g.nintendo === undefined) {
      g.nintendo = false;
      migrated = true;
    }
    if (g.favorite === undefined) {
      g.favorite = false;
      migrated = true;
    }
    if (g.ptBr === undefined) {
      g.ptBr = false;
      migrated = true;
    }
    if (g.traducao === undefined) {
      g.traducao = false;
      migrated = true;
    }
  });
  if (migrated) saveToStorage();

  siteTitleEl.textContent = "Top Games Nintendo Switch";
  document.title = "Top Games Nintendo Switch — Catálogo";
  populateFilterGenres();
  render();
}

function populateFilterGenres() {
  const sel = document.getElementById("filter-select");
  const existing = sel.querySelectorAll('[data-genre]');
  existing.forEach((o) => o.remove());

  catalog.genres.forEach((genre) => {
    const opt = document.createElement("option");
    opt.value = genre;
    opt.textContent = genre;
    opt.dataset.genre = "";
    sel.appendChild(opt);
  });
}

function getFilteredGames() {
  const q = searchQuery.trim().toLowerCase();
  const genreFilter = filterValue !== "all" && filterValue !== "multiplayer" && filterValue !== "nintendo" && filterValue !== "favorite" && filterValue !== "ptbr" && filterValue !== "traducao" ? filterValue : null;

  const filtered = catalog.games.filter((g) => {
    if (q && !g.title.toLowerCase().includes(q) &&
        !g.genre.toLowerCase().includes(q) &&
        !(g.tags && g.tags.toLowerCase().includes(q)) &&
        !(g.raw && g.raw.toLowerCase().includes(q))) {
      return false;
    }
    if (filterValue === "multiplayer" && !detectMultiplayer(g)) return false;
    if (filterValue === "nintendo" && !g.nintendo) return false;
    if (filterValue === "ptbr" && !g.ptBr) return false;
    if (filterValue === "traducao" && !g.traducao) return false;
    if (filterValue === "favorite" && !g.favorite) return false;
    if (genreFilter && g.genre !== genreFilter) return false;
    return true;
  });

  return filtered;
}

function render() {
  const filtered = getFilteredGames();
  const isSearching = searchQuery.trim().length > 0;
  const isFiltering = filterValue !== "all";

  if (isSearching || isFiltering) {
    renderSearchResults(filtered);
    return;
  }

  catalogEl.innerHTML = catalog.genres
    .map((genre) => {
      const games = catalog.games.filter((g) => g.genre === genre);
      return renderGenreSection(genre, games);
    })
    .join("");
}

function renderSearchResults(games) {
  catalogEl.innerHTML = `
    <p class="search-results-info">
      ${games.length} jogo${games.length !== 1 ? "s" : ""} encontrado${games.length !== 1 ? "s" : ""} para "${escapeHtml(searchQuery)}"
    </p>
    <section class="genre-section">
      <div class="cards-grid">${games.map((g, i) => renderCard(g, i)).join("")}</div>
    </section>
  `;
}

function renderGenreSection(genre, games) {
  return `
    <section class="genre-section" id="${slugify(genre)}">
      <div class="genre-header">
        <div>
          <h2 class="genre-title">${escapeHtml(genre)}</h2>
          <span class="genre-count">${games.length} jogo${games.length !== 1 ? "s" : ""}</span>
        </div>
        <button type="button" class="btn btn-add" data-add-genre="${escapeAttr(genre)}">+ Adicionar jogo</button>
      </div>
      ${
        games.length
          ? `<div class="cards-grid">${games.map((g, i) => renderCard(g, i)).join("")}</div>`
          : `<p class="empty-genre">Nenhum jogo neste gênero. Clique em "Adicionar jogo".</p>`
      }
    </section>
  `;
}

function detectMultiplayer(game) {
  if (game.multiplayer) return true;
  const text = `${game.tags || ""} ${game.raw || ""} ${game.title}`.toLowerCase();
  return /\b(multiplay|coop)\b/.test(text);
}

function renderCard(game, index) {
  const hasMP = detectMultiplayer(game);
  const badges = [];
  if (hasMP) badges.push('<span>Multiplayer</span>');
  if (game.nintendo) badges.push('<span class="badge-nintendo">Nintendo</span>');
  if (game.ptBr) badges.push('<span class="badge-ptbr">PT-BR</span>');
  if (game.traducao) badges.push('<span class="badge-traducao">Tradução</span>');
  const badgesHtml = badges.length ? `<div class="card-multiplayer">${badges.join("")}</div>` : "";
  const fav = game.favorite ? '<div class="card-favorite">♥</div>' : "";
  return `
    <article class="game-card" data-id="${game.id}" style="animation-delay:${Math.min(index * 15, 300)}ms">
      <button type="button" class="card-delete" data-delete="${game.id}" aria-label="Excluir ${escapeAttr(game.title)}">&times;</button>
      ${fav}
      <img class="card-cover" src="${escapeAttr(getCover(game))}" alt="Capa de ${escapeAttr(game.title)}" loading="lazy">
      <div class="card-body">
        <h3 class="card-title">${escapeHtml(game.title)}</h3>
        ${game.tags ? `<p class="card-tags">${escapeHtml(game.tags)}</p>` : ""}
        ${badgesHtml}
      </div>
    </article>
  `;
}

function renderDetailGallery(game) {
  const images = getAllImages(game);

  if (images.length === 0) {
    detailGallery.innerHTML = `<p class="gallery-empty">Nenhuma foto cadastrada. Use "Editar jogo" para adicionar.</p>`;
    return;
  }

  detailGallery.innerHTML = images
    .map(
      (url, index) => `
      <figure class="gallery-item">
        <img src="${escapeAttr(url)}" alt="${escapeAttr(game.title)} — foto ${index + 1}" loading="lazy">
        ${game.cover && index === 0 ? "<figcaption>Capa</figcaption>" : `<figcaption>Foto ${game.cover ? index : index + 1}</figcaption>`}
      </figure>
    `
    )
    .join("");
}

function openDetail(game) {
  selectedGameId = game.id;
  detailCover.src = getCover(game);
  detailCover.alt = `Capa de ${game.title}`;
  detailGenre.textContent = game.genre;
  detailTitle.textContent = game.title;
  detailTags.textContent = game.tags || "Sem tags adicionais";
  detailDescription.textContent = game.description || game.raw || "Sem descrição disponível.";
  lightboxImages = getAllImages(game);
  renderDetailGallery(game);
  detailModal.showModal();
}

function populateGenreSelect(filter = "", selectedGenre = "") {
  const q = filter.trim().toLowerCase();
  const genres = catalog.genres.filter((g) => g.toLowerCase().includes(q));

  genreSelectEl.innerHTML = genres
    .map(
      (genre) =>
        `<option value="${escapeAttr(genre)}"${genre === selectedGenre ? " selected" : ""}>${escapeHtml(genre)}</option>`
    )
    .join("");

  genreFilterEmpty.hidden = genres.length > 0;
  genreSelectEl.hidden = genres.length === 0;

  if (genres.length && !genres.includes(selectedGenre)) {
    genreSelectEl.value = genres[0];
  }
}

function addNewGenre(name) {
  name = name.trim();
  if (!name) return;
  if (catalog.genres.includes(name)) {
    populateGenreSelect(name, name);
    return;
  }
  catalog.genres.push(name);
  catalog.genres.sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }));
  saveToStorage();
  populateGenreSelect(name, name);
}

function openGameModal(mode, presetGenre = "") {
  editingGameId = mode === "edit" ? selectedGameId : null;

  gameFormTitle.textContent = mode === "edit" ? "Editar jogo" : "Adicionar jogo";
  gameFormSubmit.textContent = mode === "edit" ? "Salvar alterações" : "Salvar jogo";

  document.getElementById("genre-add-inline").hidden = true;
  document.getElementById("btn-add-genre").hidden = false;
  document.getElementById("genre-new-name").value = "";

  genreFilterEl.value = presetGenre ? presetGenre : "";
  populateGenreSelect(genreFilterEl.value, presetGenre || catalog.genres[0] || "");

  if (mode === "edit") {
    const game = catalog.games.find((g) => g.id === selectedGameId);
    if (!game) return;

    document.getElementById("game-id").value = game.id;
    document.getElementById("game-title").value = game.title;
    document.getElementById("game-tags").value = game.tags || "";
    document.getElementById("game-multiplayer").checked = !!game.multiplayer;
    document.getElementById("game-nintendo").checked = !!game.nintendo;
    document.getElementById("game-ptbr").checked = !!game.ptBr;
    document.getElementById("game-traducao").checked = !!game.traducao;
    document.getElementById("game-favorite").checked = !!game.favorite;
    document.getElementById("game-description").value = game.description || "";
    document.getElementById("game-cover").value = game.cover || "";
    document.getElementById("game-images").value = (game.images || []).join("\n");

    genreFilterEl.value = game.genre;
    populateGenreSelect(game.genre, game.genre);
  } else {
    gameForm.reset();
    document.getElementById("game-id").value = "";
    genreFilterEl.value = presetGenre;
    populateGenreSelect(presetGenre, presetGenre || catalog.genres[0] || "");
  }

  detailModal.close();
  gameModal.showModal();
}

function sortGames() {
  catalog.games.sort((a, b) => a.title.localeCompare(b.title, "pt-BR", { sensitivity: "base" }));
}

function deleteGame(id) {
  const game = catalog.games.find((g) => g.id === id);
  if (!game) return;

  const confirmed = confirm(`Excluir "${game.title}"?`);
  if (!confirmed) return;

  catalog.games = catalog.games.filter((g) => g.id !== id);
  sortGames();
  saveToStorage();
  detailModal.close();
  render();
}

function saveGameFromForm() {
  const id = document.getElementById("game-id").value;
  const title = document.getElementById("game-title").value.trim();
  const tags = document.getElementById("game-tags").value.trim();
  const description = document.getElementById("game-description").value.trim();
  const cover = document.getElementById("game-cover").value.trim();
  const imagesRaw = document.getElementById("game-images").value.trim();
  const genre = genreSelectEl.value;

  if (!genre) {
    alert("Selecione um gênero.");
    return;
  }

  const multiplayer = document.getElementById("game-multiplayer").checked;
  const nintendo = document.getElementById("game-nintendo").checked;
  const ptBr = document.getElementById("game-ptbr").checked;
  const traducao = document.getElementById("game-traducao").checked;
  const favorite = document.getElementById("game-favorite").checked;

  const images = imagesRaw
    ? imagesRaw.split("\n").map((l) => l.trim()).filter(Boolean)
    : [];

  const payload = {
    title,
    tags,
    genre,
    multiplayer,
    nintendo,
    ptBr,
    traducao,
    favorite,
    raw: tags ? `${title}(${tags})` : title,
    description: description || (tags ? `Jogo de Nintendo Switch. ${tags}` : "Jogo de Nintendo Switch."),
    cover,
    images,
  };

  if (id) {
    const index = catalog.games.findIndex((g) => g.id === id);
    if (index !== -1) {
      catalog.games[index] = { ...catalog.games[index], ...payload };
    }
  } else {
    catalog.games.push({ id: crypto.randomUUID(), ...payload });
  }

  sortGames();
  saveToStorage();
  gameModal.close();

  if (id) {
    const scrollY = window.scrollY;
    render();
    window.scrollTo({ top: scrollY, behavior: "auto" });
  } else {
    render();
    const section = document.getElementById(slugify(genre));
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (id) {
    const updated = catalog.games.find((g) => g.id === id);
    if (updated) openDetail(updated);
  }
}

const RAWG_KEY_STORAGE = "rawg-api-key";

function getRAWGKey() {
  let key = localStorage.getItem(RAWG_KEY_STORAGE);
  if (!key) {
    key = prompt("Digite sua chave da API RAWG (https://rawg.io/apidocs):");
    if (key) localStorage.setItem(RAWG_KEY_STORAGE, key);
  }
  return key;
}

async function autofillFromRAWG() {
  const title = document.getElementById("game-title").value.trim();
  if (!title) {
    alert("Digite o nome do jogo primeiro.");
    return;
  }

  const key = getRAWGKey();
  if (!key) return;

  const btn = document.getElementById("btn-autofill");
  btn.disabled = true;
  btn.textContent = "Buscando...";

  try {
    const searchUrl = `https://api.rawg.io/api/games?key=${key}&search=${encodeURIComponent(title)}&page_size=1`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) throw new Error("Erro na busca: " + searchRes.status);
    const searchData = await searchRes.json();

    if (!searchData.results || searchData.results.length === 0) {
      alert("Nenhum jogo encontrado na RAWG.");
      return;
    }

    const found = searchData.results[0];
    const gameId = found.id;
    const gameName = found.name;
    const coverUrl = found.background_image || "";

    const [detailData, screensData] = await Promise.all([
      fetch(`https://api.rawg.io/api/games/${gameId}?key=${key}`).then((r) => r.json()),
      fetch(`https://api.rawg.io/api/games/${gameId}/screenshots?key=${key}`).then((r) => r.json()),
    ]);

    if (coverUrl) document.getElementById("game-cover").value = coverUrl;

    if (detailData.description_raw) {
      const desc = detailData.description_raw.length > 500
        ? detailData.description_raw.slice(0, 500) + "..."
        : detailData.description_raw;
      document.getElementById("game-description").value = desc;
    }

    const screenshots = (screensData.results || []).map((s) => s.image).filter(Boolean);
    const maxScreenshots = screenshots.slice(0, 3);
    if (maxScreenshots.length > 0) document.getElementById("game-images").value = maxScreenshots.join("\n");

    if (gameName && gameName.toLowerCase() !== title.toLowerCase()) {
      if (confirm(`Jogo encontrado: "${gameName}". Atualizar o título?`)) {
        document.getElementById("game-title").value = gameName;
      }
    }
  } catch (err) {
    alert("Erro ao buscar dados da RAWG: " + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Auto Preencher";
  }
}

let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(src, index) {
  lightboxIndex = index;
  const lightbox = document.getElementById("lightbox-modal");
  const img = document.getElementById("lightbox-image");
  img.src = src;
  img.alt = "Imagem ampliada";
  updateLightboxNav();
  lightbox.showModal();
}

function updateLightboxNav() {
  document.getElementById("lightbox-prev").hidden = lightboxIndex <= 0;
  document.getElementById("lightbox-next").hidden = lightboxIndex >= lightboxImages.length - 1;
}

function navigateLightbox(dir) {
  const i = lightboxIndex + dir;
  if (i < 0 || i >= lightboxImages.length) return;
  lightboxIndex = i;
  document.getElementById("lightbox-image").src = lightboxImages[i];
  updateLightboxNav();
}

async function batchAutofillAllGames() {
  const key = getRAWGKey();
  if (!key) return;

  const games = catalog.games;
  let done = 0, updated = 0, errors = 0;

  const progress = document.createElement("div");
  progress.style.cssText = "position:fixed;top:1rem;right:1rem;background:var(--bg-card);border:1px solid var(--border);padding:1rem;border-radius:8px;z-index:9999;max-width:300px;font-size:.85rem";
  progress.innerHTML = `
    <div style="font-weight:600;margin-bottom:.5rem;color:var(--cyan)">Auto Preencher Todos</div>
    <div>Processados: <span id="bp-done">0</span> / ${games.length}</div>
    <div>Atualizados: <span id="bp-updated">0</span></div>
    <div style="color:#ff6688">Erros: <span id="bp-errors">0</span></div>
    <progress id="bp-progress" value="0" max="${games.length}" style="width:100%;margin-top:.5rem"></progress>
    <button id="bp-stop" class="btn btn-danger" style="margin-top:.5rem;width:100%">Parar</button>
  `;
  document.body.appendChild(progress);

  let stop = false;
  document.getElementById("bp-stop").onclick = () => { stop = true; };

  for (const game of games) {
    if (stop) break;
    try {
      const searchUrl = `https://api.rawg.io/api/games?key=${key}&search=${encodeURIComponent(game.title)}&page_size=1`;
      const searchRes = await fetch(searchUrl);
      if (!searchRes.ok) throw new Error(`HTTP ${searchRes.status}`);
      const searchData = await searchRes.json();

      if (!searchData.results?.length) { errors++; continue; }

      const found = searchData.results[0];
      const gameId = found.id;
      const coverUrl = found.background_image || "";

      const [detailData, screensData] = await Promise.all([
        fetch(`https://api.rawg.io/api/games/${gameId}?key=${key}`).then(r => r.json()),
        fetch(`https://api.rawg.io/api/games/${gameId}/screenshots?key=${key}`).then(r => r.json()),
      ]);

      let changed = false;
      if (coverUrl && coverUrl !== game.cover) { game.cover = coverUrl; changed = true; }

      if (detailData.description_raw && detailData.description_raw !== game.description) {
        game.description = detailData.description_raw.length > 500
          ? detailData.description_raw.slice(0, 500) + "..."
          : detailData.description_raw;
        changed = true;
      }

      const screenshots = (screensData.results || []).map(s => s.image).filter(Boolean).slice(0, 3);
      const currentImages = (game.images || []).join("\n");
      const newImages = screenshots.join("\n");
      if (newImages && newImages !== currentImages) { game.images = screenshots; changed = true; }

      if (changed) updated++;

    } catch (e) {
      errors++;
      console.warn("Erro em", game.title, e);
    }

    done++;
    document.getElementById("bp-done").textContent = done;
    document.getElementById("bp-updated").textContent = updated;
    document.getElementById("bp-errors").textContent = errors;
    document.getElementById("bp-progress").value = done;

    await new Promise(r => setTimeout(r, 300));
  }

  if (updated) saveToStorage();
  render();
  progress.remove();
  alert(`Concluído! Atualizados: ${updated}, Erros: ${errors}`);
}

window.batchAutofillAllGames = batchAutofillAllGames;

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function escapeAttr(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

searchEl.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  render();
});

genreFilterEl.addEventListener("input", () => {
  populateGenreSelect(genreFilterEl.value, genreSelectEl.value);
});

document.getElementById("global-add-btn").addEventListener("click", () => {
  openGameModal("add");
});

document.getElementById("btn-batch-autofill").addEventListener("click", () => {
  if (confirm("Tem certeza que deseja preencher automaticamente todos os jogos via RAWG? Esta ação substituirá as descrições atuais.")) {
    batchAutofillAllGames();
  }
});
document.getElementById("btn-export").addEventListener("click", exportData);
document.getElementById("btn-import").addEventListener("click", importData);

document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

document.getElementById("btn-add-genre").addEventListener("click", () => {
  document.getElementById("btn-add-genre").hidden = true;
  document.getElementById("genre-add-inline").hidden = false;
  document.getElementById("genre-new-name").focus();
});

document.getElementById("btn-cancel-genre").addEventListener("click", () => {
  document.getElementById("genre-add-inline").hidden = true;
  document.getElementById("btn-add-genre").hidden = false;
  document.getElementById("genre-new-name").value = "";
});

document.getElementById("genre-new-name").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("btn-confirm-genre").click();
  }
});

document.getElementById("btn-confirm-genre").addEventListener("click", () => {
  const input = document.getElementById("genre-new-name");
  addNewGenre(input.value);
  input.value = "";
  document.getElementById("genre-add-inline").hidden = true;
  document.getElementById("btn-add-genre").hidden = false;
});

document.getElementById("filter-select").addEventListener("change", (e) => {
  filterValue = e.target.value;
  render();
});

const scrollTopBtn = document.getElementById("scroll-top");
window.addEventListener("scroll", () => {
  scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
});
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

catalogEl.addEventListener("click", (e) => {
  const genreTitle = e.target.closest(".genre-title");
  if (genreTitle) {
    const section = genreTitle.closest(".genre-section");
    if (section) section.classList.toggle("collapsed");
    return;
  }

  const deleteBtn = e.target.closest("[data-delete]");
  if (deleteBtn) {
    e.stopPropagation();
    deleteGame(deleteBtn.dataset.delete);
    return;
  }

  const addBtn = e.target.closest("[data-add-genre]");
  if (addBtn) {
    openGameModal("add", addBtn.dataset.addGenre);
    return;
  }

  const card = e.target.closest(".game-card");
  if (card) {
    const game = catalog.games.find((g) => g.id === card.dataset.id);
    if (game) openDetail(game);
  }
});

detailDelete.addEventListener("click", () => {
  if (selectedGameId) deleteGame(selectedGameId);
});

detailEdit.addEventListener("click", () => {
  if (selectedGameId) openGameModal("edit");
});

detailGallery.addEventListener("click", (e) => {
  const img = e.target.closest(".gallery-item img");
  if (img) {
    const items = detailGallery.querySelectorAll(".gallery-item img");
    const index = Array.from(items).indexOf(img);
    openLightbox(img.src, index >= 0 ? index : 0);
  }
});

gameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveGameFromForm();
});

document.getElementById("btn-autofill").addEventListener("click", autofillFromRAWG);

document.getElementById("lightbox-modal").addEventListener("click", (e) => {
  if (e.target === e.currentTarget || e.target.classList.contains("modal-close")) {
    e.currentTarget.close();
  }
});

document.getElementById("lightbox-prev").addEventListener("click", () => navigateLightbox(-1));
document.getElementById("lightbox-next").addEventListener("click", () => navigateLightbox(1));

document.getElementById("lightbox-modal").addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") { e.preventDefault(); navigateLightbox(-1); }
  if (e.key === "ArrowRight") { e.preventDefault(); navigateLightbox(1); }
});

document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.closest("dialog")?.close();
  });
});

detailModal.addEventListener("click", (e) => {
  if (e.target === detailModal) detailModal.close();
});

gameModal.addEventListener("click", (e) => {
  if (e.target === gameModal) gameModal.close();
});

init();
