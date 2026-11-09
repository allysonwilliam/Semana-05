const app = {
    dados: [],
    loading: false,
    erro: null,

    async inicializar() {
        const container = document.querySelector("#app") || document.body;
        
        this.loading = true;
        this.erro = null;
        this.dados = [];
        this.renderizar(container);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const resposta = await fetch("https://typicode.com");
            if (!resposta.ok) {
                throw new Error("Falha ao carregar os dados da API.");
            }
            
            const dadosBrutos = await resposta.json();
            
            this.dados = dadosBrutos.map(usuario => ({
                cliente: usuario.name,
                valor: Math.floor(Math.random() * 200) - 30,
                status: Math.random() > 0.4 ? "pago" : "pendente"
            }));

            this.loading = false;
            this.renderizar(container);

        } catch (err) {
            this.loading = false;
            this.erro = err.message;
            this.renderizar(container);
        }
    },

    renderizar(container) {
        if (this.loading) {
            container.innerHTML = "<div class='loading'>Carregando dados...</div>";
            return;
        }

        if (this.erro) {
            container.innerHTML = `<div class='error'>Erro: ${this.erro} <button onclick="app.inicializar()">Tentar novamente</button></div>`;
            return;
        }

        let pedidosValidos = this.dados.filter(p => p.cliente.trim() !== "" && typeof p.valor === "number" && p.valor > 0);
        let pedidosPagos = pedidosValidos.filter(p => p.status === "pago");

        if (pedidosPagos.length === 0) {
            container.innerHTML = "<div class='empty'>Nenhum pedido pago encontrado.</div>";
            return;
        }

        let totalFaturado = pedidosPagos.reduce((acumulador, p) => acumulador + p.valor, 0);

        let htmlSucesso = "<ul class='success-list'>";
        pedidosPagos.forEach(p => {
            htmlSucesso += `<li>${p.cliente} - R$ ${p.valor.toFixed(2)}</li>`;
        });
        htmlSucesso += "</ul>";
        htmlSucesso += `<div class='total'><strong>Total Faturado:</strong> R$ ${totalFaturado.toFixed(2)}</div>`;
        htmlSucesso += `<button onclick="app.inicializar()" style="margin-top: 15px;">Atualizar Dados</button>`;

        container.innerHTML = htmlSucesso;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const appContainer = document.createElement("div");
    appContainer.id = "app";
    document.body.appendChild(appContainer);
    
    app.inicializar();
});
