//Dot Env para ocultar registros sensiveis
require('dotenv').config();

//Import do Express
const express = require('express');
const app = express();

//Import do mongoose e conexão ao BD Atlas
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    //Emit para conectar o banco antes de iniciar o servidor
    console.log('Banco Conectado')
    app.emit('conectado');
  })
  .catch(e => console.log(e));

//Express Session para salvar sessões
const session = require('express-session');

//Chamada conexão MongoDB
const MongoStore = require('connect-mongo');

//Flash messages
const flash = require('connect-flash');

//Caminho das rotas para  organização
const routes = require('./routes');
//Path
const path = require('path');

//Helmet e CSURF p/ segurança anti cross-site scriping
const helmet = require('helmet');
const csrf = require('csurf');

//Import dos Midllewares
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

//Set do local das views 
app.set('views', path.resolve(__dirname, 'src', 'views'));
//Set da view engine (EJS)
app.set('view engine', 'ejs');

//Set do uso do Helmet
app.use(helmet());

//Desabilitar o cabeçalho para evitar ataques usando express
app.disable('x-powered-by');

//Utilização de JSON
app.use(express.json());
//URL Encoded para aninhar JSON
app.use(express.urlencoded({ extended: true }));
//Set da pasta para arquivos estáticos (Imagem,texto,etc).
app.use(express.static(path.resolve(__dirname, 'public')));

//Opções de Sessão
const sessionOptions = session({
  secret: ['secret','chewbacca','yoda'],
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    //Salvar cookie por 1 semana
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});

//Uso das Session Options
app.use(sessionOptions);

//Uso de Flash messages
app.use(flash());

//Uso do Csurf para criação de tokens 
app.use(csrf());

// Set dos Middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

//Execução do servidor
app.on('conectado', () => {
  //Listen para inicio do servidor
  app.listen(process.env.PORT, () => {
    console.log('Acessar http://localhost:3000');
    console.log('Servidor executando na porta 3000');
  });
});