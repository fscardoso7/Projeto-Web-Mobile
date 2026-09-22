// ============================================================
// REGISTRO DE DOAÇÕES
// Quando o usuário clica num card, somamos +1 na categoria
// dele e guardamos no localStorage do navegador.
//
// IMPORTANTE: localStorage é só do navegador de quem clicou.
// Não é uma contagem real da campanha somando todo mundo que
// visita o site — cada pessoa vê só a própria contagem local.
// Pra virar uma meta de verdade compartilhada, precisaria de
// um banco de dados num servidor (fora do escopo deste projeto).
// ============================================================

const statusDoacao = document.getElementById("status-doacao");

// ============================================================
// LER O QUE JÁ ESTÁ SALVO NO NAVEGADOR
// Se nunca doou nada, começa tudo em zero.
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
// REGISTRAR UM CLIQUE NUMA CATEGORIA
// Chamada pelo onclick de cada card em doar.html.
// ============================================================

function registrarDoacao(categoria) {
    const doacoes = carregarDoacoes();

    doacoes[categoria] = doacoes[categoria] + 1;

    localStorage.setItem("doacoesMackenzie", JSON.stringify(doacoes));

    statusDoacao.textContent = "Doação registrada! Obrigado por contribuir. Veja o progresso na página Meta.";
}
