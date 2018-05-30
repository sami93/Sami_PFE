import Prediction from '../models/prediction';
import BaseCtrl from './base';

var json2csv = require('json2csv');
var json2xls = require('json2xls');
var fs = require('fs');
var xlsx = require('node-xlsx').default;
import DataSet from '../models/dataset';

const https = require('https');
const request = require('request');
export default class PredictCtrl extends BaseCtrl {
  model = Prediction;
  pathFile = 'C:/Users/s.ghorbel/Desktop/GenerateFile';



  PredictPersonTensorflow = (req, res) => {
    DataSet.findOne({Matricule: req.params.Matricule}, (err, obj) => {
      if (err) {
        return console.error(err);
      }
      const todayTime = new Date();

      const year = ('0' + todayTime.getFullYear()).slice(-2);
      const month = ('0' + (todayTime.getMonth() + 1)).slice(-2);
      const day = ('0' + todayTime.getDate()).slice(-2);
      const datefull = day + '/' + month + '/' + year;
      const ndateNow = month + '/' + day + '/' + year;
      var dateNow = obj.Date_de_Naissance.split("/");
      var newdateNow = dateNow[1] + "/"+ dateNow[0] + "/" + dateNow[2];

      var date2 = new Date(newdateNow);

      var date1 = new Date(ndateNow);
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      var num= diffDays/365;
      var NewAge = num.toFixed(2);
      obj['Age']=NewAge;

      var dateEmbaucheUpdate = obj.DateEmbauche.split("/");
      var newdateEmbaucheUpdate = dateEmbaucheUpdate[1] + "/"+ dateEmbaucheUpdate[0] + "/" + dateEmbaucheUpdate[2];

      var date3 = new Date(newdateEmbaucheUpdate);
      var timeDiff2 = Math.abs(date3.getTime() - date1.getTime());
      var diffDays2 = Math.ceil(timeDiff2 / (1000 * 3600 * 24));
      var num2= diffDays2/365;
      var NewExperienceSofrecom = num2.toFixed(2);
      obj['EXPERIENCE_SOFRECOM']= Number(NewExperienceSofrecom);
      obj['EXPERIENCE_Totale'] = Number( obj.EXPERIENCE_SOFRECOM) + Number( obj.EXPERIENCE_AVANT_SOFRECOM);

      request({
        url: 'http://localhost:5002/PredictionPerEmployee',
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        json: obj
//  body: JSON.stringify(requestData)
      },  (error, resp, body) => {



        let obj2 = body;
        obj2 = JSON.parse(obj2);

        //obj2 = JSON.parse(obj2);

        obj.DEM = obj2[0].DEM;

        /* creation of an object */

        const hour = ('0' + todayTime.getHours()).slice(-2);
        const minute = ('0' + todayTime.getMinutes()).slice(-2);
        const sec = ('0' + todayTime.getSeconds()).slice(-2);
        const timeNow = hour + ':' + minute + ':' + sec;





        var InfoPers = obj;
        InfoPers.date = datefull;
        InfoPers.time = timeNow;
        InfoPers.predict = InfoPers.DEM;


        var item = InfoPers;
        var date_predict = {
          "predict_value": item.predict, "date_value": item.date, "time_value": item.time, "Age": item.Age,
          "Civilite": item.Civilite,
          "NOM": item.NOM,
          "PRENOM": item.PRENOM,
          "DateEmbauche": item.DateEmbauche,
          "EXPERIENCE_AVANT_SOFRECOM": item.EXPERIENCE_AVANT_SOFRECOM,
          "EXPERIENCE_SOFRECOM": item.EXPERIENCE_SOFRECOM,
          "EXPERIENCE_Totale": item.EXPERIENCE_Totale,
          "Ecole": item.Ecole,
          "Manager": item.Manager,
          "Matricule": item.Matricule,
          "Pole": item.Pole,
          "Poste": item.Poste,
          "SITUATION_FAMILIALE": item.SITUATION_FAMILIALE,
          "Seniorite": item.Seniorite,
          "Niveau_Academique": item.Niveau_Academique,
          "Dernier_Employeur": item.Dernier_Employeur,

          "Eval_3_mois": item.Eval_3_mois,
          "Fin_PE":item.Fin_PE,
          "Mois": item.Mois,
          "Date_de_depot_de_demission": item.Date_de_depot_de_demission,

          "DATE_SORTIE_Paie": item.DATE_SORTIE_Paie,
          "Date_de_sortie_RH": item.Date_de_sortie_RH,
          "Mois_de_sortie_RH": item.Mois_de_sortie_RH,
          "ANNEE_SORTIE": item.ANNEE_SORTIE,
          "MOIS_SORTIE": item.MOIS_SORTIE,

          "Moyenne_preavis": item.Moyenne_preavis,
          "Nombre_moyen_de_mois_de_preavis_Arrondi": item.Nombre_moyen_de_mois_de_preavis_Arrondi,
          "Nombre_moyen_de_mois_de_preavis": item.Nombre_moyen_de_mois_de_preavis,
          "Raison_de_depart": item.Raison_de_depart,
          "Destination": item.Destination,
          "Nationalite": item.Nationalite,

          "Date_de_Naissance": item.Date_de_Naissance,
        };


        /* var date_predict = {"predict_value": item.predict, "date_value": item.date, "time_value": item.time,
         "Age": item.Age,
         "Civilite": item.Age,
         "DateEmbauche":  item.DateEmbauche,
         "EXPERIENCE_AVANT_SOFRECOM":  item.EXPERIENCE_AVANT_SOFRECOM,
         "EXPERIENCE_SOFRECOM":  item.EXPERIENCE_SOFRECOM,
         "EXPERIENCE_Totale":  item.EXPERIENCE_Totale,
         "Ecole":  item.Ecole,
         "Manager":  item.Manager,
         "Matricule":  item.Matricule,
         "Metier":  item.Metier,
         "Pole":  item.Pole,
         "Poste":  item.Poste};
         */
        var queryname;
        if (item.Matricule == null) {
          queryname = {"Matricule": item.Matricule};
        }
        else {
          queryname = {"Matricule": item.Matricule};
        }


        Prediction.findOneAndUpdate(queryname, {$push: {date_predict: date_predict}}, {
          upsert: true,
          new: true
        }, function (err3, doc) {
          if (err) {
            console.log(err);

          }
          res.json(date_predict);
        });






        if (error) {
          console.log("erreur")

        }

      });


    });
  }






