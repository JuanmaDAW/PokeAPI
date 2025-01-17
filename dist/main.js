"use strict";
// Variables
let previous = document.querySelector("#previous");
let next = document.querySelector("#next");
let page = 0;
let linkAPI = `https://pokeapi.co/api/v2/pokemon?limit=15&offset=${page}`;
const container = document.getElementById("container-pkmn");
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
    }
    else {
        previous.classList.remove("disabled");
    }
}
const fetchPokemons = async () => {
    try {
        container.innerHTML = "";
        // Elemento temporal de código
        const fragment = document.createDocumentFragment();
        const response = await fetch(linkAPI);
        const data = await response.json();
        for (const pokemon of data.results) {
            const card = document.createElement("div");
            // Añado las clases propias de las Cards de Bootstrap
            card.classList.add("card", "d-flex", "flex-colums", "justify-content-center", "align-items-center", "p-3");
            card.textContent = pokemon.name;
            card.dataset.url = pokemon.url;
            fragment.appendChild(card);
            try {
                const detailsResponse = await fetch(pokemon.url);
                const pokemonData = await detailsResponse.json();
                const id = document.createElement("p");
                id.classList.add("id", "bg-dark", "text-light", "px-2", "py-1", "rounded-pill");
                id.textContent = "#" + pokemonData.id.toString().padStart(3, "0");
                const image = document.createElement("img");
                image.classList.add("image", "rounded-pill");
                image.src = pokemonData.sprites.front_default;
                const name = document.createElement("h3");
                name.classList.add("name", "text-light", "fs-6", "fw-bold");
                name.textContent = pokemonData.name;
                const contTypes = document.createElement("div");
                contTypes.classList.add("cont-types", "d-flex", "gap-1");
                const type1 = document.createElement("div");
                const typeName1 = pokemonData.types[0].type.name;
                type1.textContent = typeName1;
                type1.classList.add(typeName1, "types", "py-0", "px-3", "rounded-pill", "text-light");
                contTypes.appendChild(type1);
                if (pokemonData.types.length > 1) {
                    const type2 = document.createElement("div");
                    const typeName2 = pokemonData.types[1].type.name;
                    type2.textContent = typeName2;
                    type2.classList.add(typeName2, "types", "py-0", "px-3", "rounded-pill", "text-light");
                    contTypes.appendChild(type2);
                }
                card.innerHTML = "";
                card.appendChild(id);
                card.appendChild(image);
                card.appendChild(name);
                card.appendChild(contTypes);
            }
            catch (error) {
                console.error("Error:", error);
            }
        }
        container.appendChild(fragment);
        cardsModal();
    }
    catch (error) {
        console.error("Error:", error);
    }
};
fetchPokemons();
// Crear Cartas para el Modal
function cardsModal() {
    let cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        card.addEventListener("click", async () => {
            const pokemonUrl = card.dataset.url;
            if (!pokemonUrl)
                return;
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
                const abilities = pokemonData.abilities.map((ability) => ability.ability.name);
                const stats = pokemonData.stats.map((stat) => `${stat.stat.name}: ${stat.base_stat} <div class="bar" style="width:${stat.base_stat * 1.2}px;"></div>`);
                modal.innerHTML = `
          <div class="personal-info d-flex flex-column text-light pb-2">
            <div class="close">x</div>
            <div class="modal-id bg-dark text-light rounded-pill my-2">#${id.toString().padStart(3, "0")}</div>
            <div class="modal-name text-light fs-4">${name}</div>
            <img class="modal-img" src="${image}" alt="${name}" />
            <p class="size">Weight: ${weight} kg / Height: ${height} m</p>
            <h2 class="modal-abilities">Abilities:</h2>
            <p class="abilities-ul">
              ${abilities.map((ability) => `${ability}`).join(" / ")}
            </p>
          </div>

          <div class="attributes">
            <h2 class="modal-stats">Stats</h2>
            <ul class="stats-ul">
              ${stats.map((stat) => `<li>${stat}</li>`).join("")}
            </ul>
          </div>
        `;
                modal.style.display = "flex";
                // Cerrar el modal
                let modalClose = document.querySelector(".close");
                modalClose.addEventListener("click", () => {
                    modal.style.display = "none";
                });
            }
            catch (error) {
                console.error("Error al obtener los detalles del Pokémon:", error);
            }
        });
    });
}
