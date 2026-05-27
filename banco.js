/**
 * banco.js — Lógica completa do Banco de Questões
 *
 * ESTRUTURA:
 *  1. Base de dados (questões + mapeamento de assuntos por curso)
 *  2. População dos selects
 *  3. Renderização das questões
 *  4. Lógica de gabarito (reveal in-place)
 *  5. Listeners de filtro
 *  6. Inicialização
 */

// ============================================================
// 1. BASE DE DADOS
// ============================================================

/*
  assuntosPorCurso: objeto onde cada chave é o valor do select
  de curso, e o valor é um array de assuntos disponíveis.
  Quando o usuário muda o curso, repopulamos o select de assuntos
  com esse array — isso é o "filtro encadeado".
*/
var assuntosPorCurso = {
  cc: [
    'Todos',
    'Algoritmos e Estruturas de Dados',
    'Arquitetura de Computadores',
    'Banco de Dados',
    'Engenharia de Software',
    'Inteligência Artificial',
    'Redes de Computadores',
    'Sistemas Operacionais',
    'Teoria da Computação',
    'Ética e Direitos Humanos',
    'Cidadania e Sociedade',
  ],
  direito: [
    'Todos',
    'Direito Constitucional',
    'Direito Civil',
    'Direito Penal',
    'Direito Processual Civil',
    'Direito Administrativo',
    'Direito do Trabalho',
    'Ética Profissional',
    'Cidadania e Sociedade',
  ],
  medicina: [
    'Todos',
    'Anatomia',
    'Fisiologia',
    'Farmacologia',
    'Clínica Médica',
    'Cirurgia',
    'Saúde Coletiva',
    'Ética Médica',
    'Cidadania e Sociedade',
  ],
  adm: [
    'Todos',
    'Administração Geral',
    'Marketing',
    'Finanças Corporativas',
    'Gestão de Pessoas',
    'Estratégia Empresarial',
    'Empreendedorismo',
    'Ética nos Negócios',
    'Cidadania e Sociedade',
  ],
  eng_civil: [
    'Todos',
    'Cálculo Estrutural',
    'Materiais de Construção',
    'Hidráulica',
    'Geotecnia',
    'Topografia',
    'Gestão de Obras',
    'Ética e Legislação',
    'Cidadania e Sociedade',
  ],
};

/*
  cursos: array que popula o select de curso.
  value = chave usada em assuntosPorCurso e nos filtros.
  label = texto exibido no dropdown.
*/
var cursos = [
  { value: 'cc',        label: 'Ciências da Computação' },
  { value: 'direito',   label: 'Direito' },
  { value: 'medicina',  label: 'Medicina' },
  { value: 'adm',       label: 'Administração' },
  { value: 'eng_civil', label: 'Engenharia Civil' },
];

