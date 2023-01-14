import "./assets/index.css"
const axios = require("axios");

let input = document.querySelector(".pesquisa")
let ExibirPokemon = document.querySelector(".ExibirPokemon")

GetPokemons()
input.addEventListener("change", e =>{
    e.preventDefault
    let inputValue = String(input.value).toLowerCase()
    if (inputValue ) {
        FilterPokemon(inputValue)
    } else {
        GetPokemons()
    }
})

async function FilterPokemon(namePokemon) {
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${namePokemon}`)
    DeleteCard()
    CreateCard(data)
}

async function GetPokemons() {
    const { data: { results } } = await axios.get("https://pokeapi.co/api/v2/pokemon")
    const pokemonsPromisse = results.map(({ url }) => axios.get(url))
    const pokemonsPromisseAll = await Promise.all(pokemonsPromisse)
    DeleteCard()
    pokemonsPromisseAll.forEach(({ data }) => {
        CreateCard(data)
    })
}

function CreateCard(data){
    let pokemon = PokemonInf(data)
    let color = pokemon.FirstType
    
    const card = document.createElement("div");
    const pokemonText = document.createElement("div")
    const { nome,height,weight,types,progress,progressBar } = PokemonAtt(pokemon)
    const imagem = CriaImagem(data);
    
    card.setAttribute("class", "card")
    pokemonText.setAttribute("class", "text")
    pokemonText.setAttribute("id", data.name);
    card.setAttribute("id", color )
    
    ExibirPokemon.appendChild(card)
    card.appendChild(pokemonText)
    card.appendChild(imagem)
    pokemonText.appendChild(nome)
    pokemonText.appendChild(height)
    pokemonText.appendChild(weight)
    pokemonText.appendChild(types)
    pokemonText.appendChild(progress)
    card.appendChild(progressBar)
    
}

function PokemonInf(data) {
    let {name, height,weight,types,base_experience} = data
    let pokemon = {
        Name: name,
        Height: height,
        Weight: weight,
        Types: types.map(t => t.name),
        FirstType: types[0].type.name,
        Expbase: base_experience
    }
    return pokemon
}

function CriaImagem(imagem) {
    let img = document.createElement("img")
    img.src = imagem.sprites.other["official-artwork"].front_default
    return img
}

function PokemonAtt(pokemon) {
    const pokemonAttributes = {
        nome: document.createElement("p"),
        height: document.createElement("p"),
        weight: document.createElement("p"),
        types: document.createElement("p"),
        progressBar: document.createElement("progress"),
        progress: document.createElement("p")
    }
    const { Name, Height, Weight, Types, Expbase } = pokemon
    const {nome, height, weight, types, progressBar, progress} = pokemonAttributes
    nome.innerText = `${Name}`;
    height.innerText = `Height: ${Height} kg`;
    weight.innerText = `Weight: ${Weight/100} m`;
    types.innerText = `Types: ${Types}`;
    progressBar.value = Expbase;
    progressBar.max = 1000;
    progressBar.innerHTML = 1000;
    progress.innerHTML = "exp bar:"
    progress.setAttribute("class", "progresso")

    return pokemonAttributes
}

function DeleteCard() {
    const ExibirCard = document.querySelectorAll(".card")
    ExibirCard.forEach(card => card.remove())
}