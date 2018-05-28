
# coding: utf-8

# <h1><center>                          Turnover Sofrecom Machine Learning   </center></h1>

# #  Importation

# In[1]:


from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import json
import itertools
import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
import warnings
from sklearn.ensemble import IsolationForest
from pandas.io.json import json_normalize

warnings.filterwarnings('ignore')

from sklearn.ensemble import IsolationForest
from flask import Flask, make_response, request, jsonify
import csv
import warnings
import tensorflow as tf
from flask_cors import CORS


# In[2]:





# In[3]:


tf.logging.set_verbosity(tf.logging.ERROR)
tf.logging.set_verbosity(tf.logging.INFO)
warnings.filterwarnings('ignore')


import argparse
parser = argparse.ArgumentParser()
parser.add_argument('--batch_size', default=100, type=int, help='batch size')
parser.add_argument('--train_steps', default=1000, type=int,
                    help='number of training steps')
parser.add_argument('--price_norm_factor', default=1000., type=float,
                    help='price normalization factor')
app = Flask(__name__)
CORS(app)



# # Home

# In[4]:


@app.route('/')
def form():
    return """
        <html>
            <body>
                <h1>Turnover Sofrecom</h1>

                <form action="/import" method="post" enctype="multipart/form-data">
                   Dataset : <input type="file" name="dataset_file" />
                    <input type="submit" />
                </form>
    
            </body>
        </html>
    """


# # Declare functions 

# In[5]:


def input_fn(data_set, pred=False):
    if pred == False:
        feature_cols = {k: tf.constant(data_set[k].values) for k in FEATURES}
        labels = tf.constant(data_set[LABEL].values)
        return feature_cols, labels

    if pred == True:
        feature_cols = {k: tf.constant(data_set[k].values) for k in FEATURES}

        return feature_cols


# In[6]:


def to_submit(pred_y, name_out):
    global out
    print (pred_y)
    print (test.shape[0])

    y_predict = list(itertools.islice(pred_y, test.shape[0]))
    print('***************************')
    print (y_predict)
    for index, elem in enumerate(y_predict):
        if (y_predict[index]<0):
            y_predict[index] = 0.000
        elif (y_predict[index]>1):
            y_predict[index] = 1.000
        else:
            y_predict[index] = round(y_predict[index], 3)
        y_predict[index] = "%.3f" % y_predict[index]
    y_predict = pd.DataFrame(prepro_y.inverse_transform(np.array(y_predict).reshape(len(y_predict), 1)),
                             columns=['DEM'])
    print("2222")
    y_predict = y_predict.join(Matricule)
    # out = y_predict.to_json(orient='records')[1:-1].replace('},{', '} {')
    out = y_predict.to_json(orient='records')
    # out = json.dumps(out, indent=4)
    # print (out)
    # print(type(out))
    # out = y_predict.to_dict(orient='split')

    # The file with serialized data to retrieve

    result = y_predict.to_json('temp.json', orient='records', lines=True)
    y_predict.to_csv(name_out + '.csv', index=False)


# # Import Data

# In[7]:


