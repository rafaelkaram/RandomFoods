const path = require('path');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');



const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

app.use('/ingredient-types',
express.static(path.resolve(__dirname, '..','..','mobile','src','assets','ingredients-types-images'))); 

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.listen(3333);