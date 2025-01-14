// Interfaz
interface Pokemon {
  count: number;
  next: string;
  previous: string | null;
  results: Result[];
}

interface Result {
  name: string;
  url: string;
}


// Variables
let previous = document.querySelector("#previous") as HTMLLIElement;
let next = document.querySelector("#next") as HTMLLIElement;
let page: number = 0;

let linkAPI: string = `https://pokeapi.co/api/v2/pokemon?limit=15&offset=${page}`;
const container = document.getElementById("container-pkmn") as HTMLDivElement;

// Variable global para pre-carga
let nextPageData: Pokemon | null = null;
 
let modal = document.createElement("div");
modal.classList.add("modal");
document.body.appendChild(modal);

// EVENTOS
previous.addEventListener("click", () => {
  if (page === 0) {
    return;
  }
  modal.style.display = "none";
  page -= 15;
  linkAPI = `https://pokeapi.co/api/v2/pokemon?limit=15&offset=${page}`;
  fetchPokemons();
  hideNextPrev();
});

next.addEventListener("click", () => {
  modal.style.display = "none";
  page += 15;
  linkAPI = `https://pokeapi.co/api/v2/pokemon?limit=15&offset=${page}`;
  fetchPokemons();
  hideNextPrev();
});

function hideNextPrev() {
  if (page == 0) {
    previous.classList.add("disabled");
  } else {
    previous.classList.remove("disabled");
  }
}

const fetchPokemons = async () => {
  try {
    
    container.innerHTML = "";
    const fragment = document.createDocumentFragment();

    const response = await fetch(linkAPI);
    const data: Pokemon = await response.json();

    for (const pokemon of data.results) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.textContent = pokemon.name;
      card.dataset.url = pokemon.url;
      fragment.appendChild(card);

      try {
        const detailsResponse = await fetch(pokemon.url);
        const pokemonData = await detailsResponse.json();

        const id = document.createElement("p");
        id.classList.add("id");
        id.textContent = "#" + pokemonData.id.toString().padStart(3, "0");

        const image = document.createElement("img");
        image.classList.add("image");
        image.src = pokemonData.sprites.front_default;

        const name = document.createElement("h3");
        name.classList.add("name", "text-light");
        name.textContent = pokemonData.name;

        const contTypes = document.createElement("div");
        contTypes.classList.add("cont-types");

        const type1 = document.createElement("div");
        const typeName1 = pokemonData.types[0].type.name;
        type1.textContent = typeName1;
        type1.classList.add(typeName1);
        type1.classList.add("types");
        type1.classList.add("py-0");
        contTypes.appendChild(type1);

        if (pokemonData.types.length > 1) {
          const type2 = document.createElement("div");
          const typeName2 = pokemonData.types[1].type.name;
          type2.textContent = typeName2;
          type2.classList.add(typeName2);
          type2.classList.add("types");
          type2.classList.add("py-0");
          contTypes.appendChild(type2);
        }

        card.innerHTML = "";
        card.appendChild(id);
        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(contTypes);
      } catch (error) {
        console.error("Error al cargar detalles del Pokémon:", error);
      }
    }

    container.appendChild(fragment);
    cardsModal(); 

  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
};

fetchPokemons(); 

// Crear Cartas para el Modal
function cardsModal() {
  let cards = document.querySelectorAll<HTMLElement>(".card");

  cards.forEach((card) => {
    card.addEventListener("click", async () => {
      const pokemonUrl = card.dataset.url;
      if (!pokemonUrl) return;

      try {
        const response = await fetch(pokemonUrl);
        const pokemonData = await response.json();

        const id = pokemonData.id;
        const name = pokemonData.name;
        const image = pokemonData.sprites.other["official-artwork"].front_default;

        // Convertir a kg
        const weight = pokemonData.weight / 10; 

        // Convertir a m
        const height = pokemonData.height / 10; 

        // const abilities = pokemonData.abilities.map((ability: any) => ability.ability.name);

        const abilities = pokemonData.abilities.forEach((element: any) => {
          
        });


        const stats = pokemonData.stats.map(
          (stat: any) => `${stat.stat.name}: ${stat.base_stat} <div class="bar" style="width:${stat.base_stat * 1.2}px;"></div>`
        );

        modal.innerHTML = `
          <div class="personal-info">
            <div class="close">x</div>
            <div class="modal-id">#${id.toString().padStart(3, "0")}</div>
            <div class="modal-name">${name}</div>
            <img class="modal-img" src="${image}" alt="${name}" />
            <p class="size">Weight: ${weight} kg / Height: ${height} m</p>
            <h2 class="modal-abilities">Abilities:</h2>
            <p class="abilities-ul">
              ${abilities.map((ability: Pokemon) => `${ability}`).join(" / ")}
            </p>
          </div>

          <div class="attributes">
            <h2 class="modal-stats">Stats</h2>
            <ul class="stats-ul">
              ${stats.map((stat: Pokemon) => `<li>${stat}</li>`).join("")}
            </ul>
          </div>
        `;

        modal.style.display = "flex";

        // Cerrar el modal
        let modalClose = document.querySelector(".close") as HTMLElement;
        modalClose.addEventListener("click", () => {
          modal.style.display = "none";
        });
      } catch (error) {
        console.error("Error al obtener los detalles del Pokémon:", error);
      }
    });
  });
}


