require('dotenv').config();
const api = require('./api.sendgrid');
const express = require('express');
const cors = require('cors');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/', api);

const PORT = process.env.PORT;
app.listen(PORT, () => { console.log(`Listening on PORT ${PORT}`) });
