// Google Books API Configuration
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
const MAX_RESULTS = 24;

// State Management
let currentBooks = [];
let currentSearchTerm = '';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const booksGrid = document.getElementById('booksGrid');
const loading = document.getElementById('loading');
const noResults = document.getElementById('noResults');
const resultsInfo = document.getElementById('resultsInfo');
const bookModal = document.getElementById('bookModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');
const backgroundOverlay = document.getElementById('backgroundOverlay');

// Search Books Function
async function searchBooks(query) {
    if (!query.trim()) {
        showMessage('Por favor ingresa un término de búsqueda', 'warning');
        return;
    }

    currentSearchTerm = query;
    showLoading();
    hideNoResults();
    hideResultsInfo();

    try {
        const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${MAX_RESULTS}&printType=books&langRestrict=es`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error al buscar libros');
        }

        const data = await response.json();

        hideLoading();

        if (data.items && data.items.length > 0) {
            currentBooks = data.items;
            displayBooks(data.items);
            showResultsInfo(data.totalItems, query);

            // Update background with the first book's cover
            if (data.items[0].volumeInfo.imageLinks) {
                updateBackgroundWithImage(data.items[0].volumeInfo);
            } else {
                changeBackground(query); // Fallback to gradient
            }
        } else {
            showNoResults();
        }
    } catch (error) {
        console.error('Error:', error);
        hideLoading();
        showMessage('Ocurrió un error al buscar libros. Intenta nuevamente.', 'error');
    }
}

// Helper to get high resolution image URL
function getHighResImage(imageLinks) {
    if (!imageLinks) return 'https://via.placeholder.com/300x450/1a1a2e/d4af37?text=Sin+Portada';

    // Prefer extraLarge, then large, then medium, then small, then thumbnail
    let url = imageLinks.extraLarge || imageLinks.large || imageLinks.medium || imageLinks.thumbnail || imageLinks.smallThumbnail;

    if (!url) return 'https://via.placeholder.com/300x450/1a1a2e/d4af37?text=Sin+Portada';

    // Force HTTPS
    url = url.replace('http://', 'https://');

    // Try to remove zoom parameter or set it to 0 for better quality if it's a Google Books URL
    if (url.includes('books.google.com')) {
        url = url.replace('&edge=curl', '');
        url = url.replace('zoom=1', 'zoom=0');
    }

    return url;
}

// Display Books in Grid
function displayBooks(books) {
    booksGrid.innerHTML = '';

    books.forEach((book, index) => {
        const bookInfo = book.volumeInfo;
        const bookCard = createBookCard(bookInfo, index);
        booksGrid.appendChild(bookCard);
    });

    // Add stagger animation
    const cards = document.querySelectorAll('.book-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.05}s`;
    });
}

// Create Book Card Element
function createBookCard(book, index) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.setAttribute('data-index', index);

    const highQualityImage = getHighResImage(book.imageLinks);

    const title = book.title || 'Título no disponible';
    const authors = book.authors?.join(', ') || 'Autor desconocido';
    const publishedDate = book.publishedDate ? new Date(book.publishedDate).getFullYear() : 'Año desconocido';
    const rating = book.averageRating || 'N/A';
    const categories = book.categories?.slice(0, 2).join(', ') || 'General';

    card.innerHTML = `
        <div class="book-cover-container">
            <img src="${highQualityImage}" alt="${title}" class="book-cover" loading="lazy">
            <div class="book-overlay">
                <button class="view-details-btn">Ver Detalles</button>
            </div>
        </div>
        <div class="book-info">
            <h3 class="book-title">${truncateText(title, 50)}</h3>
            <p class="book-author">${truncateText(authors, 40)}</p>
            <div class="book-meta">
                <span class="book-year">📅 ${publishedDate}</span>
                ${rating !== 'N/A' ? `<span class="book-rating">⭐ ${rating}</span>` : ''}
            </div>
            <div class="book-category">${categories}</div>
        </div>
    `;

    card.addEventListener('click', () => openBookModal(currentBooks[index]));

    return card;
}

