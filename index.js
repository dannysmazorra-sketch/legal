const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get('/bienvenida', (req, res) => {
  res.sendFile(path.join(__dirname, 'bienvenida.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log('Servidor ejecutándose en el puerto ' + PORT);
});
