//Import do express e das rotas
const express = require('express');
const route = express.Router();

//Set dos controllers
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');

//Import do middleware de login required
const {loginRequired} = require('./src/middlewares/middleware')

// Rotas da home
route.get('/', homeController.paginaInicial);
route.post('/', homeController.trataPost);

//Rotas dos contatos

 //Rota da página de contato
 route.get('/contato/index', loginRequired, contatoController.index);

 route.post('/contato/register', loginRequired, contatoController.register);

//Rotas de cadastro

    //Rota da página de Login
    route.get('/login/index', loginController.index);

    //Rota de registro
    route.post('/login/register', loginController.register);

    //Rota de login
    route.post('/login/login', loginController.login);

    //Rota de logout
    route.get('/login/logout', loginController.logout);

//Export dos modulos
module.exports = route;
