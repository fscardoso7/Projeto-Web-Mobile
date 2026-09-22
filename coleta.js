// ============================================================
// PONTOS DE COLETA
// Os dados agora vivem em pontos-coleta.json, não mais aqui
// dentro do JS. Essa variável começa vazia e só é preenchida
// depois que o fetch() traz o conteúdo do arquivo.
// ============================================================

let pontosColeta = [];

// ============================================================
// ELEMENTOS DA PÁGINA
// ============================================================

const listaPontos = document.getElementById("lista-pontos");
const filtroRegiao = document.getElementById("filtro-regiao");
const contador = document.getElementById("contador-resultados");
const mapa = document.getElementById("mapa");
const btnLocalizacao = document.getElementById("btn-localizacao");
const statusLocalizacao = document.getElementById("status-localizacao");

// Guarda a latitude e longitude do usuário depois que ele
// autoriza. Começa vazio (null).
let latUsuario = null;
let lngUsuario = null;

// ============================================================
// PASSO 1: PEDIR A LOCALIZAÇÃO DO USUÁRIO
// ============================================================

function usarMinhaLocalizacao() {
    statusLocalizacao.textContent = "Buscando sua localização...";

    navigator.geolocation.getCurrentPosition(function (posicao) {
        latUsuario = posicao.coords.latitude;
        lngUsuario = posicao.coords.longitude;

        statusLocalizacao.textContent = "Localização encontrada!";

        // mostrarPontos() devolve a lista já ordenada do mais
        // perto para o mais longe. O primeiro item (posição 0)
        // é o ponto de coleta mais próximo do usuário.
        const pontosOrdenados = mostrarPontos();

        if (pontosOrdenados.length > 0) {
            verNoMapa(pontosOrdenados[0].id);
        }
    }, function () {
        statusLocalizacao.textContent = "Não foi possível pegar sua localização.";
    });
}

// ============================================================
// PASSO 2: CALCULAR A DISTÂNCIA ENTRE DOIS PONTOS
// Fórmula de Haversine: calcula a distância em km entre duas
// coordenadas (latitude/longitude) na superfície da Terra.
// ============================================================

function calcularDistancia(lat1, lng1, lat2, lng2) {
    const raioTerra = 6371; // raio da Terra em km

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = raioTerra * c;

    return distancia;
}

// ============================================================
// PASSO 3: FILTRAR OS PONTOS
// Percorre a lista de pontos e guarda apenas os que passam
// nos filtros de região e de texto digitado.
// ============================================================

function filtrarPontos() {
    const regiaoEscolhida = filtroRegiao.value;

    const pontosFiltrados = [];

    for (let i = 0; i < pontosColeta.length; i++) {
        const ponto = pontosColeta[i];

        const passaRegiao = (regiaoEscolhida === "todas") || (ponto.regiao === regiaoEscolhida);

        if (passaRegiao) {
            pontosFiltrados.push(ponto);
        }
    }

    return pontosFiltrados;
}

// ============================================================
// PASSO 4: CALCULAR DISTÂNCIA DE CADA PONTO FILTRADO
// Se o usuário já autorizou a localização, calcula a distância
// de cada ponto até ele e ordena do mais perto para o mais longe.
// ============================================================

function calcularDistanciasEOrdenar(pontos) {
    // Se ainda não temos a localização do usuário, não dá para calcular
    if (latUsuario === null) {
        return pontos;
    }

    for (let i = 0; i < pontos.length; i++) {
        pontos[i].distancia = calcularDistancia(latUsuario, lngUsuario, pontos[i].lat, pontos[i].lng);
    }

    // Ordena o array do menor para o maior valor de distância
    pontos.sort(function (a, b) {
        return a.distancia - b.distancia;
    });

    return pontos;
}

// ============================================================
// PASSO 5: MOSTRAR OS PONTOS NA TELA
// Monta o HTML de cada card e coloca dentro da div lista-pontos.
// ============================================================

function mostrarPontos() {
    let pontos = filtrarPontos();
    pontos = calcularDistanciasEOrdenar(pontos);

    contador.textContent = pontos.length + " ponto(s) de coleta encontrado(s).";

    let html = "";

    for (let i = 0; i < pontos.length; i++) {
        const ponto = pontos[i];

        html += "<article class='card-ponto'>";
        html += "<h3 class='ponto-campus'>" + ponto.campus + "</h3>";

        if (ponto.distancia !== undefined) {
            html += "<p class='ponto-distancia'>" + ponto.distancia.toFixed(1) + " km de você</p>";
        }

        html += "<p class='ponto-info'><strong>Bairro:</strong> " + ponto.bairro + "</p>";
        html += "<p class='ponto-info'><strong>Endereço:</strong> " + ponto.endereco + "</p>";
        html += "<p class='ponto-info'><strong>Horário:</strong> " + ponto.horario + "</p>";
        html += "<button class='btn-mapa' onclick='verNoMapa(" + ponto.id + ")'>Ver no mapa</button>";
        html += "</article>";
    }

    listaPontos.innerHTML = html;

    // Devolve a lista (já filtrada e, se possível, ordenada por
    // distância) para quem chamou essa função poder usá-la —
    // por exemplo, usarMinhaLocalizacao() usa isso para saber
    // qual é o ponto mais próximo.
    return pontos;
}

// ============================================================
// MOSTRAR O PONTO ESCOLHIDO NO MAPA
// ============================================================

function verNoMapa(id) {
    for (let i = 0; i < pontosColeta.length; i++) {
        if (pontosColeta[i].id === id) {
            mapa.src = "https://www.google.com/maps?q=" + encodeURIComponent(pontosColeta[i].endereco) + "&output=embed";
        }
    }
}

// ============================================================
// CARREGAR OS PONTOS DE COLETA DO ARQUIVO JSON
// fetch() busca o arquivo, e como isso demora um pouquinho
// (é uma operação assíncrona), usamos .then() para dizer
// "quando terminar de buscar, faça isso aqui".
// ============================================================

function carregarPontosColeta() {
    fetch("pontos-coleta.json")
        .then(function (resposta) {
            return resposta.json(); // transforma a resposta em array de objetos
        })
        .then(function (dados) {
            pontosColeta = dados; // guarda os dados na variável
            mostrarPontos(); // só mostra os pontos depois que os dados chegaram
        })
        .catch(function () {
            contador.textContent = "Não foi possível carregar os pontos de coleta.";
        });
}

// ============================================================
// EVENTOS (o que acontece quando o usuário interage)
// ============================================================

btnLocalizacao.addEventListener("click", usarMinhaLocalizacao);
filtroRegiao.addEventListener("change", mostrarPontos);

// Antes a página chamava mostrarPontos() direto ao carregar.
// Agora ela chama carregarPontosColeta(), que busca os dados
// no JSON primeiro e só então chama mostrarPontos() por dentro.
carregarPontosColeta();
