const getPokemonButton = document.getElementsByTagName("button")[0];
const unorderedListOfPokemon = document.getElementsByTagName("ul")[0];
const randomPokemonID = Math.floor(Math.random(0, 1) * 905) + 1;
const pokemonOfSameTypeAsFirstPokemon = [];

let numberOfPokemonReceived = 0;
let pokemonType = null;

getPokemonButton.addEventListener("click", () => {
  if (numberOfPokemonReceived == 0) {
    // make initial request for first pokemon and get type of pokemon
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${randomPokemonID}/`)
      .then((response) => {
        pokemonType = response.data.types[0].type.url;
        addPokemonToUnorderedList(response.data);
        numberOfPokemonReceived += 1;

        axios
          .get(pokemonType)
          .then((response) => {
            loadPokemonNamesIntoArray(response.data);
          })
          .catch((response) => {
            console.log("There was an error: ", error);
          });
      })
      .catch((error) => {
        console.log("no good: ", error);
      });
  } else if (pokemonOfSameTypeAsFirstPokemon.length > 0) {
    // make further requests for pokemon of a given type
    const pokemonNameToRetrieve =
      pokemonOfSameTypeAsFirstPokemon[
        pokemonOfSameTypeAsFirstPokemon.length - 1
      ];
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemonNameToRetrieve}`)
      .then((response) => {
        addPokemonToUnorderedList(response.data);
        numberOfPokemonReceived += 1;
        pokemonOfSameTypeAsFirstPokemon.pop();
      })
      .catch((error) => {
        console.log("There was an error: ", error);
      });
  }
});

function addPokemonToUnorderedList(pokemonSpecies) {
  const newPokemon = document.createElement("img");
  const pokemonImageUrl = pokemonSpecies.sprites["back_default"];
  const pokemonName = pokemonSpecies.name;
  newPokemon.src = pokemonImageUrl;
  newPokemon.alt = pokemonName;
  unorderedListOfPokemon.appendChild(newPokemon);
}

function loadPokemonNamesIntoArray(data) {
  // Push the names of pokemon with the same type as the first retrieved pokemon into an array.
  for (let i = 0; i < 5; i++) {
    pokemonOfSameTypeAsFirstPokemon.push(data.pokemon[i].pokemon.name);
  }
}
