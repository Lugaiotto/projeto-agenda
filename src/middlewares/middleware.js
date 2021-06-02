//Middleware Global para salvar sessão do usuário e enviar flash messages
exports.middlewareGlobal = (req, res, next) => {
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  res.locals.user = req.session.user;
  next();
};


//Middleware para checagem de erro no Csurf (Em caso de erro retorna página 404)
exports.checkCsrfError = (err, req, res, next) => {
  if(err) {
    return res.render('404');
  }
  next();
};

//Middleware para criação de token
exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

//Middleware para verificação se o usuário já está logado
exports.loginRequired = (req,res, next) =>{
  //Caso a sessão usuário seja false
  if(!req.session.user){
    req.flash('errors', 'Você precisar estar logado para realizar esta ação');
    //Redireciona para página inicial
    req.session.save(() => res.redirect('/login/index'));
    return;
  }
  next();
  }