/*
  questoesDB: banco de questões.
  Cada questão tem:
    id         — identificador único (usado como nome do radio group)
    curso      — deve coincidir com os values de `cursos`
    eixo       — 'especifico' ou 'geral'
    assunto    — deve coincidir com um dos valores de assuntosPorCurso
    tipo       — 'objetiva' ou 'discursiva'
    ano        — ano da prova de origem
    enunciado  — texto da questão
    alternativas — array de { texto, justificativa }
    gabarito   — índice 0-based da alternativa correta
*/
var questoesDB = [
  {
    id: 'q1',
    curso: 'cc',
    eixo: 'geral',
    assunto: 'Ética e Direitos Humanos',
    tipo: 'objetiva',
    ano: 2023,
    enunciado: 'A Lei Geral de Proteção de Dados Pessoais (LGPD) estabelece princípios para o tratamento de dados. Sobre a aplicação desses princípios em sistemas computacionais, analise as afirmações:\n\nI. O princípio da finalidade exige que os dados coletados sejam usados apenas para os propósitos informados ao titular.\nII. O princípio da minimização determina que somente os dados estritamente necessários devem ser coletados.\nIII. O consentimento do titular é sempre a única base legal que autoriza o tratamento de dados pessoais.\n\nEstá correto apenas o que se afirma em:',
    alternativas: [
      { texto: 'Apenas I.', justificativa: 'I está correta: finalidade é um dos princípios centrais da LGPD, mas sozinha não está completa.' },
      { texto: 'Apenas III.', justificativa: 'III está incorreta: a LGPD prevê diversas bases legais além do consentimento, como legítimo interesse e cumprimento de obrigação legal.' },
      { texto: 'I e II, apenas.', justificativa: 'Correto. I (finalidade) e II (minimização/necessidade) são princípios corretos da LGPD. III é falsa pois existem outras bases legais.' },
      { texto: 'II e III, apenas.', justificativa: 'III está incorreta — vide justificativa da alternativa B.' },
      { texto: 'I, II e III.', justificativa: 'III está incorreta — o consentimento não é a única base legal.' },
    ],
    gabarito: 2,
  },
  {
    id: 'q2',
    curso: 'cc',
    eixo: 'especifico',
    assunto: 'Algoritmos e Estruturas de Dados',
    tipo: 'objetiva',
    ano: 2022,
    enunciado: 'Uma árvore AVL é uma árvore binária de busca autobalanceada. Considere a inserção sequencial dos valores 10, 20, 30 em uma árvore AVL inicialmente vazia.\n\nApós as inserções, qual será a estrutura da árvore e qual rotação terá sido aplicada?',
    alternativas: [
      { texto: 'Raiz: 10, filhos 20 e 30. Nenhuma rotação foi necessária.', justificativa: 'Incorreto. Após inserir 30, o fator de balanceamento da raiz 10 seria -2, exigindo rotação.' },
      { texto: 'Raiz: 20, filho esquerdo 10, filho direito 30. Rotação simples à esquerda.', justificativa: 'Correto. A inserção de 30 cria desbalanceamento em 10. A rotação simples à esquerda (LL invertida = RR) torna 20 a nova raiz.' },
      { texto: 'Raiz: 30, filho esquerdo 20, filho esquerdo de 20 é 10. Nenhuma rotação.', justificativa: 'Incorreto. Esse resultado seria de uma BST comum sem balanceamento.' },
      { texto: 'Raiz: 20, filho esquerdo 30, filho direito 10. Rotação dupla.', justificativa: 'Incorreto. Os filhos estão invertidos e a rotação dupla não se aplica a inserções lineares crescentes.' },
      { texto: 'Raiz: 10, filho direito 20, filho direito de 20 é 30. Rotação dupla direita-esquerda.', justificativa: 'Incorreto. Essa é a estrutura antes do balanceamento, e a rotação aplicada é simples, não dupla.' },
    ],
    gabarito: 1,
  },
  {
    id: 'q3',
    curso: 'cc',
    eixo: 'especifico',
    assunto: 'Banco de Dados',
    tipo: 'objetiva',
    ano: 2023,
    enunciado: 'Em bancos de dados relacionais, as propriedades ACID garantem a confiabilidade das transações. Considere o seguinte cenário: durante uma transferência bancária, o sistema falha após debitar a conta de origem mas antes de creditar a conta destino.\n\nQual propriedade ACID foi violada e qual mecanismo é responsável por corrigi-la?',
    alternativas: [
      { texto: 'Consistência; corrigida pelo controle de concorrência.', justificativa: 'A consistência pode ter sido afetada, mas a propriedade diretamente violada é a atomicidade.' },
      { texto: 'Durabilidade; corrigida pelo log de transações (write-ahead log).', justificativa: 'A durabilidade garante persistência após commit — não se aplica aqui pois o commit não ocorreu.' },
      { texto: 'Atomicidade; corrigida pelo mecanismo de rollback via log de transações.', justificativa: 'Correto. Atomicidade exige tudo-ou-nada. O rollback desfaz o débito usando o log, restaurando o estado anterior.' },
      { texto: 'Isolamento; corrigida pelo controle de concorrência multiversion (MVCC).', justificativa: 'Isolamento trata de transações concorrentes — não é o problema descrito.' },
      { texto: 'Atomicidade; corrigida pelo mecanismo de checkpoint.', justificativa: 'A atomicidade está correta, mas o mecanismo é o rollback via log, não o checkpoint (que serve para recuperação após crash).' },
    ],
    gabarito: 2,
  },
  {
    id: 'q4',
    curso: 'cc',
    eixo: 'especifico',
    assunto: 'Redes de Computadores',
    tipo: 'objetiva',
    ano: 2022,
    enunciado: 'O protocolo TCP utiliza o mecanismo de controle de congestionamento para gerenciar a taxa de transmissão. Sobre as fases do algoritmo TCP Reno, analise:\n\nI. Na fase Slow Start, a janela de congestionamento cresce exponencialmente até atingir o ssthresh.\nII. Na fase Congestion Avoidance, o crescimento da janela é linear (um MSS por RTT).\nIII. Ao detectar perda por timeout, o ssthresh é definido como metade da janela atual e a janela volta a 1 MSS.\n\nEstão corretas:',
    alternativas: [
      { texto: 'Apenas I e II.', justificativa: 'III também está correta — incompleto.' },
      { texto: 'Apenas I e III.', justificativa: 'II também está correta — incompleto.' },
      { texto: 'Apenas II e III.', justificativa: 'I também está correta — incompleto.' },
      { texto: 'I, II e III.', justificativa: 'Correto. As três afirmações descrevem corretamente o comportamento do TCP Reno.' },
      { texto: 'Apenas I.', justificativa: 'Resposta muito restritiva — II e III também estão corretas.' },
    ],
    gabarito: 3,
  },
  {
    id: 'q5',
    curso: 'cc',
    eixo: 'geral',
    assunto: 'Cidadania e Sociedade',
    tipo: 'objetiva',
    ano: 2023,
    enunciado: 'A Constituição Federal de 1988 estabelece fundamentos para a cidadania digital no Brasil. Considerando os princípios constitucionais e o Marco Civil da Internet (Lei 12.965/2014), avalie:\n\nI. A neutralidade de rede proíbe que provedores discriminem pacotes de dados com base no conteúdo ou aplicação.\nII. O sigilo das comunicações privadas na internet pode ser quebrado mediante ordem judicial.\nIII. Usuários têm direito ao esquecimento digital absoluto, podendo exigir a remoção de qualquer conteúdo que os mencione.\n\nEstá correto apenas:',
    alternativas: [
      { texto: 'I, apenas.', justificativa: 'I está correta, mas II também está — incompleto.' },
      { texto: 'III, apenas.', justificativa: 'III está incorreta: o direito ao esquecimento não é absoluto e não abrange qualquer conteúdo.' },
      { texto: 'I e III, apenas.', justificativa: 'III está incorreta — vide alternativa B.' },
      { texto: 'II e III, apenas.', justificativa: 'III está incorreta.' },
      { texto: 'I e II, apenas.', justificativa: 'Correto. I (neutralidade de rede) e II (quebra de sigilo com ordem judicial) são corretas. III é falsa.' },
    ],
    gabarito: 4,
  },
  {
    id: 'q6',
    curso: 'direito',
    eixo: 'especifico',
    assunto: 'Direito Constitucional',
    tipo: 'objetiva',
    ano: 2022,
    enunciado: 'O controle de constitucionalidade no Brasil pode ser exercido de forma difusa ou concentrada. Sobre o controle concentrado exercido pelo Supremo Tribunal Federal (STF), assinale a alternativa correta:',
    alternativas: [
      { texto: 'A Ação Direta de Inconstitucionalidade (ADI) pode ser proposta por qualquer cidadão brasileiro.', justificativa: 'Incorreto. O rol de legitimados da ADI é restrito (art. 103 CF) — não inclui qualquer cidadão.' },
      { texto: 'A Arguição de Descumprimento de Preceito Fundamental (ADPF) não admite liminar.', justificativa: 'Incorreto. A ADPF admite medida liminar por decisão da maioria absoluta do STF.' },
      { texto: 'A declaração de inconstitucionalidade na ADI possui efeito erga omnes e vinculante.', justificativa: 'Correto. Decisões em ADI têm efeito erga omnes (para todos) e vinculante aos demais órgãos do Judiciário e à Administração Pública.' },
      { texto: 'A Ação Declaratória de Constitucionalidade (ADC) pode ter como objeto lei municipal.', justificativa: 'Incorreto. A ADC só pode ter como objeto ato normativo federal.' },
      { texto: 'No controle concentrado, o STF atua como legislador negativo apenas em casos excepcionais.', justificativa: 'Incorreto. O STF atua como legislador negativo em toda declaração de inconstitucionalidade em controle concentrado.' },
    ],
    gabarito: 2,
  },
  {
    id: 'q7',
    curso: 'medicina',
    eixo: 'especifico',
    assunto: 'Fisiologia',
    tipo: 'objetiva',
    ano: 2023,
    enunciado: 'O potencial de ação cardíaco nas células do nó sinoatrial (NSA) difere significativamente do potencial de ação das células do músculo esquelético. Sobre as fases do potencial de ação cardíaco no NSA, assinale a alternativa correta:',
    alternativas: [
      { texto: 'A fase 0 (despolarização rápida) no NSA é mediada pela abertura de canais rápidos de Na⁺, assim como no músculo esquelético.', justificativa: 'Incorreto. No NSA, a despolarização da fase 0 é mediada por canais lentos de Ca²⁺, não de Na⁺.' },
      { texto: 'A fase 4 do NSA é estável (linha isoelétrica), assim como nas células ventriculares.', justificativa: 'Incorreto. A fase 4 do NSA apresenta despolarização espontânea (pacemaker potential), responsável pelo automatismo cardíaco.' },
      { texto: 'A corrente If (funny current) durante a fase 4 é responsável pela despolarização diastólica espontânea do NSA.', justificativa: 'Correto. A corrente If ativa-se com a hiperpolarização e conduz Na⁺ e K⁺ para dentro da célula, gerando a despolarização espontânea que define o automatismo do NSA.' },
      { texto: 'O NSA não apresenta período refratário, por isso pode ser despolarizado continuamente.', justificativa: 'Incorreto. O NSA apresenta período refratário, embora mais curto que o dos cardiomiócitos ventriculares.' },
      { texto: 'A repolarização no NSA é mediada exclusivamente por canais de Cl⁻.', justificativa: 'Incorreto. A repolarização é mediada principalmente por canais de K⁺ (IK).' },
    ],
    gabarito: 2,
  },
];

