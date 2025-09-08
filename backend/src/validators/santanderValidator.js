/**
 * Valida el contenido de un archivo de pago del Banco Santander.
 * @param {string} fileContent - El contenido del archivo como un string.
 * @returns {object} - Un objeto con los resultados de la validación.
 */
function validateSantander(fileContent) {
  const lines = fileContent.split(/\r?\n/);
  const errors = [];
  const cbus = new Set();

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Ignorar líneas vacías
    if (line.trim() === '') {
      return;
    }

    const parts = line.split('		');

    // Validar la estructura de la línea: debe haber exactamente 3 partes.
    if (parts.length !== 3) {
      errors.push({
        line: lineNumber,
        message: `La línea no tiene el formato correcto. Se esperaban 3 campos separados por doble tabulación (Nombre Apellido\t\tCBU\t\tMonto), pero se encontraron ${parts.length} partes.`
      });
      return; // No continuar con esta línea
    }

    // Extraer, limpiar y validar cada campo.
    const [fullName, cbu, amountStr] = parts.map(p => p.trim());

    // 1. Validación de CBU
    if (!/^\d{22}$/.test(cbu)) {
      errors.push({
        line: lineNumber,
        field: 'CBU',
        value: cbu,
        message: 'El CBU debe contener exactamente 22 dígitos numéricos.'
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
    // El monto debe ser un número, puede tener decimales con punto o coma.
    if (!/^\d+([.,]\d+)?$/.test(amountStr)) {
      errors.push({
        line: lineNumber,
        field: 'Monto',
        value: amountStr,
        message: 'El monto no es un número válido (ej: 1234.56 o 1234,56).'
      });
    }
  });

  return {
    bank: 'Santander',
    errorCount: errors.length,
    errors: errors,
    summary: {
      totalLines: lines.length,
      validatedLines: lines.length - lines.filter(l => l.trim() === '').length
    }
  };
}

module.exports = {
  validateSantander
};

