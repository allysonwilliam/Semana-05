const historicoCEPs = [];

const form = document.createElement("form");
form.id = "cep-form";

const input = document.createElement("input");
input.type = "text";
input.id = "cep-input";
input.placeholder = "Digite o CEP (apenas números)";
input.maxLength = 8;

const botao = document.createElement("button");
botao.type = "submit";
botao.id = "cep-botao";
botao.textContent = "Buscar CEP";

form.append(input, botao);

const statusDiv = document.createElement("div");
statusDiv.id = "cep-status";

const resultadoDl = document.createElement("dl");
resultadoDl.id = "cep-resultado";

const historicoUl = document.createElement("ul");
historicoUl.id = "cep-historico";

const container = document.querySelector("#app") || document.body;
container.append(form, statusDiv, resultadoDl, historicoUl);

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const cepLimpo = input.value.trim().replace(/\D/g, "");
    resultadoDl.replaceChildren();
    statusDiv.textContent = "";

    if (cepLimpo.length !== 8) {
        statusDiv.textContent = "Erro: O CEP deve conter exatamente 8 dígitos numéricos.";
        return;
    }

    statusDiv.textContent = "Buscando...";
    botao.disabled = true;

    try {
        const response = await fetch(`https://viacep.com.br{cepLimpo}/json/`);
        
        if (!response.ok) {
            throw new Error("Falha na conexão com o servidor.");
        }

        const dados = await response.json();

        if (dados.erro === true || dados.erro === "true") {
            statusDiv.textContent = "CEP não encontrado.";
            botao.disabled = false;
            return;
        }

        statusDiv.textContent = "";

        const campos = [
            { label: "Rua", valor: dados.logradouro || "Não informado" },
            { label: "Bairro", valor: dados.bairro || "Não informado" },
            { label: "Cidade", valor: dados.localidade || "Não informado" },
            { label: "UF", valor: dados.uf || "Não informado" }
        ];

        campos.forEach(campo => {
            const dt = document.createElement("dt");
            dt.textContent = campo.label;
            const dd = document.createElement("dd");
            dd.textContent = campo.valor;
            resultadoDl.append(dt, dd);
        });

        const jaExiste = historicoCEPs.some(item => item.cep === cepLimpo);
        if (!jaExiste) {
            historicoCEPs.push({ cep: cepLimpo, cidade: dados.localidade, uf: dados.uf });
            
            historicoUl.replaceChildren();
            historicoCEPs.forEach(item => {
                const li = document.createElement("li");
                li.textContent = `${item.cep} - ${item.cidade}/${item.uf}`;
                historicoUl.append(li);
            });
        }

    } catch (error) {
        statusDiv.textContent = "Falha na conexão de rede. Verifique seu acesso à internet.";
    } finally {
        botao.disabled = false;
    }
});
