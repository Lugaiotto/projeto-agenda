//Import do Modelo Contato para utilização
const Contato = require('../models/ContatoModel');

//Controller do Index, renderiza a  página de contatos
exports.index = function(req,res){
   res.render('contato');
}

//Controller do registro, renderiza página de registros
exports.register = async function(req,res){
   try{
      //Cria um contato utilizando o Modelo Contato e inserindo informações enviadas da página
       const contato = new Contato(req.body);
       //Chamada função de registro do Model
       await contato.register();
   
       //Verificação em caso de erro no registro
       if(contato.errors.length > 0){
           req.flash('errors', contato.errors);
           //Redireciona para login
           return res.redirect('/login/index');
           }
      //Caso sucesso no registro, redireciona para a página com id do contato
       req.flash('success', 'Contato adicionado com sucesso');
       req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
        return;
   }
   //Catch do erro e renderização do 404
   catch(e){
       console.log(e);
      return res.render('404');       
   }
  
};