# Import
@app.route('/import', methods=["POST"])
def import_dataset():

    print (request)
    file = request.files['dataset_file']
    global train
    global Civilite,SITUATION_FAMILIALE, Seniorite,Ecole,Niveau_Academique,Dernier_Employeur, Poste,Pole,Manager
    global column_names
    global Matricule
    global test
    column_names = ['Matricule','Civilite', 'EXPERIENCE_AVANT_SOFRECOM','EXPERIENCE_SOFRECOM','EXPERIENCE_Totale','Seniorite', 'Ecole', 'Niveau_Academique','Dernier_Employeur','Poste','Pole', 'Manager','Age','SITUATION_FAMILIALE','DEM']
    #column_names = ['Matricule','Civilite','EXPERIENCE_AVANT_SOFRECOM','EXPERIENCE_SOFRECOM','EXPERIENCE_Totale','Seniorite',
     #             'Ecole','Niveau_Academique','Dernier_Employeur','Mois','MOIS_SORTIE','Poste','Pole','Manager','Age','SITUATION_FAMILIALE','DEM' ]
    train = pd.read_csv(file, delimiter=';',    encoding="ISO-8859-1")
    test = train
    if not file:
        return "No file"
    train = train[column_names]

    train.drop('Matricule', axis=1, inplace=True)

    train['Civilite'] = train.Civilite.str.strip()
    train['Civilite'] = train.Civilite.str.lower()
    Civilite = {label: idx for idx, label in
                enumerate(np.unique(train['Civilite']))}
    train['Civilite'] = train['Civilite'].map(Civilite)
    
    
    print ('Civilité')
    print (Civilite)
    #train['Seniorite'] = train['Seniorite'].factorize()[0]
    
    train['Seniorite'] = train.Seniorite.str.strip()
    train['Seniorite'] = train.Seniorite.str.lower()
    Seniorite = {label: idx for idx, label in
                   enumerate(np.unique(train['Seniorite']))}
    train['Seniorite'] = train['Seniorite'].map(Seniorite)
    
    train['Ecole'] = train.Ecole.str.strip()
    train['Ecole'] = train.Poste.str.lower()
    Ecole = {label: idx for idx, label in
                    enumerate(np.unique(train['Ecole']))}
    train['Ecole'] = train['Ecole'].map(Ecole)
    
    train['Niveau_Academique'] = train.Niveau_Academique.str.strip()
    train['Niveau_Academique'] = train.Niveau_Academique.str.lower()
    Niveau_Academique = {label: idx for idx, label in
                    enumerate(np.unique(train['Niveau_Academique']))}
    train['Niveau_Academique'] = train['Niveau_Academique'].map(Niveau_Academique)
    
    train['Dernier_Employeur'] = train.Dernier_Employeur.str.strip()
    train['Dernier_Employeur'] = train.Dernier_Employeur.str.lower()
    Dernier_Employeur = {label: idx for idx, label in
                    enumerate(np.unique(train['Dernier_Employeur']))}
    train['Dernier_Employeur'] = train['Dernier_Employeur'].map(Dernier_Employeur)

    train['Poste'] = train.Poste.str.strip()
    train['Poste'] = train.Poste.str.lower()
    Poste = {label: idx for idx, label in
                    enumerate(np.unique(train['Poste']))}
    train['Poste'] = train['Poste'].map(Poste)
    
    train['Pole'] = train.Pole.str.strip()
    train['Pole'] = train.Pole.str.lower()
    Pole = {label: idx for idx, label in
                    enumerate(np.unique(train['Pole']))}
    train['Pole'] = train['Pole'].map(Pole)
    
    train['Manager'] = train.Manager.str.strip()
    train['Manager'] = train.Manager.str.lower()
    Manager = {label: idx for idx, label in
                   enumerate(np.unique(train['Manager']))}
    train['Manager'] = train['Manager'].map(Manager)
    
   
    #print (Pole)
    print ("*******")
    print ('\n Poste \n')
    print(Poste)
    print ("******* \n")
    train['SITUATION_FAMILIALE'] = train.SITUATION_FAMILIALE.str.strip()
    train['SITUATION_FAMILIALE'] = train.SITUATION_FAMILIALE.str.lower()
    SITUATION_FAMILIALE = {label: idx for idx, label in
                   enumerate(np.unique(train['SITUATION_FAMILIALE']))}
    train['SITUATION_FAMILIALE'] = train['SITUATION_FAMILIALE'].map(SITUATION_FAMILIALE)
    
    train.drop('Dernier_Employeur', axis=1, inplace=True)
    train.drop('Niveau_Academique', axis=1, inplace=True)
    train.drop('Ecole', axis=1, inplace=True)
    #train.drop('Manager', axis=1, inplace=True)
    
    
    #train.EXPERIENCE_AVANT_SOFRECOM = train.EXPERIENCE_AVANT_SOFRECOM.astype(float)
    print('Shape of the train data with all features:', train.shape)
    train = train.select_dtypes(exclude=['object'])
    print(train)
    train.fillna(0, inplace=True)  # Replace Nan by 0
    Matricule = test.Matricule
    test = test[
        ['Matricule', 'Civilite', 'EXPERIENCE_AVANT_SOFRECOM', 'EXPERIENCE_SOFRECOM', 'EXPERIENCE_Totale', 'Seniorite',
         'Ecole', 'Niveau_Academique', 'Dernier_Employeur', 'Poste', 'Pole', 'Manager', 'Age', 'SITUATION_FAMILIALE']]
    test.fillna(0, inplace=True)  # Replace Nan by 0
    test.drop('Matricule', axis=1, inplace=True)  # drop Matricule col

    test['Civilite'] = test.Civilite.str.strip()
    test['Civilite'] = test.Civilite.str.lower()

    test['Seniorite'] = test.Seniorite.str.strip()
    test['Seniorite'] = test.Seniorite.str.lower()

    # test['Ecole'] = test.Ecole.str.lower()
    test['Poste'] = test.Poste.str.strip()
    test['Poste'] = test.Poste.str.lower()

    test['Pole'] = test.Pole.str.strip()
    test['Pole'] = test.Pole.str.lower()

    test['Manager'] = test.Manager.str.strip()
    test['Manager'] = test.Manager.str.lower()

    test['SITUATION_FAMILIALE'] = test.SITUATION_FAMILIALE.str.strip()
    test['SITUATION_FAMILIALE'] = test.SITUATION_FAMILIALE.str.lower()

    test['Civilite'] = test['Civilite'].map(Civilite)
    test['Seniorite'] = test['Seniorite'].map(Seniorite)
    test['Ecole'] = test['Ecole'].map(Ecole)
    test['Niveau_Academique'] = test['Niveau_Academique'].map(Niveau_Academique)
    test['Dernier_Employeur'] = test['Dernier_Employeur'].map(Dernier_Employeur)
    test['Poste'] = test['Poste'].map(Poste)
    test['Pole'] = test['Pole'].map(Pole)
    test['Manager'] = test['Manager'].map(Manager)
    test['SITUATION_FAMILIALE'] = test['SITUATION_FAMILIALE'].map(SITUATION_FAMILIALE)

    test.drop('Dernier_Employeur', axis=1, inplace=True)
    test.drop('Niveau_Academique', axis=1, inplace=True)
    test.drop('Ecole', axis=1, inplace=True)
    # test.drop('Manager', axis=1, inplace=True)
    # test.EXPERIENCE_AVANT_SOFRECOM = test.EXPERIENCE_AVANT_SOFRECOM.astype(float)
    # print('Shape of the train dataset with all features:', test.shape)
    # test = test.select_dtypes(exclude=['object'])
    test.fillna(0, inplace=True)  # Replace Nan by 0
    return "sami"


