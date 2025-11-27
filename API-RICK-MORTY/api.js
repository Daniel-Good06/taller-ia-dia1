// Función para obtener datos de la API de Rick and Morty
async function RickMorty(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Imprimir los nombres de los personajes en consola
        if (data.results && Array.isArray(data.results)) {
            console.log("=== Personajes de Rick and Morty ===");
            data.results.forEach((character, index) => {
                console.log(`${index + 1}. ${character.name}`);
            });
        } else if (data.name) {
            console.log(`Personaje: ${data.name}`);
        }

        return data;

    } catch (error) {
        console.error("Error al obtener datos:", error);
        return null;
    }
}

// Variables globales
let currentPage = 1;
let currentFilter = 'all';
let searchQuery = '';

// Traducciones al español
const translations = {
    status: {
        'Alive': 'Vivo',
        'Dead': 'Muerto',
        'unknown': 'Desconocido'
    },
    gender: {
        'Male': 'Masculino',
        'Female': 'Femenino',
        'Genderless': 'Sin género',
        'unknown': 'Desconocido'
    },
    species: {
        'Human': 'Humano',
        'Alien': 'Alienígena',
        'Humanoid': 'Humanoide',
        'Robot': 'Robot',
        'Cronenberg': 'Cronenberg',
        'Disease': 'Enfermedad',
        'Animal': 'Animal',
        'Poopybutthole': 'Poopybutthole',
        'Mythological Creature': 'Criatura Mitológica',
        'unknown': 'Desconocido'
    }
};

// Función para traducir texto
function translate(category, text) {
    return translations[category]?.[text] || text;
}

// Función para formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

// Función para crear una tarjeta de personaje
function createCharacterCard(character) {
    const card = document.createElement('div');
    card.className = 'character-card';

    const statusClass = character.status.toLowerCase();
    const statusTranslated = translate('status', character.status);
    const genderTranslated = translate('gender', character.gender);
    const speciesTranslated = translate('species', character.species);

    // Extraer ID del personaje de la URL
    const characterId = character.url.split('/').filter(Boolean).pop();

    card.innerHTML = `
        <img src="${character.image}" alt="${character.name}" class="card-image">
        <div class="card-content">
            <div class="card-header">
                <h2 class="card-name">${character.name}</h2>
                <span class="card-status status-${statusClass}">
                    <span class="status-dot"></span>
                    ${statusTranslated}
                </span>
            </div>
            <div class="card-info">
                <div class="info-item">
                    <span class="info-label">🆔 ID:</span>
                    <span class="info-value">#${characterId}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">👽 Especie:</span>
                    <span class="info-value">${speciesTranslated}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">⚧ Género:</span>
                    <span class="info-value">${genderTranslated}</span>
                </div>
                ${character.type ? `
                <div class="info-item">
                    <span class="info-label">🏷️ Tipo:</span>
                    <span class="info-value">${character.type}</span>
                </div>
                ` : ''}
                <div class="info-item">
                    <span class="info-label">🌍 Origen:</span>
                    <span class="info-value">${character.origin.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">📍 Ubicación Actual:</span>
                    <span class="info-value">${character.location.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">📺 Episodios:</span>
                    <span class="info-value">${character.episode.length} apariciones</span>
                </div>
                <div class="info-item">
                    <span class="info-label">📅 Creado:</span>
                    <span class="info-value">${formatDate(character.created)}</span>
                </div>
            </div>
        </div>
    `;

    // Add click event to open modal
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openCharacterModal(character));

    return card;
}

// Función para mostrar el loading
function showLoading() {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Cargando personajes...</p>
        </div>
    `;
}

// Función para cargar y mostrar personajes
async function loadCharacters(page = 1, status = '', name = '') {
    showLoading();

    let url = `https://rickandmortyapi.com/api/character?page=${page}`;

    if (status && status !== 'all') {
        url += `&status=${status}`;
    }

    if (name) {
        url += `&name=${name}`;
    }

    const data = await RickMorty(url);

    const container = document.getElementById('cardsContainer');
    container.innerHTML = '';

    if (data && data.results) {
        data.results.forEach(character => {
            const card = createCharacterCard(character);
            container.appendChild(card);
        });

        // Actualizar paginación
        updatePagination(data.info);
    } else {
        container.innerHTML = `
            <div class="loading">
                <p>No se encontraron personajes</p>
            </div>
        `;
    }
}