  count_predict = (req, res) => {
    /*
     this.model.count((err, count) => {
     if (err) { return console.error(err); }
     res.json(count);
     });*/

    Prediction.aggregate(
      [{
        $unwind: "$date_predict"
      },
        {
          $group: {
            _id: "$date_predict.date_value",
            count: {$sum: 1}
          }
        }
      ],
      function (err, res2) {
        if (err) return console.log(err);
     // [ { maxBalance: 98000 } ]
      });
    /*
     const aggregatorOpts = [{
     $unwind: "$date_predict"
     },
     {
     $group: {
     _id: "$date_predict.date_value",
     count: { $sum: 1 }
     }
     }
     ]

     console.log(this.model.aggregate(aggregatorOpts).exec());
     */
  }


  predict_all = (req, res) => {
    var users;


    DataSet.find({}, (err, user) => {
      if (err) {
        console.log(err);
      }
      users = user;
      var tab_users = [];


      for (var i = 0; i < users.length; i++) {

        tab_users.push({
          Matricule: users[i].Matricule,
          Civilite: users[i].Civilite,
          DateEmbauche: users[i].DateEmbauche,
          EXPERIENCE_AVANT_SOFRECOM: users[i].EXPERIENCE_AVANT_SOFRECOM,
          EXPERIENCE_SOFRECOM: users[i].EXPERIENCE_SOFRECOM,
          EXPERIENCE_Totale: users[i].EXPERIENCE_Totale,
          Ecole: users[i].Ecole,
          Poste: users[i].Poste,
          Metier: users[i].Metier,
          Pole: users[i].Pole,
          Manager: users[i].Manager,
          Age: users[i].Age,
          C1: users[i].C1,
          SITUATION_FAMILIALE: users[i].SITUATION_FAMILIALE,
          C2: users[i].C2,
          C3: users[i].C3
        });
      }
      const xls = json2xls(tab_users);

      fs.writeFileSync(this.pathFile + '/datasetAll.xlsx', xls, 'binary');





      var obj = xlsx.parse(this.pathFile + '/datasetAll.xlsx'); // parses a file
      var rows = [];
      var writeStr = "";

//looping through all sheets
      for (var i = 0; i < obj.length; i++) {

        var sheet = obj[i];
        //loop through all rows in the sheet
        for (var j = 0; j < sheet['data'].length; j++) {

          //add the row to the rows array
          rows.push(sheet['data'][j]);

        }
      }

//creates the csv string to write it to a file
      for (var i = 0; i < rows.length; i++) {


        writeStr += rows[i].join(";") + "\n";

      }


      fs.writeFile(this.pathFile + "/datasetAll.csv", writeStr, function (err) {
        if (err) {
          return console.log(err);
        }
      });
      res.send(this.pathFile);
    });
  }
  predict_per_person = (req, res) => {

    const jsonPrediction = {
      //Name: req.body.Name,
      Matricule: req.body.Matricule,
      Civilite: req.body.Civilite,
      DateEmbauche: req.body.DateEmbauche,
      EXPERIENCE_AVANT_SOFRECOM: req.body.EXPERIENCE_AVANT_SOFRECOM,
      EXPERIENCE_SOFRECOM: req.body.EXPERIENCE_SOFRECOM,
      EXPERIENCE_Totale: req.body.EXPERIENCE_Totale,
      Ecole: req.body.Ecole,
      Poste: req.body.Poste,
      Metier: req.body.Metier,
      Pole: req.body.Pole,
      Manager: req.body.Manager,
      Age: req.body.Age,
      SITUATION_FAMILIALE: req.body.SITUATION_FAMILIALE,
      C1: req.body.C1,
      C2: req.body.C2,
      C3: req.body.C3,
      //Dem: req.body.Dem
    };

    // const pathFile = 'C:/Users/s.ghorbel/Desktop/test';

    this.generate_csv(this.pathFile, jsonPrediction);
    // req.body.push(pathFile)
    res.send(this.pathFile);
    //res.json(pathFile);
  }