# # Json Prediction Import

# In[8]:




@app.route('/import_prediction', methods=["POST"])
def import_prediction():
    global Matricule
    file = request.files.get('dataset_file2')
    global test
    test = pd.read_csv(request.files.get('dataset_file2'), delimiter=';',    encoding="ISO-8859-1")
    if not file:
        return "No file"
    Matricule = test.Matricule
    test = test[['Matricule','Civilite','EXPERIENCE_AVANT_SOFRECOM' ,'EXPERIENCE_SOFRECOM', 'EXPERIENCE_Totale','Seniorite','Ecole', 'Niveau_Academique','Dernier_Employeur','Poste','Pole', 'Manager','Age','SITUATION_FAMILIALE']]
    test.fillna(0, inplace=True)  # Replace Nan by 0
    test.drop('Matricule', axis=1, inplace=True)  # drop Matricule col
    
    test['Civilite'] = test.Civilite.str.strip()
    test['Civilite'] = test.Civilite.str.lower()
    
    test['Seniorite'] = test.Seniorite.str.strip()
    test['Seniorite'] = test.Seniorite.str.lower()
    
    #test['Ecole'] = test.Ecole.str.lower()
    test['Poste'] = test.Poste.str.strip()
    test['Poste'] = test.Poste.str.lower()
    
    test['Pole'] = test.Pole.str.strip()
    test['Pole'] = test.Pole.str.lower()
    
    test['Manager'] = test.Manager.str.strip()
    test['Manager'] = test.Manager.str.lower()
    
    test['SITUATION_FAMILIALE'] = test.SITUATION_FAMILIALE.str.strip()
    test['SITUATION_FAMILIALE'] = test.SITUATION_FAMILIALE.str.lower()

    test['Civilite'] = test['Civilite'].map(Civilite)
    test['Seniorite'] = test['Seniorite'].map(Seniorite)
    test['Ecole'] = test['Ecole'].map(Ecole)
    test['Niveau_Academique'] = test['Niveau_Academique'].map(Niveau_Academique)
    test['Dernier_Employeur'] = test['Dernier_Employeur'].map(Dernier_Employeur)
    test['Poste'] = test['Poste'].map(Poste)
    test['Pole'] = test['Pole'].map(Pole)
    test['Manager'] = test['Manager'].map(Manager)
    test['SITUATION_FAMILIALE'] = test['SITUATION_FAMILIALE'].map(SITUATION_FAMILIALE)
   
    test.drop('Dernier_Employeur', axis=1, inplace=True)
    test.drop('Niveau_Academique', axis=1, inplace=True)
    test.drop('Ecole', axis=1, inplace=True)
    #test.drop('Manager', axis=1, inplace=True)
    #test.EXPERIENCE_AVANT_SOFRECOM = test.EXPERIENCE_AVANT_SOFRECOM.astype(float)
    #print('Shape of the train dataset with all features:', test.shape)
    #test = test.select_dtypes(exclude=['object'])
    test.fillna(0, inplace=True)  # Replace Nan by 0

    #print("")
    #print("List of features contained our dataset:", list(test.columns))
    return "prediction_test"


