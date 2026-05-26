/**
 * CONCEITO IMPORTANTE — Event Delegation:
 * Em vez de adicionar um event listener em cada botão,
 * colocamos UM listener no documento inteiro e verificamos
 * qual elemento foi clicado. Isso é mais eficiente e
 * funciona mesmo para elementos adicionados dinamicamente.
 */

document.querySelectorAll('.toggle-password').forEach(function(button) {

  button.addEventListener('click', function() {
    // data-target é um atributo HTML customizado (data attribute).
    // Ele nos diz qual input este botão controla.
    var targetId = this.getAttribute('data-target');
    var input = document.getElementById(targetId);

    if (!input) return; 
    var isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';

   
    this.innerHTML = isHidden
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';

    // Acessibilidade: atualiza o aria-label para leitores de tela
    this.setAttribute('aria-label', isHidden ? 'Ocultar senha' : 'Mostrar senha');
  });
});


var loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    // Redireciona para o dashboard
    window.location.href = 'dashboard.html';
  });
}


var registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', function(event) {
    event.preventDefault();
    // Verificação básica de senhas — útil mesmo no protótipo
    var password = document.getElementById('password');
    var confirm  = document.getElementById('confirm-password');

    if (password && confirm && password.value !== confirm.value) {
      alert('As senhas não coincidem. Verifique e tente novamente.');
      confirm.focus(); 
      return;
    }

    alert('Conta criada com sucesso! (protótipo)');
    window.location.href = 'index.html';
  });
}

var recoveryForm = document.getElementById('recovery-form');
if (recoveryForm) {
  recoveryForm.addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Instruções enviadas para o seu e-mail! (protótipo)');
    window.location.href = 'index.html';
  });
}
