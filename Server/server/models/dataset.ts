import * as mongoose from 'mongoose';

const dataSetSchema = new mongoose.Schema({
  Matricule: {type: Number,  unique: true, required: true},
  NOM : { type: String, trim: true },
  PRENOM : { type: String, trim: true },
  Age: {type: Number, required: true},
  Civilite: {type: String, required: true},
  DateEmbauche: {type: String, required: true},
  Date_de_Naissance: {type: String},
  SITUATION_FAMILIALE: {type: String, required: true},
  EXPERIENCE_AVANT_SOFRECOM: {type: Number, required: true},
  EXPERIENCE_SOFRECOM: {type: Number, required: true},
  EXPERIENCE_Totale: {type: Number, required: true},
  Ecole: {type: String, required: true},
  Manager: {type: String, required: true},
  Pole: {type: String, required: true},
  Poste: {type: String, required: true},
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
  DEM: {type: Number},

}, {strict: false});



const DataSet = mongoose.model('DataSet', dataSetSchema);

export default DataSet;
