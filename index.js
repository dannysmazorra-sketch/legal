const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Permite ver tus archivos HTML actuales (index.html, privacidad.html, terminos.html)
app.use(express.static(__dirname));

// 2. Define la ruta específica para /bienvenida
app.get('/bienvenida', (_req, res) => {
  res.sendFile(__dirname + '/bienvenida.html');
});

// 3. Enciende el servidor para recibir visitas
app.listen(PORT, () => {
  console.log(Servidor ejecutándose en el puerto ${PORT});
});app.get('/bienvenida', (_req, res) => {
  res.sendFile(__dirname + '/bienvenida.html');
});