  generate_csv(pathFile, ConvertPersonObjectToCsv) {

    /*var json = {
     foo: 'bar',
     qux: 'moo',
     poo: 123,
     stux: new Date()
     }*/


    const xls = json2xls(ConvertPersonObjectToCsv);

    fs.writeFileSync(pathFile + '/predict.xlsx', xls, 'binary');



    var obj = xlsx.parse(pathFile + '/predict.xlsx'); // parses a file
    var rows = [];
    var writeStr = "";

//looping through all sheets
    for (var i = 0; i < obj.length; i++) {

      var sheet = obj[i];
      //loop through all rows in the sheet
      for (var j = 0; j < sheet['data'].length; j++) {

        //add the row to the rows array
        rows.push(sheet['data'][j]);

      }
    }

//creates the csv string to write it to a file
    for (var i = 0; i < rows.length; i++) {


      writeStr += rows[i].join(";") + "\n";

    }


    fs.writeFile(pathFile + "/predict.csv", writeStr, function (err) {
      if (err) {
        return console.log(err);
      }
    });
  }


  /* update_name = (req, res) => {


   //console.log(req.body);
   var item = req.body;

   var date_predict = {"predict_value": item.predict, "date_value": item.date, "time_value": item.time};
   var queryname = {"name": item.name};


   Prediction.findOneAndUpdate(queryname, {$push: {date_predict: date_predict}}, {
   upsert: true,
   new: true
   }, function (err, doc) {
   if (err) {
   console.log(err);
   return res.sendStatus(405)
   }
   return res.sendStatus(200);
   });


   }

   */

  update_prediction_all = (req, res) => {


    //console.log(req.body);
    var table_predictions = req.body;

    for (var i = 0; i < table_predictions.length; i++) {
      var date_predict = {
        "predict_value": table_predictions[i].predict,
        "date_value": table_predictions[i].date,
        "time_value": table_predictions[i].time,
        "Age": table_predictions[i].Age,
        "Civilite": table_predictions[i].Civilite,
        "DateEmbauche": table_predictions[i].DateEmbauche,
        "EXPERIENCE_AVANT_SOFRECOM": table_predictions[i].EXPERIENCE_AVANT_SOFRECOM,
        "EXPERIENCE_SOFRECOM": table_predictions[i].EXPERIENCE_SOFRECOM,
        "EXPERIENCE_Totale": table_predictions[i].EXPERIENCE_Totale,
        "Ecole": table_predictions[i].Ecole,
        "Manager": table_predictions[i].Manager,
        "Matricule": table_predictions[i].Matricule,
        "Metier": table_predictions[i].Metier,
        "Pole": table_predictions[i].Pole,
        "Poste": table_predictions[i].Poste,
        "SITUATION_FAMILIALE": table_predictions[i].SITUATION_FAMILIALE,
        "C1": table_predictions[i].C1,
        "C2": table_predictions[i].C2,
        "C3": table_predictions[i].C3,
      };
      var queryname;

      queryname = {"Matricule": table_predictions[i].Matricule};

      Prediction.findOneAndUpdate(queryname, {$push: {date_predict: date_predict}}, {
        upsert: true,
        new: true
      }, function (err, doc) {
        if (err) {
          console.log(err);

          return res.sendStatus(404);
        }

      });


    }

    res.sendStatus(200);
  }


