const PORT = require('./config').port;
const routes = require('./routes');
const express = require('express');
const cors = require('cors');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/v1', routes);

app.listen(PORT, () => {
    console.log(`API running on PORT:${PORT}`)
});
