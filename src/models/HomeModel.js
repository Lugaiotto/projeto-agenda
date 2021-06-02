//Import do mongoose
const mongoose = require('mongoose');

//Modelagem do Schema
const HomeSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: String
});

//Criação do modelo
const HomeModel = mongoose.model('Home', HomeSchema);

class Home {}

//Export Modulo Home
module.exports = Home;