  update_prediction_person = (req, res) => {


    //console.log(req.body);
    var item = req.body;
    var date_predict = {
      "predict_value": item.predict, "date_value": item.date, "time_value": item.time, "Age": item.Age,
      "Civilite": item.Civilite,
      "DateEmbauche": item.DateEmbauche,
      "EXPERIENCE_AVANT_SOFRECOM": item.EXPERIENCE_AVANT_SOFRECOM,
      "EXPERIENCE_SOFRECOM": item.EXPERIENCE_SOFRECOM,
      "EXPERIENCE_Totale": item.EXPERIENCE_Totale,
      "Ecole": item.Ecole,
      "Manager": item.Manager,
      "Matricule": item.Matricule,
      "Metier": item.Metier,
      "Pole": item.Pole,
      "Poste": item.Poste,
      "SITUATION_FAMILIALE": item.SITUATION_FAMILIALE,
      "C1": item.C1,
      "C2": item.C2,
      "C3": item.C3,
    };
    /* var date_predict = {"predict_value": item.predict, "date_value": item.date, "time_value": item.time,
     "Age": item.Age,
     "Civilite": item.Age,
     "DateEmbauche":  item.DateEmbauche,
     "EXPERIENCE_AVANT_SOFRECOM":  item.EXPERIENCE_AVANT_SOFRECOM,
     "EXPERIENCE_SOFRECOM":  item.EXPERIENCE_SOFRECOM,
     "EXPERIENCE_Totale":  item.EXPERIENCE_Totale,
     "Ecole":  item.Ecole,
     "Manager":  item.Manager,
     "Matricule":  item.Matricule,
     "Metier":  item.Metier,
     "Pole":  item.Pole,
     "Poste":  item.Poste};
     */
    var queryname;
    if (item.Matricule == null) {
      queryname = {"Matricule": item.Matricule};
    }
    else {
      queryname = {"Matricule": item.Matricule};
    }


    Prediction.findOneAndUpdate(queryname, {$push: {date_predict: date_predict}}, {
      upsert: true,
      new: true
    }, function (err, doc) {
      if (err) {
        console.log(err);
        return res.sendStatus(405)
      }
      return res.sendStatus(200);
    });


  }

  /* update_name = (req, res) => {


   //console.log(req.body);
   var item = req.body;

   var date_predict = {"predict_value": item.predict, "date_value": item.date, "time_value": item.time};
   var queryname = {"name": item.name};
   var query = {"name": item.name, 'date_predict.date_value': "10/08/2017"};

   Prediction.findOneAndUpdate(queryname, {$push: {date_predict: date_predict}}, {upsert: true}, function (err, doc) {
   if (err) {
   res.sendStatus(404);
   }
   res.sendStatus(201);
   console.log('check');
   });


   }
   */

  /* Prediction.findOneAndUpdate(query, {$push: {date_predict: date_predict}}, {upsert: true}, function (err, doc) {

   if (err) {
   return res.send(500, {error: err});
   }
   console.log(doc);
   }
   */
//}

