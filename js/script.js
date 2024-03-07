const pokeBox = document.querySelector('#pokeBox');
const pokeSize = 1016;

const colors = {
    fire: '#FFA07A',
    grass: '#98D2A3',
    electric: '#FFE082',
    water: '#87CEEB',
    ground: '#D2691E',  
    rock: '#D2B48C',     
    fairy: '#fceaff',
    poison: '#D8BFD8',
    bug: '#D8F8D8',
    dragon: '#97b3e6',
    psychic: '#FFB6C1',
    flying: '#ADD8E6',
    fighting: '#CD5C5C',
    normal: '#F5F5F5',
    ice: '#B0E0E6',       
    ghost: '#7b62a3',
    steel: '#B8B8D0',
    dark: '#708090'
}

const pokeTypes = Object.keys(colors);

let pokemons = [];

const fetchPokemon = async () => {
    for (let i = 1; i <= pokeSize; i++) {
        const pokemon = await getPokemon(i);
        pokemons.push(pokemon);
    }
    displayFilteredPokemon(pokemons);

}

const displayFilteredPokemon = (filteredPokemon) => {
    pokeBox.innerHTML = '';

    filteredPokemon.forEach(pokemon => {
        createPokeCard(pokemon);
    });
}

const getPokemon = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    createPokeCard(data);
    return data;
}

const createPokeCard = (poke) => {
    const pokeEl = document.createElement('div');
    pokeEl.classList.add('pokemon');

    const name = poke.name[0].toUpperCase() + poke.name.slice(1);
    const id = poke.id.toString().padStart(3, '0');

    const firstType = poke.types[0].type.name;
    pokeEl.style.backgroundColor = colors[firstType];
    const allTypes = poke.types.map(type => type.type.name);
    
    const pokeInnerHTML = `
        <div class="pokeImg">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png" alt="${name}">
        </div>

        <div class="upon">
            <span class="number">#${id}</span>
            <h2 class="name">${name}</h2>
            <span class="type">Tipo: ${allTypes.join('/')}</span>
        </div>
    `;

    pokeEl.innerHTML = pokeInnerHTML;
    pokeBox.appendChild(pokeEl);
    pokeEl.addEventListener('click', () => {
        updateNavbar(poke);
    });
}


const updateNavbar = async (pokemon) => {
    const modal = document.getElementById('modal');
    const body = document.body;
    const pokemonInfo = document.getElementById('pokemonInfo');
    const movesList = document.getElementById('movesList');
    const evolutionTree = document.getElementById('evolutionTree');
    const pokemonInfoHTML = `
    <section class="eee">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" alt="${pokemon.name}">
        <h2 class="pokeName">${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h2>
        <h3 class="type">Tipo: ${pokemon.types.map(type => type.type.name).join('/')}</h3>
        <h3 class = "pokeHeight">Altura: ${pokemon.height / 10}m</h3>
        <h3 class = "pokeWeight">Peso: ${pokemon.weight / 10}kg</h3>
    </section>
`;

    pokemonInfo.innerHTML = pokemonInfoHTML;

    const filteredAndSortedMoves = pokemon.moves
        .filter(move => move.version_group_details[0].level_learned_at > 0)
        .sort((a, b) => a.version_group_details[0].level_learned_at - b.version_group_details[0].level_learned_at);
    const movesListHTML = `
        <h3>Golpes</h3>
        <ul>
            ${filteredAndSortedMoves.map(move => `<li>${move.move.name} (Nível: ${move.version_group_details[0].level_learned_at})</li>`).join('')}
        </ul>
    `;
    movesList.innerHTML = movesListHTML;

    modal.style.display = 'block';
     body.classList.add('no-scroll')
     await fetchEvolution(pokemon.id);
     await fetchAbilities(pokemon);
     await fetchTypeAdvantages(pokemon);
    };

const closeModal = () => {
    const modal = document.getElementById('modal');
    const body = document.body;
    const evolutionTree = document.getElementById('evolutionTree');
    modal.style.display = 'none';
    body.classList.remove('no-scroll');
    evolutionTree.innerHTML = '';
};
const fetchTypeAdvantages = async (pokemon) => {
    const typeAdvantagesList = document.getElementById('typeAdvantagesList');
    typeAdvantagesList.innerHTML = '';
    const typeAdvantagesHTML = `
        <h3> Poder </h3>
        <ul>
            ${getAdvantagesAndDisadvantages(pokemon.types)}
        </ul>
    `;
    typeAdvantagesList.innerHTML = typeAdvantagesHTML;
};

const getAdvantagesAndDisadvantages = (types) => {
    const result = [];

    for (const type of types) {
        const advantages = typeAdvantages[type.type.name]?.advantages || [];
        const disadvantages = typeAdvantages[type.type.name]?.disadvantages || [];

        result.push(`<li><strong>${type.type.name}:</strong>`);
        result.push('<ul>');

        if (advantages.length > 0) {
            result.push(`<li>Vantagens contra: ${advantages.join(', ')}</li>`);
        }

        if (disadvantages.length > 0) {
            result.push(`<li>Desvantagens contra: ${disadvantages.join(', ')}</li>`);
        }

        result.push('</ul></li>');
    }

    return result.join('');
};

