const formPokedex = document.createElement("form");
formPokedex.id = "pokedex-form";

const inputPokemon = document.createElement("input");
inputPokemon.type = "text";
inputPokemon.id = "pokemon-input";
inputPokemon.placeholder = "Nome ou ID do Pokémon";

const botaoPokedex = document.createElement("button");
botaoPokedex.type = "submit";
botaoPokedex.id = "pokemon-botao";
botaoPokedex.textContent = "Buscar";

formPokedex.append(inputPokemon, botaoPokedex);

const statusPokedex = document.createElement("div");
statusPokedex.id = "pokemon-status";

const resultadoPokedex = document.createElement("div");
resultadoPokedex.id = "pokemon-resultado";

const containerPokedex = document.querySelector("#app") || document.body;
containerPokedex.append(formPokedex, statusPokedex, resultadoPokedex);

formPokedex.addEventListener("submit", async (e) => {
    e.preventDefault();

    const termoBusca = inputPokemon.value.trim().toLowerCase();
    resultadoPokedex.replaceChildren();
    statusPokedex.textContent = "";

    if (termoBusca === "") {
        statusPokedex.textContent = "Erro: Por favor, digite o nome de um Pokémon.";
        return;
    }

    statusPokedex.textContent = "Buscando...";
    botaoPokedex.disabled = true;

    try {
        const resposta = await fetch(`https://pokeapi.co{termoBusca}`);

        if (!resposta.ok) {
            if (resposta.status === 404) {
                statusPokedex.textContent = "Pokémon não encontrado.";
            } else {
                statusPokedex.textContent = "Falha na conexão com o servidor.";
            }
            return;
        }

        const dadosPokemon = await resposta.json();
        statusPokedex.textContent = "";

        const h2Nome = document.createElement("h2");
        h2Nome.textContent = dadosPokemon.name.toUpperCase();

        const imgPokemon = document.createElement("img");
        imgPokemon.src = dadosPokemon.sprites.front_default || "";
        imgPokemon.alt = dadosPokemon.name;

        const pTipos = document.createElement("p");
        const listaTipos = dadosPokemon.types.map(t => t.type.name).join(", ");
        pTipos.textContent = `Tipo(s): ${listaTipos}`;

        resultadoPokedex.append(h2Nome, imgPokemon, pTipos);

    } catch (erro) {
        statusPokedex.textContent = "Falha na conexão de rede. Verifique sua internet.";
    } finally {
        botaoPokedex.disabled = false;
    }
});
