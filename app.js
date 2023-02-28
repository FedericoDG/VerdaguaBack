const express = require('express');
const cors = require('cors');

const app = express();

const indexRoutes = require('./src/routes/index.routes');

//Settings
const port = process.env.PORT || 3000;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//Routes
app.use('/', indexRoutes);

//Server
app.listen(port, () => {
  console.log(`Server run on port: ${port}`);
});
