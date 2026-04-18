// Configuração do Firebase
// Para sua loja funcionar online, você precisa:
// 1. Criar um projeto no https://console.firebase.google.com/
// 2. Ativar o "Realtime Database" nas configurações do projeto.
// 3. Substituir os valores abaixo pelos das configurações do SEU projeto.

const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "seu-projeto.firebaseapp.com",
    databaseURL: "https://seu-projeto-default-rtdb.firebaseio.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "seu-id",
    appId: "seu-app-id"
};

// Inicialização (será feita nos arquivos individuais)
export default firebaseConfig;
