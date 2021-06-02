//Import do mongoose
const mongoose = require('mongoose');

//Import do Validador
const validator = require('validator');

//Modelagem do Schema Contato
const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required:true },
    sobrenome: { type: String, required:false, default: ''},
    email: {type: String, required:true},
    telefone: {type: Number, required:false, default: ''},
    criadoEm: {type: Date, default: Date.now}
  });
  
  //Criação do modelo para o BD
  const ContatoModel = mongoose.model('Contato', ContatoSchema);


  //Criação da classe Contato
  class Contato {
    constructor(body){
        this.body = body;
        this.errors = [];
        this.contato = null;
    }

    //Função de registro do contato
    async register(){
      //Função para validação de informações
        this.valida();

        //Caso dê erro retorna ao usuário
        if(this.errors.length > 0){return};

        //Verificação se o contato já existe
        await this.contatoExists();

        //Caso dê erro retorna ao usuário
        if(this.errors.length > 0){return};
    
        this.contato = await ContatoModel.create(this.body);

              
    }

    //Verificação se o contato já existe (utilizando e-mail como parametro)
    async contatoExists(){
        this.contato = await ContatoModel.findOne({email: this.body.email});
        if(this.contato) {this.errors.push('Contato já existente!')};
    }

    //Função para validar os dados
    valida(){
      //Limpar caracteres e/ou espaços em branco
        this.cleanUp();

        //Validação de e-mail
        if(!validator.isEmail(this.body.email))
          {
            this.errors.push('E-mail invalido');
          };
        //Validação nome menor que 0 ou maior que 100 caracteres
        if(this.body.nome.length <= 0 || this.body.nome.length >=100)
            {
        this.errors.push('Nome inválido, limite máximo de 50 caracteres')
      };  
         //Validação sobrenome menor que 0 ou maior que 100 caracteres  
       if(this.body.sobrenome.length <= 0 || this.body.sobrenome.length >=100)
             {
           this.errors.push('Sobrenome inválido, limite máximo de 50 caracteres')
            }; 
          //Validação telefone maior ou menor que 11 ou 10 
         if(this.body.telefone.length != 11 || this.body.telefone.length !=10){
         this.errors.push('Numero de telefone inválido, limite de 11 caracteres')
         };
    }

    //Limpar e setar os dados enviados
    cleanUp(){
        this.body = {
            nome:this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            telefone: this.body.telefone
        };
    }
    
    //Regex para validar telefone(não utilizado atualmente)
    // regexTel(telefone){
    //   const regex = new RegExp('^\\([0-9]{2}\\)((3[0-9]{3}-[0-9]{4})|(9[0-9]{3}-[0-9]{5}))$');     
    //   const telFiltrado = telefone.match(regex);
    //   return telFiltrado;
    // }

}

//Exportação do modulo Contato
module.exports = Contato;