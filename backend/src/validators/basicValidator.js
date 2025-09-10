/**
 * Realiza validaciones básicas en un archivo de formato simple (delimitado por espacios/tabs).
 * Busca e inspecciona CBU (formato, duplicados) y Monto.
 * @param {string} fileContent - El contenido del archivo como un string.
 * @returns {object} - Un objeto con los resultados de la validación.
 */
function validateBasic(fileContent) {
  const lines = fileContent.split(/\r?\n/);
  const errors = [];
  const cbus = new Set();

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    if (line.trim() === '') return;

    // Busca un CBU (22 dígitos) en la línea actual.
    const cbuMatch = line.match(/\b(\d{22})\b/);
    const cbu = cbuMatch ? cbuMatch[1] : null;

    // Busca un monto (número con o sin decimales) en la línea.
    // Expresión regular para encontrar montos, evitando que sea el mismo CBU.
    const amountMatch = line.match(/\b(\d+([.,]\d{1,2})?)\b/g);
    let amountStr = null;
    if(amountMatch){
        // Filtra para no tomar el CBU como si fuera un monto.
        const potentialAmounts = amountMatch.filter(m => m !== cbu);
        if(potentialAmounts.length > 0) {
            amountStr = potentialAmounts[0]; // Toma el primer monto potencial que no sea el CBU
        }
    }

    // 1. Validación de CBU
    if (!cbu) {
        errors.push({
            line: lineNumber,
            message: 'No se encontró un CBU válido (22 dígitos numéricos) en la línea.'
        });
    } else {
      if (cbus.has(cbu)) {
        errors.push({
          line: lineNumber,
          field: 'CBU',
          value: cbu,
          message: 'CBU duplicado en el archivo.'
        });
      } else {
        cbus.add(cbu);
      }
    }

    // 2. Validación de Monto
    if (!amountStr) {
        errors.push({
            line: lineNumber,
            field: 'Monto',
            message: 'No se encontró un monto válido en la línea.'
        });
    }
  });

  return {
    validationType: 'Básica',
    errorCount: errors.length,
    errors: errors,
    summary: {
      totalLines: lines.length,
      validatedLines: lines.filter(l => l.trim() !== '').length
    }
  };
}

module.exports = {
  validateBasic
};
