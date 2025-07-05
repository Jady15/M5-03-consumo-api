// Implementa las Solicitudes con Fetch
const fetchBtn = document.getElementById('fetch-btn');
const axiosBtn = document.getElementById('axios-btn');
const dataContainer = document.getElementById('data-container');

// Solicitud con fetch
fetchBtn.addEventListener('click', async () => {
    dataContainer.innerHTML = '<p>Cargando...</p>';
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();
        // Obtener detalles de cada Pokémon
        const pokemonDetails = await Promise.all(
            data.results.map(async (pokemon) => {
                const res = await fetch(pokemon.url);
                if (!res.ok) throw new Error(`Error al obtener datos de ${pokemon.name}`);
                return res.json();
            })
        );
        renderPokemon(pokemonDetails);
    } catch (error) {
        console.error('Error:', error);
        dataContainer.innerHTML = '<p class="error">Hubo un error al obtener los datos.</p>';
    }
});

// Solicitud con Axios
axiosBtn.addEventListener('click', async () => {
    dataContainer.innerHTML = '<p>Cargando...</p>';
    try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=20');
        // Obtener detalles de cada Pokémon
        const pokemonDetails = await Promise.all(
            response.data.results.map(async (pokemon) => {
                const res = await axios.get(pokemon.url);
                return res.data;
            })
        );
        renderPokemon(pokemonDetails);
    } catch (error) {
        console.error('Error:', error);
        dataContainer.innerHTML = '<p class="error">Hubo un error al obtener los datos.</p>';
    }
});

// Función para renderizar la lista en la interfaz
function renderPokemon(pokemonList) {
    dataContainer.innerHTML = '';
    pokemonList.forEach(pokemon => {
        const pokemonElement = document.createElement('div');
        pokemonElement.classList.add('pokemon-card');
        pokemonElement.innerHTML = `
            <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p>Tipo: ${pokemon.types[0].type.name.charAt(0).toUpperCase() + pokemon.types[0].type.name.slice(1)}</p>
        `;
        dataContainer.appendChild(pokemonElement);
    });
}