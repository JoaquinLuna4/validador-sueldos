const express = require('express');
const multer = require('multer');
const { validateFile } = require('./validators/mainValidator'); // Importar el orquestador principal

const app = express();
const port = 3000;

// Middleware para parsear JSON, necesario para leer plan y bank del body
app.use(express.json());

// Configuración de Multer para guardar el archivo en memoria
const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
    res.send('Servidor de validación funcionando. Usa el endpoint POST /api/validate para subir un archivo.');
});

// Endpoint de validación genérico
app.post('/api/validate', upload.single('paymentFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha subido ningún archivo.' });
  }

  // Extraer plan y bank del cuerpo de la solicitud
  const { plan, bank } = req.body;

  if (!plan) {
    return res.status(400).json({ error: 'El plan de validación (basic o premium) es requerido.' });
  }

  const fileContent = req.file.buffer.toString('utf-8');
  
  const validationResult = validateFile(fileContent, plan, bank);

  res.json(validationResult);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