# # Json Prediction Import

# In[9]:


@app.route('/import_prediction2', methods=["POST"])
def import_prediction2():
    #print (train)
    global Matricule
    result = request.json
    global test
    test = json_normalize(result)
    #train1 = pd.DataFrame.from_dict(result, orient='index')
    #train1.reset_index(level=0, inplace=True)
    Matricule = test.Matricule
    test.fillna(0, inplace=True)  # Replace Nan by 0
    test.drop('Matricule', axis=1, inplace=True)  # drop Matricule col
    
    test['Civilite'] = test.Civilite.str.strip()
    test['Civilite'] = test.Civilite.str.lower()
    
    test['Seniorite'] = test.Seniorite.str.strip()
    test['Seniorite'] = test.Seniorite.str.lower()
    
    #test['Ecole'] = test.Ecole.str.lower()
    test['Poste'] = test.Poste.str.strip()
    test['Poste'] = test.Poste.str.lower()
    
    test['Pole'] = test.Pole.str.strip()
    test['Pole'] = test.Pole.str.lower()
    
    test['Manager'] = test.Manager.str.strip()
    test['Manager'] = test.Manager.str.lower()
    
    test['SITUATION_FAMILIALE'] = test.SITUATION_FAMILIALE.str.strip()
    test['SITUATION_FAMILIALE'] = test.SITUATION_FAMILIALE.str.lower()

    test['Civilite'] = test['Civilite'].map(Civilite)
    test['Seniorite'] = test['Seniorite'].map(Seniorite)
    test['Ecole'] = test['Ecole'].map(Ecole)
    test['Niveau_Academique'] = test['Niveau_Academique'].map(Niveau_Academique)
    test['Dernier_Employeur'] = test['Dernier_Employeur'].map(Dernier_Employeur)
    test['Poste'] = test['Poste'].map(Poste)
    test['Pole'] = test['Pole'].map(Pole)
    test['Manager'] = test['Manager'].map(Manager)
    test['SITUATION_FAMILIALE'] = test['SITUATION_FAMILIALE'].map(SITUATION_FAMILIALE)
   
    #test.drop('Dernier_Employeur', axis=1, inplace=True)
    #test.drop('Niveau_Academique', axis=1, inplace=True)
    #test.drop('Ecole', axis=1, inplace=True)

    #print('Shape of the train data with all features:', test.shape)

    test.fillna(0, inplace=True)  # Replace Nan by 0
    #test.EXPERIENCE_AVANT_SOFRECOM = test.EXPERIENCE_AVANT_SOFRECOM.astype(float)
    #test.EXPERIENCE_SOFRECOM = test.EXPERIENCE_SOFRECOM.astype(float)
    test.EXPERIENCE_AVANT_SOFRECOM = test.EXPERIENCE_AVANT_SOFRECOM.astype(float)
    test.EXPERIENCE_SOFRECOM = test.EXPERIENCE_SOFRECOM.astype(float)
    test.EXPERIENCE_Totale = test.EXPERIENCE_Totale.astype(float)
    test.Age = test.Age.astype(float)
    test = test[['Civilite','EXPERIENCE_AVANT_SOFRECOM' ,'EXPERIENCE_SOFRECOM','EXPERIENCE_Totale','Seniorite','Poste','Pole', 'Manager','Age','SITUATION_FAMILIALE']]
    #test.drop('Manager', axis=1, inplace=True)
    test = test.select_dtypes(exclude=['object'])
    print (test)
    #print("")
    #print("List of features contained our dataset:", list(test.columns))
    return jsonify(result)