  /*
   const query = {"name": req.body.name};
   const date_predict = {"predict_value": req.body.predict, "date_value": req.body.date};
   Prediction.findOneAndUpdate(query, {$push: {date_predict: date_predict}}, {upsert: true}, function (err, doc) {
   if (err) {
   return res.send(500, {error: err});
   }
   res.sendStatus(201);
   console.log('check');
   });
   */
// }
  /* update_name = (req, res) => {
   //console.log(req.body);
   let table = [];
   table = req.body;
   var val;
   for (var i in table) {
   //console.log(table[i]);
   var item = table[i];

   var date_predict = {"predict_value": item.predict, "date_value": item.date};
   var query = {"name": item.name, 'date_predict.date_value': "3/08/2017"};
   var queryname = {"name": item.name};
   console.log('*********************' + query.name);
   var j = 0;
   Prediction.find(query, (err, doc) => {
   var stringdoc = JSON.stringify(doc);


   // this user don't have this predict date. So we will add it
   if (stringdoc === "[]") {

   console.log('3333333');
   console.log(typeof stringdoc);
   console.log(err);


   }
   //we will not add this date beacause user have this date
   else {
   queryname = {"name": table[i].name};
   console.log('11111');
   console.log(doc[0].name);
   console.log(err);

   }

   }
   );

   /* Prediction.findOneAndUpdate(query, {$push: {date_predict: date_predict}}, {upsert: true}, function (err, doc) {

   if (err) {
   return res.send(500, {error: err});
   }
   console.log(doc);
   }
   */
//}
//res.sendStatus(201);
  /*
   const query = {"name": req.body.name};
   const date_predict = {"predict_value": req.body.predict, "date_value": req.body.date};
   Prediction.findOneAndUpdate(query, {$push: {date_predict: date_predict}}, {upsert: true}, function (err, doc) {
   if (err) {
   return res.send(500, {error: err});
   }
   res.sendStatus(201);
   console.log('check');
   });
   */
//}

