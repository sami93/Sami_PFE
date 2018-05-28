import Test from '../models/test';
import BaseCtrl from './base';
var json2csv = require('json2csv');
var json2xls = require('json2xls');
var fs = require('fs');
var xlsx = require('node-xlsx').default;
export default class TestCtrl extends BaseCtrl {
  model = Test;

  predict_per_person = (req, res) => {
    const json2 = {
      pclass: 1,
      survived: 1,
      name: req.body.name,
      sex: 'female',
      age: 29,
      sibsp: 0,
      parch: 0,
      ticket: 24160,
      fare: '211,444',
      cabin: 'B5',
      embarked: 'S',
      boat: 2,
      body: ''
    };
    const pathFile = 'C:/Users/s.ghorbel/Desktop/test';
    this.generate_csv(pathFile, json2);
    // req.body.push(pathFile)
    res.send(pathFile);
    //res.json(pathFile);
  }

  generate_csv(pathFile, ConvertPersonObjectToCsv) {
    console.log('*****will generate a csv File*****');

    console.log(typeof ConvertPersonObjectToCsv);
    console.log(ConvertPersonObjectToCsv);
    /*var json = {
     foo: 'bar',
     qux: 'moo',
     poo: 123,
     stux: new Date()
     }*/


    const xls = json2xls(ConvertPersonObjectToCsv);

    fs.writeFileSync(pathFile + '/predict.xlsx', xls, 'binary');


    console.log('*********************');
    console.log(__dirname);

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
      console.log("******predict.csv was saved in the current directory!*******");
    });
  }


  update_name = (req, res) => {


    //console.log(req.body);
    var item = req.body;

    var date_predict = {"predict_value": item.predict, "date_value": item.date, "time_value": item.time};
    var queryname = {"name": item.name};


    Test.findOneAndUpdate(queryname, {$push: {date_predict: date_predict}}, {upsert: true, new: true}, function (err, doc) {
      if (err) {
        console.log(err);
        return res.sendStatus(405)
      }
      return res.sendStatus(200);
    });


  }


  /* Test.findOneAndUpdate(query, {$push: {date_predict: date_predict}}, {upsert: true}, function (err, doc) {

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
   Test.findOneAndUpdate(query, {$push: {date_predict: date_predict}}, {upsert: true}, function (err, doc) {
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
   Test.find(query, (err, doc) => {
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

   /* Test.findOneAndUpdate(query, {$push: {date_predict: date_predict}}, {upsert: true}, function (err, doc) {

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
   Test.findOneAndUpdate(query, {$push: {date_predict: date_predict}}, {upsert: true}, function (err, doc) {
   if (err) {
   return res.send(500, {error: err});
   }
   res.sendStatus(201);
   console.log('check');
   });
   */
//}


  get_name = (req, res) => {
    const query = {"name": req.body.name};
    Test.findOne(query, function (err, doc) {
      if (err) {
        return res.send(500, {error: err});
      }
      res.sendStatus(201);
    });
  }
  /* update_name = (req, res) => {



   // add the message to the contacts messages
   Test.update({name: req.body.name}, {
   $push: {
   "date_predict": {
   predict_value: 0,
   date_value: '31/08/2017'
   }
   }
   }, function (error, numAffected, rawResponse) {
   if (error) return res.send("contact addMsg error: " + error);
   console.log('The number of updated documents was %d', numAffected);
   console.log('The raw response from Mongo was ', rawResponse);

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


  insert_predict = (req, res) => {
    console.log(req.body);
    console.log('************insert_preditct');
    console.log(req.body.name);
    this.model.findOne({name: req.body.name}, (err, predict) => {
      if (predict) {
        console.log('************hiiiiiiiiiiiiii');
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
        console.log('************holaaaaa***********');
        this.model.findOneAndUpdate({name: req.body.name}, {$set: {predict: 1}}, {new: true}, function (erro, doc) {
          if (erro) {
            console.log('Something wrong when updating data!');
            res.sendStatus(403);
          }

          console.log(doc);
        });
      }


    });
  };


}
