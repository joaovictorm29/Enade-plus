/**
 * simulados.js — Lógica completa da tela de Simulados
 *
 * ESTRUTURA DO ARQUIVO:
 *  1. Dados (simula o que viria de uma API)
 *  2. Funções de renderização (constroem o HTML)
 *  3. Funções de interação (accordion, filtro, tentativas)
 *  4. Inicialização
 *
 * CONCEITO IMPORTANTE — Separação de dados e apresentação:
 * Os dados ficam em um array de objetos (simuladosData).
 * As funções de renderização transformam esses dados em HTML.
 * Isso facilita muito substituir os dados estáticos por uma
 * chamada fetch() à API no futuro — só muda uma linha.
 */

// ============================================================
// 1. DADOS
// ============================================================

/**
 * Array de objetos representando cada simulado disponível.
 * Cada objeto tem:
 *   - id: identificador único
 *   - ano: ano da prova
 *   - feito: se o usuário já realizou alguma tentativa
 *   - tentativas: array de tentativas anteriores (pode ser vazio)
 *   - tentativaSelecionada: índice da tentativa atualmente exibida
 */
var simuladosData = [
  {
    id: 'enade-2021',
    ano: 2021,
    feito: true,
    tentativas: [
      { data: '12/03/2024', acertos: 37, total: 40, melhor: 38, tempo: '3h34m' },
      { data: '05/11/2023', acertos: 33, total: 40, melhor: 38, tempo: '3h51m' },
      { data: '20/08/2023', acertos: 28, total: 40, melhor: 38, tempo: '4h02m' },
    ],
    tentativaSelecionada: 0,
  },
  {
    id: 'enade-2022',
    ano: 2022,
    feito: true,
    tentativas: [
      { data: '01/02/2024', acertos: 30, total: 40, melhor: 30, tempo: '3h20m' },
      { data: '10/12/2023', acertos: 25, total: 40, melhor: 30, tempo: '3h45m' },
    ],
    tentativaSelecionada: 0,
  },
  {
    id: 'enade-2023',
    ano: 2023,
    feito: true,
    tentativas: [
      { data: '14/04/2024', acertos: 34, total: 40, melhor: 34, tempo: '3h10m' },
    ],
    tentativaSelecionada: 0,
  },
  {
    id: 'enade-2024',
    ano: 2024,
    feito: false,
    tentativas: [],
    tentativaSelecionada: null,
  },
];

// Guarda qual card está aberto (null = nenhum)
// Usamos uma variável de estado — conceito fundamental em UIs
var cardAbertoId = null;
var modalTentativasSimId = null;
var modalTentativas = document.getElementById('modal-tentativas');
var btnFecharTentativas = document.getElementById('btn-fechar-tentativas');

if (btnFecharTentativas) {
  btnFecharTentativas.addEventListener('click', function() {
    fecharModalTentativas();
  });
}

if (modalTentativas) {
  modalTentativas.addEventListener('click', function(e) {
    if (e.target === modalTentativas) {
      fecharModalTentativas();
    }
  });
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    fecharModalTentativas();
  }
});

// ============================================================
// 2. RENDERIZAÇÃO
// ============================================================

/**
 * renderSimulados(dados)
 * Recebe o array de simulados (ou um subconjunto filtrado)
 * e renderiza todos os cards na tela.
 *
 * innerHTML = '' limpa a lista antes de re-renderizar.
 * Esse padrão simples (limpar + re-renderizar) é chamado
 * de "re-render completo" — adequado para protótipos.
 * Frameworks como React otimizam isso com o Virtual DOM.
 */
function renderSimulados(dados) {
  var lista = document.getElementById('sim-list');
  lista.innerHTML = '';

  dados.forEach(function(sim) {
    var card = criarCard(sim);
    lista.appendChild(card);
  });

  // Restaura o estado aberto se o card ainda existe
  if (cardAbertoId) {
    var cardEl = document.getElementById(cardAbertoId);
    if (cardEl) cardEl.classList.add('is-open');
  }
}

