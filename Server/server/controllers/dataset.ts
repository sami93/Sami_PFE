import DataSet from '../models/dataset';
import BaseCtrl from './base';
import Prediction from '../models/prediction';

export default class DataSetCtrl extends BaseCtrl {
  model = DataSet;
  TableCivilite : any = [];

  getByName = (req, res) => {
    this.model.findOne({NOM: req.params.NOM}, (err, obj) => {
      if (err) {
        return console.error(err);
      }
      res.json(obj);
    });
  };
  count_Civilite_count = (req, res) => {
    DataSet.aggregate({ $match : { DEM : 1, Civilite: req.params.civilite} } ,{
      $group: {
        _id: "$Civilite",
        count: {$sum: 1}
      }
    },{$sort: {count: 1}}, function (err, ListeCivilite) {


      res.json(ListeCivilite);


    });

  };

  getByMatricule = (req, res) => {
    this.model.findOne({Matricule: req.params.Matricule}, (err, obj) => {
      if (err) {
        return console.error(err);
      }
      res.json(obj);
    });
  };
  Liste_Manager = (req, res) => {


    DataSet.aggregate({
      $group: {
        _id: { $toLower: "$Manager" },
      }
    },{$sort: {_id: 1}}, function (err, ListeManagers) {
      res.json(ListeManagers);
    });
  }

  Liste_Pole = (req, res) => {


    DataSet.aggregate({
      $group: {
        _id: { $toLower: "$Pole" },
      }
    },{$sort: {_id: 1}}, function (err, ListePole) {
      res.json(ListePole);
    });
  }

  Liste_Poste = (req, res) => {


    DataSet.aggregate({
      $group: {
        _id: { $toLower: "$Poste" },
      }
    },{$sort: {_id: 1}}, function (err, Liste_Poste) {
      res.json(Liste_Poste);
    });
  }

  Liste_Seniorite = (req, res) => {


    DataSet.aggregate({
      $group: {
        _id: { $toLower: "$Seniorite" },
      }
    },{$sort: {_id: 1}}, function (err, ListeSeniorite) {
      res.json(ListeSeniorite);
    });
  }
  Liste_SITUATION_FAMILIALE = (req, res) => {


    DataSet.aggregate({
      $group: {
        _id: { $toLower: "$SITUATION_FAMILIALE" },
      }
    },{$sort: {_id: 1}}, function (err, ListeSITUATION_FAMILIALE) {
      res.json(ListeSITUATION_FAMILIALE);
    });
  }

  Liste_Civilite = (req, res) => {


    DataSet.aggregate({
      $group: {
        _id: "$Civilite",
      }
    },{$sort: {_id: 1}}, function (err, ListeCivilite) {
      res.json(ListeCivilite);
    });
  }