// Función para actualizar la paginación
function updatePagination(info) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (!info) return;

    const totalPages = info.pages;

    // Botón anterior
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.textContent = '← Anterior';
    prevBtn.disabled = !info.prev;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            loadCharacters(currentPage, currentFilter, searchQuery);
        }
    };
    pagination.appendChild(prevBtn);

    // Números de página
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => {
            currentPage = i;
            loadCharacters(currentPage, currentFilter, searchQuery);
        };
        pagination.appendChild(pageBtn);
    }

    // Botón siguiente
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.textContent = 'Siguiente →';
    nextBtn.disabled = !info.next;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadCharacters(currentPage, currentFilter, searchQuery);
        }
    };
    pagination.appendChild(nextBtn);
}

// Función para abrir el modal con detalles del personaje
function openCharacterModal(character) {
    const modal = document.getElementById('characterModal');
    const modalBody = document.getElementById('modalBody');

    const statusClass = character.status.toLowerCase();
    const statusTranslated = translate('status', character.status);
    const genderTranslated = translate('gender', character.gender);
    const speciesTranslated = translate('species', character.species);
    const characterId = character.url.split('/').filter(Boolean).pop();

    modalBody.innerHTML = `
        <div class="modal-image-container">
            <img src="${character.image}" alt="${character.name}" class="modal-image">
            <div class="modal-status-badge status-${statusClass}">
                <span class="status-dot"></span>
                ${statusTranslated}
            </div>
        </div>
        <div class="modal-info">
            <h2 class="modal-title">${character.name}</h2>
            <p class="modal-subtitle">${speciesTranslated} - ${genderTranslated}</p>
            
            <div class="modal-details">
                <div class="modal-detail-item">
                    <div class="modal-detail-label">🆔 ID del Personaje</div>
                    <div class="modal-detail-value">#${characterId}</div>
                </div>
                <div class="modal-detail-item">
                    <div class="modal-detail-label">👽 Especie</div>
                    <div class="modal-detail-value">${speciesTranslated}</div>
                </div>
                <div class="modal-detail-item">
                    <div class="modal-detail-label">⚧ Género</div>
                    <div class="modal-detail-value">${genderTranslated}</div>
                </div>
                <div class="modal-detail-item">
                    <div class="modal-detail-label">💚 Estado</div>
                    <div class="modal-detail-value">${statusTranslated}</div>
                </div>
                ${character.type ? `
                <div class="modal-detail-item">
                    <div class="modal-detail-label">🏷️ Tipo</div>
                    <div class="modal-detail-value">${character.type}</div>
                </div>
                ` : ''}
                <div class="modal-detail-item">
                    <div class="modal-detail-label">🌍 Planeta de Origen</div>
                    <div class="modal-detail-value">${character.origin.name}</div>
                </div>
                <div class="modal-detail-item">
                    <div class="modal-detail-label">📍 Última Ubicación</div>
                    <div class="modal-detail-value">${character.location.name}</div>
                </div>
                <div class="modal-detail-item">
                    <div class="modal-detail-label">📅 Fecha de Creación</div>
                    <div class="modal-detail-value">${formatDate(character.created)}</div>
                </div>
            </div>
            
            <div class="modal-episodes">
                <div class="modal-episodes-title">
                    📺 Apariciones en Episodios
                    <span class="modal-episodes-count">${character.episode.length} episodios</span>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('characterModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Cargar personajes iniciales
    loadCharacters();

    // Búsqueda
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    searchBtn.addEventListener('click', () => {
        searchQuery = searchInput.value.trim();
        currentPage = 1;
        loadCharacters(currentPage, currentFilter, searchQuery);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchQuery = searchInput.value.trim();
            currentPage = 1;
            loadCharacters(currentPage, currentFilter, searchQuery);
        }
    });

    // Filtros
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentFilter = btn.dataset.filter;
            currentPage = 1;
            loadCharacters(currentPage, currentFilter, searchQuery);
        });
    });

    // Modal close events
    const modalClose = document.getElementById('modalClose');
    const modal = document.getElementById('characterModal');

    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});
