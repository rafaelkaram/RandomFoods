const path = require('path');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');



const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

app.use('/ingredient-types',
express.static(path.resolve(__dirname, '..','..','frontend','src','assets','ingredients-types-images'))); 

app.listen(3333);