// ============================================================
// 2. ESTADO DOS FILTROS E RESPOSTAS
// ============================================================

/*
  respostasUsuario: objeto que mapeia id da questão → índice escolhido.
  Mantemos separado dos dados para não poluir questoesDB.
  Exemplo: { 'q1': 2, 'q3': null }
*/
var respostasUsuario = {};

/*
  gabaritoRevelado: conjunto de ids de questões cujo gabarito
  já foi revelado. Usamos um objeto como Set (chave = id, valor = true).
*/
var gabaritoRevelado = {};

// ============================================================
// 3. POPULAÇÃO DOS SELECTS
// ============================================================

function popularCursos() {
  var select = document.getElementById('f-curso');
  select.innerHTML = '';
  cursos.forEach(function(c) {
    var opt = document.createElement('option');
    opt.value = c.value;
    opt.textContent = c.label;
    select.appendChild(opt);
  });
}

/*
  popularAssuntos(cursoValue)
  Limpa e repopula o select de assunto conforme o curso.
  Este é o "filtro encadeado": uma seleção dispara a atualização de outro select.
*/
function popularAssuntos(cursoValue) {
  var select = document.getElementById('f-assunto');
  select.innerHTML = '';
  var lista = assuntosPorCurso[cursoValue] || ['Todos'];
  lista.forEach(function(assunto) {
    var opt = document.createElement('option');
    opt.value = assunto === 'Todos' ? 'todos' : assunto;
    opt.textContent = assunto;
    select.appendChild(opt);
  });
}