  PredictionAllPerson = (req, res) => {

    const todayTime = new Date();

    const hour = ('0' + todayTime.getHours()).slice(-2);
    const minute = ('0' + todayTime.getMinutes()).slice(-2);
    const sec = ('0' + todayTime.getSeconds()).slice(-2);
    const timeNow = hour + ':' + minute + ':' + sec;


    var dateNow = req.body.dateNow.split("/");
     dateNow  = dateNow[1] + "/"+ dateNow[0] + "/" + dateNow[2];
    DataSet.find({DEM:0}, (err, DatasetList) => {
      // opération de date
      if (err) { return console.error(err); }
      var resultliste = [];
      DatasetList.forEach ((entry,i) => {
       /* var objj = {};
        objj['Matricule']=entry.Matricule;
        objj['NOM']=entry.NOM;
        objj['PRENOM']=entry.PRENOM;
        objj['Civilite']=entry.Civilite;
        objj['DateEmbauche']=entry.DateEmbauche;
        objj['Date_de_Naissance']=entry.Date_de_Naissance;
        objj['SITUATION_FAMILIALE']=entry.SITUATION_FAMILIALE;
        objj['EXPERIENCE_AVANT_SOFRECOM']=entry.EXPERIENCE_AVANT_SOFRECOM;
        objj['Ecole']=entry.Ecole;
        objj['Manager']=entry.Manager;

        objj['Pole']=entry.Pole;
        objj['Poste']=entry.Poste;
        objj['Seniorite']=entry.Seniorite;
        objj['Niveau_Academique']=entry.Niveau_Academique;
        objj['Dernier_Employeur']=entry.Dernier_Employeur;
        objj['Eval_3_mois']=entry.Eval_3_mois;


        objj['Fin_PE']=entry.Fin_PE;
        objj['Mois']=entry.Mois;
        objj['Date_de_depot_de_demission']=entry.Date_de_depot_de_demission;
        objj['DATE_SORTIE_Paie']=entry.DATE_SORTIE_Paie;
        objj['Date_de_sortie_RH']=entry.Date_de_sortie_RH;

        objj['Mois_de_sortie_RH']=entry.Mois_de_sortie_RH;
        objj['ANNEE_SORTIE']=entry.ANNEE_SORTIE;
        objj['MOIS_SORTIE']=entry.MOIS_SORTIE;
        objj['Moyenne_preavis']=entry.Moyenne_preavis;
        objj['Nombre_moyen_de_mois_de_preavis_Arrondi']=entry.Nombre_moyen_de_mois_de_preavis_Arrondi;
        objj['Nombre_moyen_de_mois_de_preavis']=entry.Nombre_moyen_de_mois_de_preavis;
        objj['Raison_de_depart']=entry.Raison_de_depart;
        objj['Destination']=entry.Destination;
        objj['Nationalite']=entry.Nationalite;
        objj['DEM']=entry.DEM;

*/
       // var updatedateNow =  month + '/' + day + '/' + year;

        var dateExperience = entry.Date_de_Naissance;
        dateExperience = dateExperience.split("/");
        var newDateExperienceupdated = dateExperience[1] + "/"+ dateExperience[0] + "/" + dateExperience[2];
        var date2 = new Date(newDateExperienceupdated);

        var date1 = new Date(req.body.dateNow);

        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        var num= diffDays/365;
        var NewAge = num.toFixed(2);
          entry['Age']=NewAge;



                          var dateEmbaucheUpdate =  entry.DateEmbauche;
                          dateEmbaucheUpdate = dateEmbaucheUpdate.split("/");
                          var newdateEmbaucheUpdate  = dateEmbaucheUpdate[1] + "/"+ dateEmbaucheUpdate[0] + "/" + dateEmbaucheUpdate[2];
                          var date3 = new Date(newdateEmbaucheUpdate);
                          var timeDiff2 = Math.abs(date3.getTime() - date1.getTime());
                          var diffDays2 = Math.ceil(timeDiff2 / (1000 * 3600 * 24));
                          var num2= diffDays2/365;
                          var NewExperienceSofrecom = num2.toFixed(2);
                  entry['EXPERIENCE_SOFRECOM']= Number(NewExperienceSofrecom);
        entry['EXPERIENCE_Totale'] = Number( entry.EXPERIENCE_SOFRECOM) + Number( entry.EXPERIENCE_AVANT_SOFRECOM);


      });

      request({
        url: 'http://localhost:5002/PredictionAllEmployee',
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        json: DatasetList
//  body: JSON.stringify(requestData)
      },  (error, resp, body) => {
        var ListePrédictionResult = [];
        var ListPrédictionEmployee = JSON.parse(body);


        ListPrédictionEmployee.forEach ((entry,i) =>{
          var objectEntry = {};
          objectEntry['Matricule'] = entry.Matricule;
          objectEntry['DEM'] = entry.DEM;
          objectEntry['NOM'] = DatasetList[i].NOM;
          objectEntry['PRENOM'] = DatasetList[i].PRENOM;
          objectEntry['Temps'] = timeNow;
          objectEntry['datefull'] = dateNow;
          if (entry.DEM > 0.5){
            ListePrédictionResult.push(objectEntry);
          }
          //obj2 = JSON.parse(obj2);
          DatasetList[i].DEM = entry.DEM;
          var InfoPers =  DatasetList[i];
          InfoPers.date = dateNow;
          InfoPers.time = timeNow;
          InfoPers.predict = InfoPers.DEM;
          var item = InfoPers;

          /* var updatedateNow =  month + '/' + day + '/' + year;

           var dateExperience = item.Date_de_Naissance;
           dateExperience = dateExperience.split("/");
           var newDateExperienceupdated = dateExperience[1] + "/"+ dateExperience[0] + "/" + dateExperience[2];
           var date2 = new Date(newDateExperienceupdated);
           var date1 = new Date(updatedateNow);
           var timeDiff = Math.abs(date2.getTime() - date1.getTime());
           var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
           var num= diffDays/365;
           var NewAge = num.toFixed(2);

           item.Age=NewAge;

           var dateEmbaucheUpdate = item.DateEmbauche;
           dateEmbaucheUpdate = dateEmbaucheUpdate.split("/");
           var newdateEmbaucheUpdate  = dateEmbaucheUpdate[1] + "/"+ dateEmbaucheUpdate[0] + "/" + dateEmbaucheUpdate[2];
           var date3 = new Date(newdateEmbaucheUpdate);
           var timeDiff2 = Math.abs(date3.getTime() - date1.getTime());
           var diffDays2 = Math.ceil(timeDiff2 / (1000 * 3600 * 24));
           var num2= diffDays2/365;
           var NewExperienceSofrecom = num2.toFixed(2);
           item.EXPERIENCE_SOFRECOM = Number(NewExperienceSofrecom);
           item.EXPERIENCE_Totale = Number(item.EXPERIENCE_SOFRECOM) + Number(item.EXPERIENCE_AVANT_SOFRECOM); */
          var date_predict = {
            "predict_value": item.predict, "date_value": item.date, "time_value": item.time, "Age": item.Age,
            "Civilite": item.Civilite,
            "NOM": item.NOM,
            "PRENOM": item.PRENOM,
            "DateEmbauche": item.DateEmbauche,
            "EXPERIENCE_AVANT_SOFRECOM": item.EXPERIENCE_AVANT_SOFRECOM,
            "EXPERIENCE_SOFRECOM": item.EXPERIENCE_SOFRECOM,
            "EXPERIENCE_Totale": item.EXPERIENCE_Totale,
            "Ecole": item.Ecole,
            "Manager": item.Manager,
            "Matricule": item.Matricule,
            "Pole": item.Pole,
            "Poste": item.Poste,
            "SITUATION_FAMILIALE": item.SITUATION_FAMILIALE,
            "Seniorite": item.Seniorite,
            "Niveau_Academique": item.Niveau_Academique,
            "Dernier_Employeur": item.Dernier_Employeur,

            "Eval_3_mois": item.Eval_3_mois,
            "Fin_PE":item.Fin_PE,
            "Mois": item.Mois,
            "Date_de_depot_de_demission": item.Date_de_depot_de_demission,

            "DATE_SORTIE_Paie": item.DATE_SORTIE_Paie,
            "Date_de_sortie_RH": item.Date_de_sortie_RH,
            "Mois_de_sortie_RH": item.Mois_de_sortie_RH,
            "ANNEE_SORTIE": item.ANNEE_SORTIE,
            "MOIS_SORTIE": item.MOIS_SORTIE,

            "Moyenne_preavis": item.Moyenne_preavis,
            "Nombre_moyen_de_mois_de_preavis_Arrondi": item.Nombre_moyen_de_mois_de_preavis_Arrondi,
            "Nombre_moyen_de_mois_de_preavis": item.Nombre_moyen_de_mois_de_preavis,
            "Raison_de_depart": item.Raison_de_depart,
            "Destination": item.Destination,
            "Nationalite": item.Nationalite,

            "Date_de_Naissance": item.Date_de_Naissance,
          };
          var queryname = {"Matricule": item.Matricule};

          Prediction.findOneAndUpdate(queryname, {$push: {date_predict: date_predict}}, {
            upsert: true,
            new: true
          },  (err3, doc) => {
            if (err) {
              console.log(err);

            }

            if (i == ListPrédictionEmployee.length -1)
            { console.log(ListePrédictionResult.length)
              ListePrédictionResult.sort((a,b) => b.DEM - a.DEM);

              res.json(ListePrédictionResult);}

          });




        });

      });
    });

  }

