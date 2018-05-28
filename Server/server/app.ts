import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';


import setRoutes from './routes';

const cors = require('cors');
const app = express();
app.use(cors())
/*

var exec = require('child_process').exec;
var cmd = 'mongoimport -d test -c tests --type csv --file C:/Users/s.ghorbel/Desktop/sami.csv --headerline';

*/


// app.use(cors({credentials: true, origin: true}));

dotenv.load({path: '.env'});
//app.set('port', (process.env.PORT || 3000));
app.set('port', 3000);
app.use('/', express.static(path.join(__dirname, '../public')));
var jsonParser = bodyParser.json({limit: 1024 * 1024 * 20, type: 'application/json'});
var urlencodedParser = bodyParser.urlencoded({
  extended: true,
  limit: 1024 * 1024 * 20,
  type: 'application/x-www-form-urlencoding'
})
app.use(jsonParser);
app.use(urlencodedParser);

app.use(morgan('dev'));
/* var options = {

  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 },  },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};
*/
var options = {
  socketTimeoutMS: 30000,
  keepAlive: true, // contains type discrepancy in the docs (boolean vs number)?
  reconnectTries: 30
};

mongoose.connect(process.env.MONGODB_URI, options);

const db = mongoose.connection;
(<any>mongoose).Promise = global.Promise;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  setRoutes(app);

  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.listen(app.get('port'), () => {
    console.log('Angular Full Stack listening on port ' + app.get('port'));
  });

});

export {app};