// ============================================================
// 4. FILTRAGEM
// ============================================================

function getFiltros() {
  return {
    curso:   document.getElementById('f-curso').value,
    eixo:    document.getElementById('f-eixo').value,
    assunto: document.getElementById('f-assunto').value,
    tipo:    document.getElementById('f-tipo').value,
  };
}

/*
  filtrarQuestoes(filtros)
  Aplica os 4 filtros sequencialmente usando Array.filter().

  CONCEITO — Array.filter():
  Cria um novo array com apenas os elementos que passam no teste.
  Encadear múltiplos .filter() é legível mas cria arrays intermediários.
  Para bancos maiores, usaria um único .filter() com todas as condições.
*/
function filtrarQuestoes(filtros) {
  return questoesDB.filter(function(q) {
    if (q.curso !== filtros.curso) return false;
    if (filtros.eixo    !== 'todos' && q.eixo    !== filtros.eixo)    return false;
    if (filtros.assunto !== 'todos' && q.assunto !== filtros.assunto) return false;
    if (filtros.tipo    !== 'todos' && q.tipo    !== filtros.tipo)    return false;
    return true;
  });
}

// ============================================================
// 5. RENDERIZAÇÃO
// ============================================================

function renderBanco() {
  var filtros  = getFiltros();
  var questoes = filtrarQuestoes(filtros);

  // Atualiza barra de informação
  var infoBar = document.getElementById('banco-info-bar');
  var cursoLabel = cursos.find(function(c) { return c.value === filtros.curso; });
  infoBar.innerHTML = questoes.length > 0
    ? '<strong>' + questoes.length + ' questões encontradas</strong> para os filtros selecionados'
    : '';

  var lista = document.getElementById('banco-lista');

  if (questoes.length === 0) {
    lista.innerHTML = `
      <div class="banco-vazio">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p>Nenhuma questão encontrada para os filtros selecionados.<br>Tente ajustar os critérios de busca.</p>
      </div>`;
    return;
  }

  lista.innerHTML = '';
  questoes.forEach(function(q, idx) {
    lista.appendChild(criarCardQuestao(q, idx + 1));
  });
}