  get_name = (req, res) => {
    const query = {"name": req.body.name};
    Prediction.findOne(query, function (err, doc) {
      if (err) {
        return res.send(500, {error: err});
      }
      res.sendStatus(201);
    });
  }
  /* update_name = (req, res) => {

   Prediction.findName(req.body._id, function (err, info) {
   if (err) {
   return res.send("contact create error: " + err);
   }

   // add the message to the contacts messages
   Prediction.update({_id: req.body._id}, {
   $push: {
   "messages": {
   title: 'sami',
   msg: 'hhhhh'
   }
   }
   }, function (error, numAffected, rawResponse) {
   if (error) return res.send("contact addMsg error: " + error);
   console.log('The number of updated documents was %d', numAffected);
   console.log('The raw response from Mongo was ', rawResponse);

   });
   });
   }

   */
  /* this.model.findOneAndUpdate({name: req.body.name}, {$set: {predict: 1}}, {new: true}, function(err, predict)  {
   if (predict) {
   res.sendStatus(404);
   }
   if (!predict) {

   if (err) {
   res.sendStatus(408);
   return console.error(err);
   }
   res.sendStatus(202);
   }
   }); */

  getByMatricule = (req, res) => {
    this.model.findOne({Matricule: req.params.Matricule}, (err, obj) => {
      if (err) {
        return console.error(err);
      }
      res.json(obj);
    });
  };
  insert_predict = (req, res) => {

    this.model.findOne({name: req.body.name}, (err, predict) => {
      if (predict) {

        const obj = new this.model(req.body);
        obj.save((error, item) => {
          // 11000 is the code for duplicate key error
          if (error && error.code === 11000) {
            res.sendStatus(404);
          }
          if (error) {
            return console.error(error);
          }
          res.status(200).json(item);
        });
      }

      if (!predict) {

        this.model.findOneAndUpdate({name: req.body.name}, {$set: {predict: 1}}, {new: true}, function (erro, doc) {
          if (erro) {

            res.sendStatus(403);
          }

          console.log(doc);
        });
      }


    });
  };


}
