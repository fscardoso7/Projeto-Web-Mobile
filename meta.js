// ============================================================
// META DA CAMPANHA
// Lê o que foi salvo pelo doar.js no localStorage e mostra os
// números na tela: total arrecadado, barra de progresso e o
// detalhamento por categoria.
//
// [SUPOSIÇÃO] Os números de meta por categoria (250 cada,
// somando 1000) são um valor de exemplo — troque pelos números
// reais da campanha quando tiverem.
// ============================================================

const categorias = [
    { id: "agasalhos", nome: "Agasalhos & Moletons", meta: 5 },
    { id: "cobertores", nome: "Cobertores & Mantas", meta: 5 },
    { id: "calcados", nome: "Calçados", meta: 5 },
    { id: "infantil", nome: "Roupas Infantis", meta: 5 }
];

const metaTotal = 5;

// ============================================================
// ELEMENTOS DA PÁGINA
// ============================================================

const contadorTotal = document.getElementById("contador-total");
const metaObjetivo = document.getElementById("meta-objetivo");
const barraTotal = document.getElementById("barra-total");
const porcentagemTotal = document.getElementById("porcentagem-total");
const faltam = document.getElementById("faltam");
const listaCategorias = document.getElementById("lista-categorias");
const ultimaAtualizacao = document.getElementById("ultima-atualizacao");

// ============================================================
// LER O QUE ESTÁ SALVO NO NAVEGADOR
// Mesma função que existe em doar.js. Se nunca doou nada nesse
// navegador, começa tudo em zero.
// ============================================================

function carregarDoacoes() {
    const dadosSalvos = localStorage.getItem("doacoesMackenzie");

    if (dadosSalvos === null) {
        return {
            agasalhos: 0,
            cobertores: 0,
            calcados: 0,
            infantil: 0
        };
    }

    return JSON.parse(dadosSalvos);
}

// ============================================================
// MOSTRAR A META NA TELA
// ============================================================

function mostrarMeta() {
    const doacoes = carregarDoacoes();

    // Soma o total arrecadado somando as 4 categorias
    let totalArrecadado = 0;
    for (let i = 0; i < categorias.length; i++) {
        totalArrecadado += doacoes[categorias[i].id];
    }

    const porcentagem = Math.min(Math.round((totalArrecadado / metaTotal) * 100), 100);

    contadorTotal.textContent = totalArrecadado;
    metaObjetivo.textContent = metaTotal;
    barraTotal.style.width = porcentagem + "%";
    porcentagemTotal.textContent = porcentagem;

    const restante = metaTotal - totalArrecadado;
    if (restante > 0) {
        faltam.textContent = "Faltam " + restante + " peças para atingir a meta.";
    } else {
        faltam.textContent = "Meta atingida! Obrigado a todos que doaram.";
    }

    // Monta um card por categoria
    let html = "";

    for (let i = 0; i < categorias.length; i++) {
        const categoria = categorias[i];
        const quantidade = doacoes[categoria.id];
        const porcentagemCategoria = Math.min(Math.round((quantidade / categoria.meta) * 100), 100);

        html += "<div class='card-categoria'>";
        html += "<h4 class='categoria-nome'>" + categoria.nome + "</h4>";
        html += "<p class='categoria-numeros'>" + quantidade + " de " + categoria.meta + " peças</p>";
        html += "<div class='barra-fundo'><div class='barra-progresso' style='width:" + porcentagemCategoria + "%'></div></div>";
        html += "<p class='categoria-porcentagem'>" + porcentagemCategoria + "%</p>";
        html += "</div>";
    }

    listaCategorias.innerHTML = html;

    ultimaAtualizacao.textContent = "Atualizado em " + new Date().toLocaleString("pt-BR");
}

mostrarMeta();
