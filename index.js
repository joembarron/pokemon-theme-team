const retrievePokemonButton = document.getElementsByTagName("button")[0];
const pokemonList = document.querySelector("ul");

const randomIDForFirstPokemon = Math.floor(Math.random(0, 1) * 905) + 1; // There are a total of 905 pokemon.
const pokemonOfSameTypeAsFirstPokemon = [];

const req = new XMLHttpRequest();
req.responseType = "json";

req.addEventListener("load", reqListener);
req.addEventListener("loadend", retrievePokemonOfFirstPokemonType);

let pokemonName = null;
let pokemonImage = null;
let pokemonType = null;

retrievePokemonButton.addEventListener("click", () => {
  if (pokemonType == null) {
    req.open(
      "GET",
      `https://pokeapi.co/api/v2/pokemon/${randomIDForFirstPokemon}`
    ); // Get random pokemon from PokeAPI.
    req.send();
  } else if (pokemonOfSameTypeAsFirstPokemon.length > 0) {
    req.removeEventListener("load", loadPokemonNamesIntoArray);
    req.open(
      "GET",
      `https://pokeapi.co/api/v2/pokemon/${
        pokemonOfSameTypeAsFirstPokemon[
          pokemonOfSameTypeAsFirstPokemon.length - 1
        ]
      }`
    );

    req.send();
    pokemonOfSameTypeAsFirstPokemon.pop(); // Pop off the name of the pokemon from the array that was just retrieved.
  }
});

function addPokemonImageToUnorderedList(response) {
  if (response.sprites != null) {
    // Get pokemon name and image url from API response.
    pokemonName = response.name;
    pokemonImage = response.sprites["back_default"];

    // Create new image.
    let newImage = document.createElement("img");
    newImage.src = pokemonImage;
    newImage.alt = pokemonName;

    // Append image to unordered list in HTML document.
    pokemonList.appendChild(newImage);
  }
}

function loadPokemonNamesIntoArray() {
  // Push the names of pokemon with the same type as the first retrieved pokemon into an array.
  for (let i = 0; i < 5; i++) {
    pokemonOfSameTypeAsFirstPokemon.push(this.response.pokemon[i].pokemon.name);
  }
}

function retrievePokemonOfFirstPokemonType() {
  req.removeEventListener("loadend", retrievePokemonOfFirstPokemonType);
  req.addEventListener("load", loadPokemonNamesIntoArray);

  req.open("GET", pokemonType);
  req.send();
}

function reqListener() {
  if (pokemonType == null) {
    pokemonType = this.response.types[0].type.url; // Get the url endpoint for the type of the first pokemon.
  }
  addPokemonImageToUnorderedList(this.response);
}

