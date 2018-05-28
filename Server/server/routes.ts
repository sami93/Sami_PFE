import * as express from 'express';

import CatCtrl from './controllers/cat';
import UserCtrl from './controllers/user';
import Cat from './models/cat';
import User from './models/user';
import PredictCtrl from './controllers/prediction';
import Prediction from './models/prediction';
import TestCtrl from './controllers/test';
import DataSetCtrl from './controllers/dataset';

export default function setRoutes(app) {

  const router = express.Router();

  const catCtrl = new CatCtrl();
  const userCtrl = new UserCtrl();
  const predictionCtrl = new PredictCtrl();
  const testCtrl = new TestCtrl();

  const dataSetCtrl = new DataSetCtrl();
  router.route('/dataset').get(dataSetCtrl.getAll);
  router.route('/dataset/count').get(dataSetCtrl.count);
  router.route('/dataset/count_partition_Age').get(dataSetCtrl.count_partition_Age);
  router.route('/dataset/count_Civilite').get(dataSetCtrl.count_Civilite);
  router.route('/dataset/count_Civilite_count/:civilite').get(dataSetCtrl.count_Civilite_count);
  router.route('/dataset/Liste_Manager').get(dataSetCtrl.Liste_Manager);
  router.route('/dataset/Liste_Pole').get(dataSetCtrl.Liste_Pole);
  router.route('/dataset/Liste_Poste').get(dataSetCtrl.Liste_Poste);
  router.route('/dataset/Liste_Seniorite').get(dataSetCtrl.Liste_Seniorite);
  router.route('/dataset/Liste_SITUATION_FAMILIALE').get(dataSetCtrl.Liste_SITUATION_FAMILIALE);
  router.route('/dataset/Liste_Civilite').get(dataSetCtrl.Liste_Civilite);
  router.route('/dataset/count_Manager').get(dataSetCtrl.count_Manager);
  router.route('/dataset/count_Seniorite').get(dataSetCtrl.count_Seniorite);
  router.route('/dataset/count_SITUATION_FAMILIALE').get(dataSetCtrl.count_SITUATION_FAMILIALE);
  router.route('/dataset/count_Pole').get(dataSetCtrl.count_Pole);
  router.route('/dataset').post(dataSetCtrl.insert);
  router.route('/dataset/:id').get(dataSetCtrl.get);
  router.route('/datasets/:name').get(dataSetCtrl.getByName);
  router.route('/datasetsMat/:Matricule').get(dataSetCtrl.getByMatricule);
  router.route('/dataset/:id').put(dataSetCtrl.update);
  router.route('/dataset/:Matricule').delete(dataSetCtrl.deleteByMat);
  // Cats
  router.route('/cats').get(catCtrl.getAll);
  router.route('/cats/count').get(catCtrl.count);
  router.route('/cat').post(catCtrl.insert);
  router.route('/cat/:id').get(catCtrl.get);
  router.route('/cat/:id').put(catCtrl.update);
  router.route('/cat/:id').delete(catCtrl.delete);
  // Prediction
  router.route('/predictionPerPerson/:Matricule').get(predictionCtrl.PredictPersonTensorflow);
  router.route('/prediction').post(predictionCtrl.insert);
  router.route('/predictions').get(predictionCtrl.getAll);
  //router.route('/predicion_update').put(predictionCtrl.update_name);
  router.route('/prediction_update').patch(predictionCtrl.update_prediction_person);
  router.route('/prediction_update_all').patch(predictionCtrl.update_prediction_all);
  router.route('/prediction/:id').get(predictionCtrl.get);
   router.route('/prediction/getPathOfCsvPersonToPredict').post(predictionCtrl.predict_per_person);
  router.route('/prediction/allPerson').post(predictionCtrl.predict_all);
  router.route('/predictionMat/:Matricule').get(predictionCtrl.getByMatricule);
  router.route('/predictionCount').get(predictionCtrl.count_predict);

  router.route('/test_update').patch(testCtrl.update_name);
  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);


  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