# # Preprocessing_data

# In[10]:


@app.route("/Preprocessing_train", methods=["GET"])
def Preprocessing_train():
    global col_train
    global col_train_bis
    global train
    global clf
    global prepro_y
    global prepro
    global mat_new
    global test
    global train_dataset
    #print (test)
    clf = IsolationForest(random_state=42)
    clf.fit(train)
    y_noano = clf.predict(train)
    y_noano = pd.DataFrame(y_noano, columns=['Top'])
    y_noano[y_noano['Top'] == 1].index.values

    # train = train.iloc[y_noano[y_noano['Top'] == 1].index.values]
    train.reset_index(drop=True, inplace=True)
    #print("Number of Outliers:", y_noano[y_noano['Top'] == -1].shape[0])
    #print("Number of rows without outliers:", train.shape[0])
    col_train = list(train.columns)
    col_train_bis = list(train.columns)
    col_train_bis.remove('DEM')
    mat_train = np.matrix(train)
    mat_test = np.matrix(test)
    mat_new = np.matrix(train.drop('DEM', axis=1))
    mat_y = np.array(train.DEM).reshape((len(train.DEM), 1))
    # preprocessing
    prepro_y = MinMaxScaler()
    prepro_y.fit(mat_y)
    prepro = MinMaxScaler()
    prepro.fit(mat_train)

    prepro_test = MinMaxScaler()
    prepro_test.fit(mat_new)
    #print (mat_test)
    train_dataset = pd.DataFrame(prepro.transform(mat_train), columns=col_train)
    
    test = pd.DataFrame(prepro_test.transform(mat_test), columns=col_train_bis)
    print (train_dataset)
    #print(test)


    return "Preprocessing"


# # Preprocessing_test

# In[11]:


@app.route("/Preprocessing_test", methods=["GET"])
def Preprocessing_test():
    global test
    global prepro_test
    #print (train)
    mat_test = np.matrix(test)
    prepro_test = MinMaxScaler()
    prepro_test.fit(mat_new)
    # prepro_test.fit(mat_test)
    test = pd.DataFrame(prepro_test.transform(mat_test), columns=col_train_bis)
    return "test preprocessing"


# # Split Data

# In[12]:


@app.route("/split", methods=["GET"])
def Split():
    # remove outlier from train Data
    # List of features
    global LABEL
    global COLUMNS
    global FEATURES
    global x_train
    global x_test
    global y_train
    global y_test
    global training_set
    global feature_cols
    COLUMNS = col_train
    FEATURES = col_train_bis
    LABEL = "DEM"

    # Columns for tensorflow
    feature_cols = [tf.contrib.layers.real_valued_column(k) for k in FEATURES]

    # Training set and Prediction set with the features to predict
    training_set = train_dataset[COLUMNS]  # with DEM
    prediction_set = train.DEM

    # Train and Test : diviser train en x_test & x_train

    x_train, x_test, y_train, y_test = train_test_split(training_set[FEATURES], prediction_set, train_size=0.8, test_size=0.2,
                                                        random_state=42)
    
    
    print (x_train)
    print(x_train.shape)
    print(y_train.shape)
    return "split"


