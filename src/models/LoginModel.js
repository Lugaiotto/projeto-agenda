
//Import do mongoose
const mongoose = require('mongoose');

//Import do Validador
const validator = require('validator');

//Import do bcrypt para encriptação da senha no BD
const bcryptjs = require('bcryptjs');

//Modelagem do Schema
const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true}
});

//Criação do modelo Login
const LoginModel = mongoose.model('Login', LoginSchema);

//Criação da classe Login
class Login {
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;
    }


    //Função de login
    async login(){
        //Validação do contato
        this.valida();

        //Retorna em caso de erro
        if(this.errors.length > 0){return};

        //Procura se o contato já existe utilizando e-mail como parâmetro
        this.user = await LoginModel.findOne({email: this.body.email});
        
        //Caso usuário não exista 'false', retorna erro
        if(!this.user){
            this.errors.push("Este usuário não existe");
            return;
        }

        //Compração de Hash para verificar senha
        if(!bcryptjs.compareSync(this.body.password, this.user.password))
            {
            this.errors.push("Senha inválida");
            this.user = null;
            return
            };

    }
    //Função para registrar cadastro no BD
    async register(){
        //Validação de usuário
        this.valida();

        //Caso encontre erro na validação retorna antes de salvar 
        if(this.errors.length > 0){return};

        //Validação de usuário existente
        await this.userExists();

        //Caso encontre erro de usuário existente retorna antes de salvar
        if(this.errors.length > 0){return};

        //Gerador de hash de senha
        const salt = bcryptjs.genSaltSync();

        //Set da senha + Hash
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        //Insere os dados dentro do Banco (LoginModel)
        this.user = await LoginModel.create(this.body);
            
    }

    //Verificação se usuário ja existe
    async userExists(){
        //Procura no banco se usuário existe, caso 'true' retorna erro
        this.user = await LoginModel.findOne({email: this.body.email});
        if(this.user) {this.errors.push('Usuário nao cadastrado - Conta já existente')};
    }


    valida(){
        //Chamada para filtrar os dados
        this.cleanUp();
        //Validação de email
        if(!validator.isEmail(this.body.email))
        {
            this.errors.push('E-mail invalido')
        };
        //Validação de senha, a senha precisa entre 3 a 20 caracteres
        if(this.body.password.length < 3 || this.body.password.length >=20)
            {
            this.errors.push('Senha precisa ter mais do que 3 e menos do que 20 caracteres')
            };

    }

    //Função para limpar os dados do e-mail
    cleanUp(){
        for (const key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }
        }
        //Set das informações enviadas pelo usuário (email/senha)
        this.body = {
            email:this.body.email,
            password: this.body.password
        };
    }

}

//Export Modulo Login
module.exports = Login;