function criarCardQuestao(q, numero) {
  var card = document.createElement('div');
  card.className = 'questao-card';
  card.id = 'card-' + q.id;

  var letras = ['A', 'B', 'C', 'D', 'E'];

  var alternativasHTML = q.alternativas.map(function(alt, i) {
    var checked = respostasUsuario[q.id] === i ? 'checked' : '';
    return `
      <label class="banco-alt" data-questao="${q.id}" data-index="${i}">
        <span class="banco-alt-letra">${letras[i]}.</span>
        <div class="banco-alt-radio"></div>
        <input type="radio" name="alt-${q.id}" value="${i}" class="banco-alt-input" ${checked}>
        <span class="banco-alt-texto">${alt.texto}</span>
      </label>
      <div class="alt-justificativa" id="just-${q.id}-${i}">
        <strong>Justificativa:</strong> ${alt.justificativa}
      </div>
    `;
  }).join('');

  var temResposta = respostasUsuario[q.id] !== undefined && respostasUsuario[q.id] !== null;

  card.innerHTML = `
    <div class="questao-card-header">
      <span class="questao-card-titulo">Questão ${String(numero).padStart(2, '0')}:</span>
      <div class="questao-badges">
        <span class="badge badge-ano">ENADE ${q.ano}</span>
        <span class="badge badge-eixo">${q.eixo === 'geral' ? 'Conhecimento Geral' : 'Comp. Específico'}</span>
        <span class="badge badge-tipo">${q.tipo === 'objetiva' ? 'Múltipla Escolha' : 'Discursiva'}</span>
      </div>
    </div>

    <p class="questao-enunciado">${q.enunciado.split('\n').join('<br>')}</p>

    <div class="banco-alternativas" id="alts-${q.id}">
      ${alternativasHTML}
    </div>

    <div class="questao-card-footer">
      <button
        class="btn-conferir ${gabaritoRevelado[q.id] ? 'revelado' : ''}"
        id="btn-conferir-${q.id}"
        data-questao="${q.id}"
        ${!temResposta || gabaritoRevelado[q.id] ? 'disabled' : ''}
      >
        ${gabaritoRevelado[q.id] ? '✓ Gabarito conferido' : 'Conferir gabarito'}
      </button>
    </div>
  `;

  // Se gabarito já foi revelado antes (ex: re-render por filtro), aplica estado
  if (gabaritoRevelado[q.id]) {
    setTimeout(function() { aplicarGabarito(q, true); }, 0);
  }

  return card;
}