/**
 * criarCard(sim)
 * Cria e retorna um elemento DOM completo para um simulado.
 *
 * Usamos document.createElement + innerHTML para construir o card.
 * Uma alternativa mais moderna seria usar template literals
 * e inserir via innerHTML diretamente no container — mas
 * createElement facilita adicionar event listeners depois.
 */
function criarCard(sim) {
  var card = document.createElement('div');
  card.className = 'sim-card';
  card.id = sim.id;

  var tentAtual = sim.feito ? sim.tentativas[sim.tentativaSelecionada] : null;

  // Determina os valores exibidos no card
  var acertos = tentAtual ? (tentAtual.acertos + '/' + tentAtual.total) : '--/--';
  var melhor  = tentAtual ? tentAtual.melhor  : '--';
  var tempo   = tentAtual ? tentAtual.tempo   : '--';
  var dataStr = tentAtual ? tentAtual.data    : 'DD/MM/AAAA';

  // innerHTML do card — template literal com interpolação
  card.innerHTML = `
    <div class="sim-card-header" data-id="${sim.id}">
      <span class="sim-card-title">ENADE ${sim.ano}</span>
      <span class="sim-date-badge">Data: ${dataStr}</span>
      <span class="sim-chevron">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </span>
    </div>

    <div class="sim-card-body">
      <div class="sim-card-body-inner">

        <!-- Mini-cards de estatística -->
        <div class="sim-stats">
          <div class="sim-stat-card">
            <div class="sim-stat-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div>
              <div class="sim-stat-value ${!sim.feito ? 'empty' : ''}">${acertos}</div>
              <div class="sim-stat-label">Número de acertos</div>
            </div>
          </div>

          <div class="sim-stat-card">
            <div class="sim-stat-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div>
              <div class="sim-stat-value ${!sim.feito ? 'empty' : ''}">${melhor}</div>
              <div class="sim-stat-label">Melhor tentativa</div>
            </div>
          </div>

          <div class="sim-stat-card">
            <div class="sim-stat-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <div class="sim-stat-value ${!sim.feito ? 'empty' : ''}">${tempo}</div>
              <div class="sim-stat-label">Tempo Gasto</div>
            </div>
          </div>
        </div>

        <!-- Botões de ação -->
        <div class="sim-actions">

          ${sim.feito ? `
            <div class="tentativas-wrapper">
              <button class="sim-btn ghost btn-tentativas" data-id="${sim.id}">
                Selecionar tentativa
              </button>
            </div>
            <button class="sim-btn primary btn-nova-tentativa" data-id="${sim.id} " href="simulado-info.html">
              Nova tentativa
            </button>
          ` : `
            <button class="sim-btn ghost disabled" disabled>Selecionar tentativa</button>
            <button class="sim-btn primary btn-fazer" data-id="${sim.id}" href="simulado-info.html">
              Fazer Simulado
            </button>
          `}

        </div>
      </div>
    </div>
  `;

  return card;
}

// ============================================================
// 3. INTERAÇÕES
// ============================================================

/**
 * Accordion — abrir/fechar cards
 *
 * Usamos delegação de eventos: um único listener no container
 * captura cliques de todos os cabeçalhos.
 *
 * CONCEITO — Event Bubbling:
 * Eventos "sobem" pelo DOM. Um clique no título (.sim-card-title)
 * sobe para o .sim-card-header, depois para .sim-card, depois
 * para #sim-list. Capturamos no #sim-list e verificamos a origem.
 */
document.getElementById('sim-list').addEventListener('click', function(e) {
  // Encontra o cabeçalho mais próximo do elemento clicado
  // closest() sobe na árvore DOM procurando o seletor
  var header = e.target.closest('.sim-card-header');
  if (!header) return; // clique não foi no cabeçalho

  // Verifica se o clique foi dentro dos botões (não deve abrir/fechar)
  if (e.target.closest('.sim-actions') || e.target.closest('.tentativas-wrapper')) return;

  var id = header.getAttribute('data-id');
  var card = document.getElementById(id);

  if (cardAbertoId && cardAbertoId !== id) {
    // Fecha o card anteriormente aberto
    document.getElementById(cardAbertoId).classList.remove('is-open');
  }

  card.classList.toggle('is-open');
  cardAbertoId = card.classList.contains('is-open') ? id : null;

  // Fecha dropdowns abertos ao trocar de card
  fecharTodosDropdowns();
});