  count_Manager2 = (req, res) => {
    /*
     this.model.count((err, count) => {
     if (err) { return console.error(err); }
     res.json(count);
     });*/


    DataSet.aggregate({ $match : { DEM : 0} },{
      $group: {
        _id: { $toLower: "$Manager" },
        count: {$sum: 1}
      }
    },{$sort: {count: -1}}, function (err, ListeManagers) {
      res.json(ListeManagers);
    });

    /*DataSet.aggregate([  {
      $group: {
        _id: "$Age",
        count: {
          $sum: 1
        }
      }
    }], function(err, ListeManagers) {
      console.log(ListeManagers)
    });
*/
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

  count_Manager = (req, res) => {
    /*
     this.model.count((err, count) => {
     if (err) { return console.error(err); }
     res.json(count);
     });*/


    DataSet.aggregate({
      $group: {
        _id: { $toLower: "$Manager" },
        count: {$sum: 1}
      }
    },{$sort: {count: -1}}, function (err, ListeManagers) {
      res.json(ListeManagers);
    });

    /*DataSet.aggregate([  {
      $group: {
        _id: "$Age",
        count: {
          $sum: 1
        }
      }
    }], function(err, ListeManagers) {
      console.log(ListeManagers)
    });
*/
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

  count_Seniorite = (req, res) => {
    /*
     this.model.count((err, count) => {
     if (err) { return console.error(err); }
     res.json(count);
     });*/


    DataSet.aggregate({
      $group: {
        _id: { $toLower: "$Seniorite" },
        count: {$sum: 1}
      }
    },{$sort: {count: -1}}, function (err, ListeManagers) {
      res.json(ListeManagers);
    });

    /*DataSet.aggregate([  {
      $group: {
        _id: "$Age",
        count: {
          $sum: 1
        }
      }
    }], function(err, ListeManagers) {
      console.log(ListeManagers)
    });
*/
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
  count_SITUATION_FAMILIALE = (req, res) => {

    DataSet.aggregate({
      $group: {
        _id: { $toLower: "$SITUATION_FAMILIALE" },
        count: {$sum: 1}
      }
    },{$sort: {count: 1}}, function (err, count_SITUATION_FAMILIALE) {
      res.json(count_SITUATION_FAMILIALE);
    });

  }

  count_Pole = (req, res) => {

    DataSet.aggregate({
      $group: {
        _id: { $toLower: "$Pole" },
        count: {$sum: 1}
      }
    },{$sort: {count: -1}}, function (err, count_Pole) {
    count_Pole.forEach ((entry) =>{
        //entry._id= entry._id.substring(100, 16);
      entry._id = entry._id.replace('sofrecomtunisie/','');
      entry._id = entry._id.replace('sofrecom tunisie/','');
      });
      res.json(count_Pole);
    });

  }
  count_Civilite = (req, res) => {


    DataSet.aggregate({
      $group: {
        _id: "$Civilite",
        count: {$sum: 1}
      }
    },{$sort: {count: 1}},  (err, ListeCivilite) => {
      this.TableCivilite = ListeCivilite;
      var j = 0;
      var ListCiviliteCount : any = [];
      this.TableCivilite.forEach ((entry) =>{

        DataSet.aggregate({ $match : { DEM : 1, Civilite:entry._id} } ,{
          $group: {
            _id: { $toLower: "$Civilite" },
            count: {$sum: 1}
          }

        },{$sort: {count: 1}},  (err2, ListeCivilite2) => {
          entry['tabs'] = ListeCivilite2[0];
          var tableentry :any = [];
          var obj= {};
          obj['_id']='DEM = 1 de ' + ListeCivilite2[0]._id + ' ';
          obj['count']=ListeCivilite2[0].count;
          tableentry.push(obj)
   obj = {};

          obj['_id']='DEM = 0 de ' + ListeCivilite2[0]._id + ' ';
          obj['count']=entry.count-ListeCivilite2[0].count;
          tableentry.push(obj);
          entry['tabs'] = tableentry;
          j++;
          ListCiviliteCount.push(entry);



          if (j==this.TableCivilite.length )
          {      res.json(ListCiviliteCount);
          }


        });

      });
      /*for (var i = 0; i < ListeCivilite.length; i++) {
        var obj = {};
        obj = ListeCivilite[i];
        DataSet.aggregate({ $match : { DEM : 1, Civilite:ListeCivilite[i]._id} } ,{
          $group: {
            _id: { $toLower: "$Civilite" },
            count: {$sum: 1}
          }

        },{$sort: {count: 1}},  (err2, ListeCivilite2) => {
          console.log(obj);
          console.log(ListeCivilite2);


        });

      };*/




    });



  }

  count_partition_Age = (req, res) => {
    DataSet.aggregate({
      $match: {Age: {$gte: 20, $lt: 25}}
    },
    {$group: {
        _id: "20-25",
        count: {
          $sum: 1
        }
      }
    },
    function (err, age2025) {

      DataSet.aggregate({
          $match: {Age: {$gte: 25, $lt: 30}}
        },
        {$group: {
            _id: "25-30",
            count: {
              $sum: 1
            }
          }
        }, function (err2, age2530) {
          age2025 = age2025.concat(age2530)

          DataSet.aggregate({
              $match: {Age: {$gte: 30, $lt: 35}}
            },
            {$group: {
                _id: "30-35",
                count: {
                  $sum: 1
                }
              }
            }, function (err3, age3035) {


              age2025 = age2025.concat(age3035)

              DataSet.aggregate({
                  $match: {Age: {$gte: 35, $lt: 40}}
                },
                {$group: {
                    _id: "35-40",
                    count: {
                      $sum: 1
                    }
                  }
                }, function (err4, age3540) {
                  age2025 = age2025.concat(age3540)





                  DataSet.aggregate({
                      $match: {Age: {$gte: 40, $lt: 45}}
                    },
                    {$group: {
                        _id: "40-45",
                        count: {
                          $sum: 1
                        }
                      }
                    }, function (err5, age4045) {
                      age2025 = age2025.concat(age4045)




                      DataSet.aggregate({
                          $match: {Age: {$gte: 45}}
                        },
                        {$group: {
                            _id: ">=45",
                            count: {
                              $sum: 1
                            }
                          }
                        }, function (err6, age45infin) {
                          age2025 = age2025.concat(age45infin)







                          res.json (age2025);




                        });




                    });





                });



            });


        });
    });







  }
  deleteByMat = (req, res) => {
    this.model.findOneAndRemove({Matricule: req.params.Matricule}, (err) => {
      if (err) {
        return console.error(err);
      }
      Prediction.findOneAndRemove({Matricule: req.params.Matricule}, (errorPrediction) => {
        if (errorPrediction) {
          return console.error(errorPrediction);
        }
        res.sendStatus(200);
      });

    });
  };
}
