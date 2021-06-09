const express = require('express');
require('dotenv').config();
const controllers = require('./src/controllers');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});

app.use('/user', controllers.user);
app.use('/categories', controllers.categories);
app.use('/login', controllers.login);
app.use('/post', controllers.post);

app.listen(PORT, () => console.log(`ouvindo na porta ${PORT}`));
