const linkAPI = "https://pokeapi.co/api/v2/pokemon";
const container = document.getElementById('container-pkmn');
fetch(linkAPI)
    .then(response => response.json())
    .then((data) => {
    console.log(data.results);
    data.results.forEach((pokemon) => {
        console.log(pokemon.name);
        const card = document.createElement('div');
        card.classList.add('card');
        const image = document.createElement('img');
        image.classList.add('image');
        image.src = pokemon.url;
        const name = document.createElement('h3');
        name.classList.add('name');
        name.textContent = pokemon.name;
        card.appendChild(name);
        card.appendChild(image);
        container === null || container === void 0 ? void 0 : container.appendChild(card);
    });
})
    .catch(error => {
    console.error('Error:', error);
});
export {};
