const express = require('express');
const multer = require('multer');
const { validateSantander } = require('./validators/santanderValidator');
const fs = require('fs');

const app = express();
const port = 3000;

// Configuración de Multer para guardar el archivo en memoria
const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
    res.send('Servidor de validación funcionando. Usa el endpoint POST /api/validate/santander para subir un archivo.');
});

// Endpoint para la validación de archivos de Santander
app.post('/api/validate/santander', upload.single('paymentFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha subido ningún archivo.' });
  }

  // El contenido del archivo está en req.file.buffer
  const fileContent = req.file.buffer.toString('utf-8');
  
  const validationResult = validateSantander(fileContent);

  res.json(validationResult);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