# # Build Model

# In[13]:


@app.route("/Model", methods=["GET"])
def Model():
    global y_train
    global y_test
    global regressor
    global testing_set
    y_train = pd.DataFrame(y_train, columns=[LABEL])
    # set training_set = x_train + labeled values
    training_set = pd.DataFrame(x_train, columns=FEATURES).merge(y_train, left_index=True, right_index=True)

    # Training for submission
    # training_sub = training_set[col_train]
    y_test = pd.DataFrame(y_test, columns=[LABEL])
    testing_set = pd.DataFrame(x_test, columns=FEATURES).merge(y_test, left_index=True, right_index=True)

    # Model
    model_params = {"learning_rate": 0.1}
    #def leaky_relu(x):
    #return tf.nn.relu(x) - 0.01 * tf.nn.relu(-x)
    # Model
    # optimizer = tf.train.GradientDescentOptimizer( learning_ratwe= 0.1 ))

    # reset indexation des données pour l'affichage
    regressor = tf.contrib.learn.DNNRegressor(feature_columns=feature_cols,
                                              activation_fn=tf.nn.relu, hidden_units=[200, 100, 50, 25, 12],
                                                model_dir='./tmp/turnover_exp6'
                                             ) # ,
    
    training_set.reset_index(drop=True, inplace=True)
    regressor.fit(input_fn=lambda: input_fn(training_set), steps=100)

    return "Model"


# # Evaluation Model

# In[14]:


@app.route("/Evaluation", methods=["GET"])
def Evaluation():
    ev = regressor.evaluate(input_fn=lambda: input_fn(testing_set), steps=100)
    print(ev)
    loss_score1 = ev["loss"]
    print("Final Loss on the testing set: {0:f}".format(loss_score1))

    return "Evaluation"


# # Predict Model

# In[15]:


@app.route("/Prediction", methods=["GET"])
def Prediction():
    global predictions
    global reality
    global y_predict

    y = regressor.predict(input_fn=lambda: input_fn(testing_set))

    predictions = list(itertools.islice(y, testing_set.shape[0]))

    predictions = prepro_y.inverse_transform(np.array(predictions).reshape(len(predictions), 1))
    
    #print(test)
    #print(test.shape)
    y_predict = regressor.predict(input_fn=lambda: input_fn(test, pred=True))
    to_submit(y_predict, "finallyv2")
    
    print (jsonify(out))
    #print(type(out))
    return jsonify(
        out
    )