// Open Book Detail Modal
function openBookModal(book) {
    const bookInfo = book.volumeInfo;
    const accessInfo = book.accessInfo;

    const highQualityImage = getHighResImage(bookInfo.imageLinks);

    const title = bookInfo.title || 'Título no disponible';
    const authors = bookInfo.authors?.join(', ') || 'Autor desconocido';
    const publishedDate = bookInfo.publishedDate || 'Fecha desconocida';
    const publisher = bookInfo.publisher || 'Editorial desconocida';
    const description = bookInfo.description || 'No hay descripción disponible.';
    const pageCount = bookInfo.pageCount || 'N/A';
    const categories = bookInfo.categories?.join(', ') || 'General';
    const rating = bookInfo.averageRating || 'N/A';
    const ratingsCount = bookInfo.ratingsCount || 0;
    const language = bookInfo.language === 'es' ? 'Español' : bookInfo.language === 'en' ? 'Inglés' : bookInfo.language?.toUpperCase() || 'N/A';
    const isbn = bookInfo.industryIdentifiers?.[0]?.identifier || 'N/A';

    // Reading Links
    const previewLink = bookInfo.previewLink;
    const infoLink = bookInfo.infoLink;
    const buyLink = accessInfo.webReaderLink || book.saleInfo?.buyLink;

    modalBody.innerHTML = `
        <div class="modal-grid">
            <div class="modal-image-section">
                <img src="${highQualityImage}" alt="${title}" class="modal-book-cover">
                <div class="modal-actions">
                    ${previewLink ? `<a href="${previewLink}" target="_blank" class="modal-btn preview-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                        Vista Previa
                    </a>` : ''}
                    ${infoLink ? `<a href="${infoLink}" target="_blank" class="modal-btn info-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        Más Info
                    </a>` : ''}
                    ${buyLink ? `<a href="${buyLink}" target="_blank" class="modal-btn buy-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Leer Ahora
                    </a>` : ''}
                </div>
            </div>
            <div class="modal-info-section">
                <h2 class="modal-title">${title}</h2>
                <p class="modal-author">por ${authors}</p>
                
                <div class="modal-meta-grid">
                    <div class="meta-item">
                        <span class="meta-label">📅 Publicación</span>
                        <span class="meta-value">${publishedDate}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">📚 Editorial</span>
                        <span class="meta-value">${publisher}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">📖 Páginas</span>
                        <span class="meta-value">${pageCount}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">🌐 Idioma</span>
                        <span class="meta-value">${language}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">🏷️ ISBN</span>
                        <span class="meta-value">${isbn}</span>
                    </div>
                    ${rating !== 'N/A' ? `
                    <div class="meta-item">
                        <span class="meta-label">⭐ Valoración</span>
                        <span class="meta-value">${rating}/5 (${ratingsCount} reseñas)</span>
                    </div>
                    ` : ''}
                </div>

                <div class="modal-categories">
                    <span class="category-label">Categorías:</span>
                    <span class="category-value">${categories}</span>
                </div>

                <div class="modal-description">
                    <h3>Descripción</h3>
                    <p>${description}</p>
                </div>
            </div>
        </div>
    `;

    bookModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    bookModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Update background using the book cover image
function updateBackgroundWithImage(bookInfo) {
    // Try to get the largest image possible for the background
    let imageUrl = bookInfo.imageLinks?.extraLarge ||
        bookInfo.imageLinks?.large ||
        bookInfo.imageLinks?.medium ||
        bookInfo.imageLinks?.thumbnail;

    if (!imageUrl) {
        changeBackground(currentSearchTerm);
        return;
    }

    // Force HTTPS and higher resolution
    imageUrl = imageUrl.replace('http://', 'https://')
        .replace('&edge=curl', '')
        .replace('zoom=1', 'zoom=3'); // Try zoom=3 for background

    // Create a new image object to load it first
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
        // Add a dark overlay on top of the image using linear-gradient
        // Reduced opacity to make the image more visible
        backgroundOverlay.style.background = `
            linear-gradient(to bottom, rgba(15, 15, 30, 0.7), rgba(15, 15, 30, 0.85)),
            url('${imageUrl}')
        `;
        backgroundOverlay.style.backgroundSize = 'cover';
        backgroundOverlay.style.backgroundPosition = 'center center';
        backgroundOverlay.style.backgroundRepeat = 'no-repeat';
        backgroundOverlay.style.backgroundAttachment = 'fixed'; // Parallax-like effect
    };

    img.onerror = () => {
        // Fallback to gradient if image fails to load
        console.warn('Failed to load background image, falling back to gradient');
        changeBackground(currentSearchTerm);
    };
}

// Change Background Based on Search (Fallback)
function changeBackground(query) {
    // Create a thematic gradient based on search term
    const themes = {
        'ficción': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'ciencia': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'historia': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'arte': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'tecnología': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'fantasía': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'romance': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'terror': 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)',
        'biografía': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'cocina': 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
    };

    let gradient = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';

    for (const [key, value] of Object.entries(themes)) {
        if (query.toLowerCase().includes(key)) {
            gradient = value;
            break;
        }
    }

    backgroundOverlay.style.background = gradient;
}

// Utility Functions
function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function showLoading() {
    loading.style.display = 'flex';
    booksGrid.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
    booksGrid.style.display = 'grid';
}

function showNoResults() {
    noResults.style.display = 'flex';
    booksGrid.style.display = 'none';
}

function hideNoResults() {
    noResults.style.display = 'none';
}

function showResultsInfo(total, query) {
    resultsInfo.textContent = `Se encontraron ${total.toLocaleString()} resultados para "${query}"`;
    resultsInfo.style.display = 'block';
}

function hideResultsInfo() {
    resultsInfo.style.display = 'none';
}

function showMessage(message, type = 'info') {
    // Simple alert for now - can be enhanced with custom toast notifications
    alert(message);
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchBooks(query);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            searchBooks(query);
        }
    }
});

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookModal.classList.contains('active')) {
        closeModal();
    }
});

// Initial Load - Show popular books
window.addEventListener('DOMContentLoaded', () => {
    searchBooks('bestsellers');
});
