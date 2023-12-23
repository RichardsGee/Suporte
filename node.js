// URL do WebSocket no servidor Node-RED
const serverWebSocketUrl = 'ws://194.163.134.51:1880/endpoint/buscar';

// Credenciais de autenticação
const username = 'richard'; // Substitua com seu nome de usuário
const password = 'SdkpgVh8LtkbaXm6'; // Substitua com sua senha

// Verifica se a página atual é 'resultado.html' antes de iniciar o WebSocket
if (window.location.pathname.endsWith('/resultado.html')) {
    // Obtém o valor da consulta a partir da URL
    const urlParams = new URLSearchParams(window.location.search);
    const consulta = urlParams.get('consulta');

    // Cria uma nova conexão WebSocket com credenciais
    const socket = new WebSocket(serverWebSocketUrl, [username, password]);

    // Define as credenciais na conexão WebSocket
    socket.addEventListener('open', (event) => {
        console.log('Conexão WebSocket aberta.');
        
        // Envia a consulta obtida da URL para o servidor Node-RED
        socket.send(JSON.stringify({ payload: consulta }));
    });

    // Define o que fazer quando uma mensagem é recebida do servidor
    socket.addEventListener('message', (event) => {
        console.log('Mensagem recebida do servidor:', event.data);

        // Você pode tratar os dados recebidos aqui e realizar ações com base nas mensagens recebidas
    });

    // Define o que fazer quando ocorre um erro na conexão WebSocket
    socket.addEventListener('error', (event) => {
        console.error('Erro na conexão WebSocket:', event);
    });

    // Define o que fazer quando a conexão WebSocket é fechada
    socket.addEventListener('close', (event) => {
        console.log('Conexão WebSocket fechada.');

        // Você pode tentar reconectar aqui, se necessário
    });
}