@app.route("/PredictionPerEmployee", methods=["POST"])
def PredictionPerEmployee():
    global Matricule
    result = request.json
    global test
    test = json_normalize(result)
    # train1 = pd.DataFrame.from_dict(result, orient='index')
    # train1.reset_index(level=0, inplace=True)
    Matricule = test.Matricule
    test.fillna(0, inplace=True)  # Replace Nan by 0
    test.drop('Matricule', axis=1, inplace=True)  # drop Matricule col

    test['Civilite'] = test.Civilite.str.strip()
    test['Civilite'] = test.Civilite.str.lower()

    test['Seniorite'] = test.Seniorite.str.strip()
    test['Seniorite'] = test.Seniorite.str.lower()

    # test['Ecole'] = test.Ecole.str.lower()
    test['Poste'] = test.Poste.str.strip()
    test['Poste'] = test.Poste.str.lower()

    test['Pole'] = test.Pole.str.strip()
    test['Pole'] = test.Pole.str.lower()

    test['Manager'] = test.Manager.str.strip()
    test['Manager'] = test.Manager.str.lower()

    test['SITUATION_FAMILIALE'] = test.SITUATION_FAMILIALE.str.strip()
    test['SITUATION_FAMILIALE'] = test.SITUATION_FAMILIALE.str.lower()

    test['Civilite'] = test['Civilite'].map(Civilite)
    test['Seniorite'] = test['Seniorite'].map(Seniorite)
    test['Ecole'] = test['Ecole'].map(Ecole)
    test['Niveau_Academique'] = test['Niveau_Academique'].map(Niveau_Academique)
    test['Dernier_Employeur'] = test['Dernier_Employeur'].map(Dernier_Employeur)
    test['Poste'] = test['Poste'].map(Poste)
    test['Pole'] = test['Pole'].map(Pole)
    test['Manager'] = test['Manager'].map(Manager)
    test['SITUATION_FAMILIALE'] = test['SITUATION_FAMILIALE'].map(SITUATION_FAMILIALE)

    # test.drop('Dernier_Employeur', axis=1, inplace=True)
    # test.drop('Niveau_Academique', axis=1, inplace=True)
    # test.drop('Ecole', axis=1, inplace=True)

    # print('Shape of the train data with all features:', test.shape)

    test.fillna(0, inplace=True)  # Replace Nan by 0
    # test.EXPERIENCE_AVANT_SOFRECOM = test.EXPERIENCE_AVANT_SOFRECOM.astype(float)
    # test.EXPERIENCE_SOFRECOM = test.EXPERIENCE_SOFRECOM.astype(float)
    test.EXPERIENCE_AVANT_SOFRECOM = test.EXPERIENCE_AVANT_SOFRECOM.astype(float)
    test.EXPERIENCE_SOFRECOM = test.EXPERIENCE_SOFRECOM.astype(float)
    test.EXPERIENCE_Totale = test.EXPERIENCE_Totale.astype(float)
    test.Age = test.Age.astype(float)
    test = test[
        ['Civilite', 'EXPERIENCE_AVANT_SOFRECOM', 'EXPERIENCE_SOFRECOM', 'EXPERIENCE_Totale', 'Seniorite', 'Poste',
         'Pole', 'Manager', 'Age', 'SITUATION_FAMILIALE']]
    # test.drop('Manager', axis=1, inplace=True)
    test = test.select_dtypes(exclude=['object'])
    print(test)
    global col_train
    global col_train_bis
    global train
    global clf
    global prepro_y
    global prepro
    global mat_new
    global train_dataset
    # print (test)
    clf = IsolationForest(random_state=42)
    clf.fit(train)
    y_noano = clf.predict(train)
    y_noano = pd.DataFrame(y_noano, columns=['Top'])
    y_noano[y_noano['Top'] == 1].index.values

    # train = train.iloc[y_noano[y_noano['Top'] == 1].index.values]
    train.reset_index(drop=True, inplace=True)
    # print("Number of Outliers:", y_noano[y_noano['Top'] == -1].shape[0])
    # print("Number of rows without outliers:", train.shape[0])
    col_train = list(train.columns)
    col_train_bis = list(train.columns)
    col_train_bis.remove('DEM')
    mat_train = np.matrix(train)
    mat_test = np.matrix(test)
    mat_new = np.matrix(train.drop('DEM', axis=1))
    mat_y = np.array(train.DEM).reshape((len(train.DEM), 1))
    # preprocessing
    prepro_y = MinMaxScaler()
    prepro_y.fit(mat_y)
    prepro = MinMaxScaler()
    prepro.fit(mat_train)

    prepro_test = MinMaxScaler()
    prepro_test.fit(mat_new)
    # print (mat_test)
    train_dataset = pd.DataFrame(prepro.transform(mat_train), columns=col_train)

    test = pd.DataFrame(prepro_test.transform(mat_test), columns=col_train_bis)
    print(train_dataset)
    # print(test)
    # print("")
    # print("List of features contained our dataset:", list(test.columns))
    global predictions
    global reality
    global y_predict

    y = regressor.predict(input_fn=lambda: input_fn(testing_set))

    predictions = list(itertools.islice(y, testing_set.shape[0]))

    predictions = prepro_y.inverse_transform(np.array(predictions).reshape(len(predictions), 1))

    # print(test)
    # print(test.shape)
    y_predict = regressor.predict(input_fn=lambda: input_fn(test, pred=True))
    to_submit(y_predict, "finallyv2")

    print(jsonify(out))
    # print(type(out))
    return jsonify(
        out
    )


# # Run Application

# In[ ]:



if __name__ == '__main__':
    app.debug = False
    app.run(host = '0.0.0.0',port=5002)
    #app.run(port=5002)


