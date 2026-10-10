const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Se configuran en EasyPanel -> mi-node-app -> Entorno (no pongas claves en el codigo)
const EVOLUTION_URL = (process.env.EVOLUTION_URL || '').replace(/\/$/, '');
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '';
const INSTANCE = process.env.EVOLUTION_INSTANCE || 'cliente001';

// Paginas estaticas (solo estos archivos, no se expone el codigo del servidor)
const sendPage = (file) => (req, res) => res.sendFile(path.join(__dirname, file));
app.get('/', (req, res) => res.redirect('/bienvenida'));
app.get('/bienvenida', sendPage('bienvenida.html'));
app.get('/privacidad', sendPage('privacidad.html'));
app.get('/terminos', sendPage('terminos.html'));

// Comprobacion rapida de que la app esta viva
app.get('/health', (req, res) => res.json({ ok: true }));

// Plantilla simple para la pagina del QR
const qrPage = (body) => <!DOCTYPE html>
<html lang="es"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="refresh" content="25">
<title>Conecta tu WhatsApp - Imagux</title>
<style>
  body{font-family:Arial,sans-serif;background:#eaf4fc;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;padding:16px}
  .box{background:#fff;border-radius:20px;padding:32px;max-width:420px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(10,100,180,.15)}
  h1{color:#0f2a52;font-size:22px;margin:0 0 8px}
  p{color:#44566f;font-size:15px;line-height:1.5}
  img{width:100%;max-width:300px;margin:16px 0}
</style></head>
<body><div class="box">${body}</div></body></html>;

// Muestra el QR de Evolution API
app.get('/qr', async (req, res) => {
  try {
    const r = await fetch(${EVOLUTION_URL}/instance/connect/${INSTANCE}, {
      headers: { apikey: EVOLUTION_API_KEY },
    });
    const data = await r.json();

    if (!r.ok) {
      console.error('Evolution API error:', data);
      return res.status(502).send(qrPage('<h1>No se pudo generar el QR</h1><p>Intentalo de nuevo en unos segundos.</p>'));
    }

    if (!data.base64) {
      return res.send(qrPage('<h1>Sin QR disponible</h1><p>Es posible que tu WhatsApp ya este conectado. Si no, recarga la pagina.</p>'));
    }

    res.send(qrPage(
      <h1>Conecta tu WhatsApp</h1>
      <p>Abre WhatsApp, entra en Dispositivos vinculados, pulsa Vincular un dispositivo y escanea este codigo.</p>
      <img src="${data.base64}" alt="Codigo QR de WhatsApp">
      <p><small>El codigo se actualiza solo cada 25 segundos.</small></p>));
  } catch (err) {
    console.error(err);
    res.status(500).send(qrPage('<h1>Error del servidor</h1><p>Intentalo de nuevo mas tarde.</p>'));
  }
});

app.listen(PORT, () => console.log('Servidor ejecutandose en el puerto ' + PORT));