/**
 * Dropdown de tentativas
 * Delegação no document para capturar cliques nos botões
 * e nas opções de tentativa, independente de quando foram criados.
 */
document.addEventListener('click', function(e) {

  // Abrir modal de tentativas
  var btnTent = e.target.closest('.btn-tentativas');
  if (btnTent) {
    e.stopPropagation();
    var simId = btnTent.getAttribute('data-id');
    var sim = simuladosData.find(function(s) { return s.id === simId; });
    abrirModalTentativas(sim);
    return;
  }

  // Selecionar uma tentativa dentro do modal
  var tentItem = e.target.closest('.tentativa-modal-item');
  if (tentItem) {
    var simId = tentItem.getAttribute('data-sim-id');
    var index = parseInt(tentItem.getAttribute('data-index'));
    var sim = simuladosData.find(function(s) { return s.id === simId; });
    if (!sim) return;
    sim.tentativaSelecionada = index;
    fecharModalTentativas();
    renderSimulados(dadosFiltrados()); // re-renderiza com nova tentativa
    // Reabre o card que estava aberto
    setTimeout(function() {
      var card = document.getElementById(simId);
      if (card) card.classList.add('is-open');
      cardAbertoId = simId;
    }, 10);
    return;
  }

  // Redirecionar para a página de introdução do simulado
  var btnNova = e.target.closest('.btn-nova-tentativa');
  if (btnNova) {
    // opcional: enviar id do simulado como query string
    var simId = btnNova.getAttribute('data-id');
    window.location.href = 'simulado-intro.html' + (simId ? ('?sim=' + encodeURIComponent(simId.trim())) : '');
    return;
  }

  var btnFazer = e.target.closest('.btn-fazer');
  if (btnFazer) {
    var simId2 = btnFazer.getAttribute('data-id');
    window.location.href = 'simulado-intro.html' + (simId2 ? ('?sim=' + encodeURIComponent(simId2)) : '');
    return;
  }

  // Clicar fora de qualquer dropdown fecha todos
  fecharTodosDropdowns();
  fecharFiltro();
});

/**
 * Filtro por ano
 */
var btnFiltro = document.getElementById('btn-filtro');
var filtroDropdown = document.getElementById('filtro-dropdown');
var filtroTipo = document.getElementById('filtro-tipo');
var filtroDates = document.getElementById('filtro-date-list');

// Abre/fecha o dropdown de filtro
btnFiltro.addEventListener('click', function(e) {
  e.stopPropagation();
  var aberto = filtroDropdown.classList.contains('is-open');
  fecharTodosDropdowns();
  if (!aberto) {
    filtroDropdown.classList.add('is-open');
    btnFiltro.classList.add('active');
    popularFiltro();
  } else {
    fecharFiltro();
  }
});

// Impede que clique dentro do dropdown feche ele
filtroDropdown.addEventListener('click', function(e) {
  e.stopPropagation();
});

// Muda as opções ao trocar entre Ano / Mês
filtroTipo.addEventListener('change', popularFiltro);

/**
 * popularFiltro()
 * Gera os botões de data dentro do dropdown conforme o tipo selecionado.
 * Extrai os anos/meses únicos dos dados de simulados.
 */
