const exp = require('constants');
const express = require('express');
const {engine} = require('express-handlebars');
const path = require('path');

const app = express();
const bodyParser = require('body-parser')

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('./public'))
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json())

const routes = require('./server/routes/routes')
app.use('/', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});