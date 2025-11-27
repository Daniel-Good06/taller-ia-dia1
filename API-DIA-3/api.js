// Ejercicio: consumo de Apis con fetch
// Objetivo: buscar un pokemon con pokeapi y mostrar su nombre en consola

// Función para obtener datos del pokemon desde la API
async function obtenerPokemonApi(nombrePokemon) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon.toLowerCase()}`);

        if (!response.ok) {
            throw new Error(`No se pudo encontrar el pokemon: ${nombrePokemon}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener el pokemon:", error);
        throw error;
    }
}

// Función para mostrar el pokemon en la tarjeta
function mostrarPokemon(data) {
    // Mostrar la tarjeta
    const card = document.getElementById('pokemonCard');
    card.classList.add('show');

    // Imagen
    const imagen = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
    document.getElementById('pokemonImage').src = imagen;

    // Nombre e ID
    document.getElementById('pokemonName').textContent = data.name;
    document.getElementById('pokemonId').textContent = `#${String(data.id).padStart(3, '0')}`;

    // Tipos
    const typesContainer = document.getElementById('pokemonTypes');
    typesContainer.innerHTML = '';
    data.types.forEach(typeInfo => {
        const typeBadge = document.createElement('span');
        typeBadge.className = `type-badge type-${typeInfo.type.name}`;
        typeBadge.textContent = typeInfo.type.name;
        typesContainer.appendChild(typeBadge);
    });

    // Información básica
    document.getElementById('pokemonHeight').textContent = `${data.height / 10} m`;
    document.getElementById('pokemonWeight').textContent = `${data.weight / 10} kg`;
    document.getElementById('pokemonExp').textContent = data.base_experience;

    // Habilidades
    const abilities = data.abilities.map(a => a.ability.name).join(', ');
    document.getElementById('pokemonAbilities').textContent = abilities;

    // Estadísticas
    const statsContainer = document.getElementById('pokemonStats');
    statsContainer.innerHTML = '<h3 style="margin-bottom: 1rem; color: #333;">Estadísticas</h3>';

    data.stats.forEach(statInfo => {
        const statRow = document.createElement('div');
        statRow.className = 'stat-row';

        const statName = document.createElement('div');
        statName.className = 'stat-name';
        statName.textContent = statInfo.stat.name.replace('-', ' ');

        const statBarContainer = document.createElement('div');
        statBarContainer.className = 'stat-bar-container';

        const statBar = document.createElement('div');
        statBar.className = 'stat-bar';
        // Calcular porcentaje (máximo stat típico es 255)
        const percentage = (statInfo.base_stat / 255) * 100;
        setTimeout(() => {
            statBar.style.width = `${percentage}%`;
        }, 100);

        const statValue = document.createElement('div');
        statValue.className = 'stat-value';
        statValue.textContent = statInfo.base_stat;

        statBarContainer.appendChild(statBar);
        statRow.appendChild(statName);
        statRow.appendChild(statBarContainer);
        statRow.appendChild(statValue);
        statsContainer.appendChild(statRow);
    });
}

// Función para mostrar error
function mostrarError(mensaje) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = mensaje;
    errorDiv.classList.add('show');

    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 3000);
}

// Función para mostrar/ocultar loading
function toggleLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.add('show');
    } else {
        loading.classList.remove('show');
    }
}

// Función principal de búsqueda
async function buscarPokemon() {
    const input = document.getElementById('pokemonInput');
    const nombrePokemon = input.value.trim();

    if (!nombrePokemon) {
        mostrarError('Por favor, ingresa el nombre de un pokemon');
        return;
    }

    try {
        toggleLoading(true);
        document.getElementById('pokemonCard').classList.remove('show');

        const data = await obtenerPokemonApi(nombrePokemon);
        mostrarPokemon(data);

        toggleLoading(false);
    } catch (error) {
        toggleLoading(false);
        mostrarError(`No se encontró el pokemon "${nombrePokemon}". Intenta con otro nombre.`);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const input = document.getElementById('pokemonInput');

    searchBtn.addEventListener('click', buscarPokemon);

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            buscarPokemon();
        }
    });

    // Buscar un pokemon por defecto al cargar
    setTimeout(() => {
        document.getElementById('pokemonInput').value = 'pikachu';
        buscarPokemon();
    }, 500);
});