function popularFiltro() {
  filtroDates.innerHTML = '';

  var tipo = filtroTipo.value;
  var valores = [];

  // Extrai todos os anos dos simulados feitos
  simuladosData.forEach(function(sim) {
    if (!sim.feito) return;
    sim.tentativas.forEach(function(t) {
      var partes = t.data.split('/'); // ['12', '03', '2024']
      var valor = tipo === 'ano' ? partes[2] : partes[1] + '/' + partes[2];
      if (!valores.includes(valor)) valores.push(valor);
    });
  });

  // Adiciona opção "Todos" para limpar o filtro
  var btnTodos = document.createElement('button');
  btnTodos.className = 'filter-date-item selected';
  btnTodos.textContent = 'Todos';
  btnTodos.addEventListener('click', function() {
    document.querySelectorAll('.filter-date-item').forEach(function(b) { b.classList.remove('selected'); });
    this.classList.add('selected');
    renderSimulados(simuladosData);
  });
  filtroDates.appendChild(btnTodos);

  valores.sort().reverse().forEach(function(valor) {
    var btn = document.createElement('button');
    btn.className = 'filter-date-item';
    btn.textContent = tipo === 'ano' ? valor : nomeDoMes(valor);
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-date-item').forEach(function(b) { b.classList.remove('selected'); });
      this.classList.add('selected');
      // Filtra simulados que têm ao menos uma tentativa no período
      var filtrados = simuladosData.filter(function(sim) {
        if (!sim.feito) return true; // mantém os não-feitos sempre
        return sim.tentativas.some(function(t) {
          var partes = t.data.split('/');
          var val = tipo === 'ano' ? partes[2] : partes[1] + '/' + partes[2];
          return val === valor;
        });
      });
      renderSimulados(filtrados);
    });
    filtroDates.appendChild(btn);
  });
}

/** Converte '03/2024' → 'Mar/2024' */
function nomeDoMes(mmaaaa) {
  var meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  var partes = mmaaaa.split('/');
  return meses[parseInt(partes[0]) - 1] + '/' + partes[1];
}

/** Retorna os dados atualmente filtrados para re-render consistente */
function dadosFiltrados() {
  var btnSelecionado = document.querySelector('.filter-date-item.selected');
  if (!btnSelecionado || btnSelecionado.textContent === 'Todos') return simuladosData;
  // Re-aplica o último filtro ativo — simplificado para protótipo
  return simuladosData;
}

// ── Utilitários ─────────────────────────────────────────────

function fecharTodosDropdowns() {
  document.querySelectorAll('.tentativas-dropdown').forEach(function(d) {
    d.classList.remove('is-open');
  });
}

function abrirModalTentativas(sim) {
  if (!sim || !sim.feito || !modalTentativas) return;

  modalTentativasSimId = sim.id;
  document.getElementById('modal-tentativas-title').textContent = 'Selecionar tentativa - ENADE ' + sim.ano;
  document.getElementById('modal-tentativas-desc').textContent = 'Escolha o dia da tentativa para ver seus resultados anteriores.';

  var modalBody = document.getElementById('modal-tentativas-body');
  modalBody.innerHTML = sim.tentativas.map(function(t, i) {
    var selectedClass = i === sim.tentativaSelecionada ? 'selected' : '';
    return `
      <button class="tentativa-modal-item ${selectedClass}" data-sim-id="${sim.id}" data-index="${i}">
        <div class="tentativa-modal-date">${t.data}</div>
        <div class="tentativa-modal-details">${t.acertos}/${t.total} acertos · melhor ${t.melhor} · ${t.tempo}</div>
      </button>
    `;
  }).join('');

  modalTentativas.classList.add('is-open');
}

function fecharModalTentativas() {
  if (!modalTentativas) return;
  modalTentativas.classList.remove('is-open');
  modalTentativasSimId = null;
}

function fecharFiltro() {
  filtroDropdown.classList.remove('is-open');
  btnFiltro.classList.remove('active');
}

// ============================================================
// 4. INICIALIZAÇÃO
// ============================================================

// Renderiza todos os simulados ao carregar a página
renderSimulados(simuladosData);

// Abre o primeiro card por padrão (como mostra o wireframe)
setTimeout(function() {
  var primeiro = document.querySelector('.sim-card');
  if (primeiro) {
    primeiro.classList.add('is-open');
    cardAbertoId = primeiro.id;
  }
}, 0);