const typeAdvantages = {
    
    fire: {
        advantages: ['grass', 'bug', 'ice', 'steel'],
        disadvantages: ['water', 'rock', 'fire'],
    },
    grass: {
        advantages: ['water', 'ground', 'rock'],
        disadvantages: ['fire', 'grass', 'poison', 'flying', 'bug', 'steel']
    },
    electric: {
        advantages: ['water', 'flying'],
        disadvantages: ['electric', 'grass', 'dragon']
    },
    water: {
        advantages: ['fire', 'ground', 'rock'],
        disadvantages: ['water', 'grass', 'dragon']
    },
    ground: {
        advantages: ['fire', 'electric', 'poison', 'rock', 'steel'],
        disadvantages: ['grass', 'bug']
    },
    rock: {
        advantages: ['fire', 'ice', 'flying', 'bug'],
        disadvantages: ['fighting', 'ground', 'steel']
    },
    fairy: {
        advantages: ['fighting', 'dragon', 'dark'],
        disadvantages: ['fire', 'poison', 'steel']
    },
    poison: {
        advantages: ['grass', 'fairy'],
        disadvantages: ['poison', 'ground', 'rock', 'ghost']
    },
    bug: {
        advantages: ['grass', 'psychic', 'dark'],
        disadvantages: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy']
    },
    dragon: {
        advantages: ['dragon'],
        disadvantages: ['steel']
    },
    psychic: {
        advantages: ['fighting', 'poison'],
        disadvantages: ['psychic', 'steel']
    },
    flying: {
        advantages: ['grass', 'fighting', 'bug'],
        disadvantages: ['electric', 'rock', 'steel']
    },
    fighting: {
        advantages: ['normal', 'ice', 'rock', 'dark', 'steel'],
        disadvantages: ['poison', 'flying', 'psychic', 'bug', 'fairy']
    },
    normal: {
        advantages: [],
        disadvantages: ['rock', 'steel']
    },
    ice: {
        advantages: ['grass', 'ground', 'flying', 'dragon'],
        disadvantages: ['fire', 'water', 'ice', 'steel']
    },
    ghost: {
        advantages: ['psychic', 'ghost'],
        disadvantages: ['dark']
    },
    steel: {
        advantages: ['ice', 'rock', 'fairy'],
        disadvantages: ['fire', 'water', 'electric', 'steel']
    },
    dark: {
        advantages: ['psychic', 'ghost'],
        disadvantages: ['fighting', 'dark', 'fairy']
    }
   
};



const fetchAbilities = async (pokemon) => {
    const abilitiesList = document.getElementById('abilitiesList');
    abilitiesList.innerHTML = '';
    const abilitiesHTML = `
        <h3>Habilidades</h3>
        <ul>
            ${pokemon.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('')}
        </ul>
    `;
    abilitiesList.innerHTML = abilitiesHTML;
};


const fetchEvolution = async (pokemonId) => {
    const evolutionUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    const response = await fetch(evolutionUrl);
    const data = await response.json();
    const evolutionChainUrl = data.evolution_chain.url;
    const evolutionData = await fetch(evolutionChainUrl);
    const evolutionJson = await evolutionData.json();

    displayEvolution(evolutionJson.chain);
};

const displayEvolution = (evolutionChain) => {
    const evolutionList = document.getElementById('evolutionList');
    evolutionList.innerHTML = '';
    const evolutionHTML = `
        <h3>Árvore de Evolução</h3>
        <ul>
            ${displayEvolutionRecursive(evolutionChain)}
        </ul>
    `;
    evolutionList.innerHTML = evolutionHTML;
};

const displayEvolutionRecursive = (evolution) => {
    let result = `<li>${evolution.species.name}`;

    if (evolution.evolution_details.length > 0) {
        const details = evolution.evolution_details[0];

        if (details.min_level) {
            result += ` (Nível: ${details.min_level})`;
        } else if (details.item) {
            result += ` (Usando ${details.item.name})`;
        }
    }
    if (evolution.evolves_to.length > 0) {
        result += `<ul>${evolution.evolves_to.map(displayEvolutionRecursive).join('')}</ul>`;
    }

    result += '</li>';
    return result;
};

// revisa isso plmds
const searchPokemon = () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const foundPokemon = pokemons.find(pokemon => (
        pokemon.name.toLowerCase().includes(searchTerm) ||
        pokemon.id.toString().includes(searchTerm)
    ));
    pokeBox.innerHTML = '';
    if (foundPokemon) {
        createPokeCard(foundPokemon);
    } else {
        displayFilteredPokemon(pokemons);
    }
};
document.querySelector('h1').addEventListener('click', function() {
    location.reload();
});



fetchPokemon();