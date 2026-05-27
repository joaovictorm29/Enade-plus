# ENADE Plus — Protótipo de Alta Fidelidade

> Projeto acadêmico — protótipo de alta fidelidade para apresentação em sala de aula.

Este repositório contém um protótipo de interface construído totalmente com HTML, CSS e JavaScript. O objetivo principal foi produzir um protótipo de alta fidelidade voltado para uso em desktop, para apresentação e avaliação em contexto acadêmico.

**Observação:** este é um projeto acadêmico/protótipo. Não se trata de um produto pronto para produção.

## Tecnologias

- HTML
- CSS
- JavaScript

O foco foi entregar uma interface de desktop com fidelidade visual elevada; por isso não houve foco intenso em responsividade durante a construção inicial.

## Como abrir o protótipo

1. Abra o diretório do projeto no seu sistema de arquivos.
2. Abra o arquivo `index.html` em um navegador moderno (Chrome, Edge, Firefox).

Nada além de um navegador é necessário — não há backend neste protótipo.

## Lógica de organização do projeto

O projeto foi organizado de forma simples e direta, priorizando clareza por funcionalidade:

- Páginas HTML principais na raiz: cadastro, dashboard, simulados, perfil, recuperação de senha, etc. (ex.: `index.html`, `dashboard.html`, `cadastro.html`).
- Arquivos de estilo separados por escopo: `style.css` (estilos globais) e folhas específicas como `dashboard.css`, `simulados.css`, `banco.css` para estilizações locais.
- Scripts JavaScript organizados por responsabilidade: `script.js` para lógica global, `simulados.js` e `banco.js` para funcionalidades específicas, além de pequenos scripts inline quando necessário.
- Recursos (imagens, fontes) podem ser adicionados em pastas dedicadas caso o protótipo seja ampliado.

Essa organização facilita localizar facilmente cada tela e seu CSS/JS relacionado — cada página tem seus arquivos de estilo/comportamento separados quando necessário, mantendo também um conjunto global para padrões recorrentes.

## Uso de Inteligência Artificial

Durante a construção, houve uso de ferramentas de IA para auxiliar na melhoria de pontos específicos do design, tais como:

- Ajustes de layout e espaçamento para melhor legibilidade;
- Sugestões de paleta e contraste de cores;
- Refinamento de textos e microcopy para botões e instruções.

A IA foi empregada como apoio para decisões pontuais de design, não substituindo o processo de concepção humana, e todas as escolhas finais foram validadas manualmente para manter coerência com os objetivos do protótipo.

## Limitações e implementações futuras

Limitações atuais:

- Protótipo pensado para desktop — pouca atenção à responsividade;
- Não há backend ou persistência de dados reais;
- Validações de formulários e acessibilidade ainda podem ser aprimoradas.

Sugestões de melhorias futuras:

- Tornar o layout responsivo (mobile/tablet) e testar quebras de layout;
- Melhorar acessibilidade (contraste, navegação por teclado, leitores de tela);
- Implementar validações de formulário mais robustas e integração com backend;
- Organização de assets em pastas (`/assets/images`, `/assets/fonts`) e otimização de carregamento;
- Testes automatizados e revisão de performance.

## Estrutura (exemplos de arquivos)

- `index.html` — entrada principal
- `dashboard.html` — área principal do usuário
- `cadastro.html` — tela de cadastro
- `recuperar-senha.html`, `alterar-senha.html` — fluxo de recuperação de senha
- `simulados.html`, `simulado-prova.html`, `simulado-resultado.html` — telas de simulados
- `style.css`, `dashboard.css`, `simulados.css`, `banco.css` — estilos
- `script.js`, `simulados.js`, `banco.js` — scripts

## Contato

Para dúvidas ou sugestões sobre o protótipo, entre em contato com o autor/autor(es) responsável(is) pela apresentação na turma.

---

Este README foi escrito para documentar de forma clara e concisa o propósito e a organização do protótipo, conforme solicitado para apresentação acadêmica.
