import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;
const predictSchema = new mongoose.Schema({
 // name : { type: String, unique: true, lowercase: true, trim: true },
  Matricule : { type: Number, unique: true},
  date_predict: [
    new mongoose.Schema({
      predict_value: {type: Number, required: true},
      date_value: {type: String, lowercase: true, trim: true},
      time_value: {type: String, lowercase: true, trim: true},
      NOM: {type: String},
      PRENOM: {type: String},
      Age: {type: SchemaTypes.Double},
      Civilite: {type: String},
      DateEmbauche: {type: String},
      EXPERIENCE_AVANT_SOFRECOM: {type: String, lowercase: true, trim: true},
      EXPERIENCE_SOFRECOM: {type: String, lowercase: true, trim: true},
      EXPERIENCE_Totale: {type: String, lowercase: true, trim: true},
      Ecole: {type: String},
      Manager: {type: String},
      Matricule: {type: Number},
      SITUATION_FAMILIALE: {type: String, required: true},
      Pole: {type: String},
      Poste: {type: String},
      Seniorite: {type: String},
      Niveau_Academique: {type: String},
      Dernier_Employeur: {type: String},

      Eval_3_mois: {type: String},
      Fin_PE: {type: String},
      Mois: {type: String},
      Date_de_depot_de_demission: {type: String},

      DATE_SORTIE_Paie: {type: String},
      Date_de_sortie_RH: {type: String},
      Mois_de_sortie_RH: {type: String},
      ANNEE_SORTIE: {type: String},
      MOIS_SORTIE: {type: String},

      Moyenne_preavis: {type: String},
      Nombre_moyen_de_mois_de_preavis_Arrondi: {type: String},
      Nombre_moyen_de_mois_de_preavis: {type: String},
      Raison_de_depart: {type: String},
      Destination: {type: String},
      Nationalite: {type: String},

      Date_de_Naissance: {type: String}
    }, {strict: false})]
});

// Before saving the user, hash the password
const Prediction = mongoose.model('Prediction', predictSchema);

export default Prediction;

/*
 name : { type: String, unique: true, lowercase: true, trim: true },
 date_predict: [
 {
 predict_value: {type: Number, required: true},
 date_value: {type: String, lowercase: true, trim: true},
 time_value: {type: String, lowercase: true, trim: true},
 Age: String,
 Civilite: {type: String},
 DateEmbauche: {type: String},
 Dem: {type: Number},
 EXPERIENCE_AVANT_SOFRECOM: {type: Number},
 EXPERIENCE_SOFRECOM: {type: Number},
 EXPERIENCE_Totale: {type: Number},
 Ecole: {type: String},
 Manager: {type: String},
 Matricule: {type: Number},
 Metier: {type: String},
 Pole: {type: String},
 Poste: {type: String}
 }]
 */
