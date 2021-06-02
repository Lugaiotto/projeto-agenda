//Tratamento do GET da página Index
exports.paginaInicial = (req, res) => {
  //Render da pagina Index.ejs
  res.render('index', {
    //Envio das informações
    // titulo: 'Este será o título da página',
    // numeros: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  });
  return;
};

//Tratamento do POST da página Index
exports.trataPost = (req, res) => {
  res.send(req.body);
  return;
};