// ============================================================
// 6. GABARITO IN-PLACE
// ============================================================

/*
  aplicarGabarito(q, silencioso)
  Transforma o card visualmente mostrando acertos/erros e justificativas.
  
  "silencioso" = true quando re-renderizamos sem animação (ex: ao trocar filtro).
  
  CONCEITO — Manipulação direta do DOM vs re-render:
  Em vez de re-renderizar o card inteiro (que perderia o estado de scroll),
  percorremos os elementos existentes e adicionamos/removemos classes.
  É mais eficiente e não causa flash visual.
*/
function aplicarGabarito(q, silencioso) {
  var card = document.getElementById('card-' + q.id);
  if (!card) return;

  card.classList.add('gabarito-revelado');

  var letrasContainer = card.querySelectorAll('.banco-alt');
  var respostaUsuario = respostasUsuario[q.id];

  letrasContainer.forEach(function(altEl, i) {
    var justEl = document.getElementById('just-' + q.id + '-' + i);
    var iconeExistente = altEl.querySelector('.alt-icone');
    if (iconeExistente) iconeExistente.remove();

    var icone = document.createElement('span');
    icone.className = 'alt-icone';

    if (i === q.gabarito) {
      // Sempre destaca a correta em verde
      altEl.classList.add('gabarito-certo');
      icone.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (i === respostaUsuario && respostaUsuario !== q.gabarito) {
      // Destaca em vermelho apenas a resposta errada do usuário
      altEl.classList.add('gabarito-errado');
      icone.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    }

    altEl.appendChild(icone);

    // Mostra justificativa com pequeno delay para efeito visual
    if (justEl) {
      if (silencioso) {
        justEl.classList.add('visivel');
      } else {
        setTimeout(function() {
          justEl.classList.add('visivel');
        }, i * 60); // escalonado: cada alternativa aparece 60ms depois
      }
    }
  });

  // Atualiza o botão
  var btn = document.getElementById('btn-conferir-' + q.id);
  if (btn) {
    btn.textContent = '✓ Gabarito conferido';
    btn.classList.add('revelado');
    btn.disabled = true;
  }
}

// ============================================================
// 7. EVENT LISTENERS
// ============================================================

/*
  Delegação de eventos no container principal.
  Um único listener captura cliques em todas as alternativas
  e botões de conferir, independente de quantas questões existam.
*/
document.getElementById('banco-lista').addEventListener('click', function(e) {

  // Clique em alternativa
  var altEl = e.target.closest('.banco-alt');
  if (altEl && !altEl.closest('.gabarito-revelado')) {
    var questaoId = altEl.getAttribute('data-questao');
    var index     = parseInt(altEl.getAttribute('data-index'));

    // Marca o radio manualmente (já que display: none no input)
    var input = altEl.querySelector('input');
    if (input) input.checked = true;

    respostasUsuario[questaoId] = index;

    // Habilita o botão de conferir desta questão
    var btn = document.getElementById('btn-conferir-' + questaoId);
    if (btn && !gabaritoRevelado[questaoId]) {
      btn.disabled = false;
    }

    return;
  }

  // Clique em "Conferir gabarito"
  var btnConferir = e.target.closest('.btn-conferir');
  if (btnConferir && !btnConferir.disabled) {
    var questaoId = btnConferir.getAttribute('data-questao');
    var q = questoesDB.find(function(item) { return item.id === questaoId; });
    if (q) {
      gabaritoRevelado[questaoId] = true;
      aplicarGabarito(q, false);
    }
  }
});

// Filtros: re-renderiza ao mudar qualquer select
['f-curso', 'f-eixo', 'f-assunto', 'f-tipo'].forEach(function(id) {
  document.getElementById(id).addEventListener('change', function() {
    // Ao trocar curso, atualiza assuntos encadeados
    if (id === 'f-curso') {
      popularAssuntos(this.value);
    }
    renderBanco();
  });
});

// ============================================================
// 8. INICIALIZAÇÃO
// ============================================================

popularCursos();
popularAssuntos(cursos[0].value);
renderBanco();