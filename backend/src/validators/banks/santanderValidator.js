/**
 * Valida el contenido de un archivo de pago del Banco Santander según el formato de longitud fija.
 * @param {string} fileContent - El contenido del archivo como un string.
 * @returns {object} - Un objeto con los resultados de la validación.
 */
function validateSantander(fileContent) {
  const lines = fileContent.split(/\r?\n/);
  const errors = [];
  const cbus = new Set();
  let detailLineCount = 0;
  let totalAmount = 0;

  // Filtrar líneas vacías que pueden ser agregadas por editores de texto.
  const nonEmptyLines = lines.filter(line => line.trim() !== '');

  if (nonEmptyLines.length === 0) {
    // Archivo vacío o solo con líneas en blanco.
    return {
        bank: 'Santander',
        errorCount: 1,
        errors: [{ line: 0, message: "El archivo está vacío o no contiene datos." }],
        summary: { totalLines: lines.length, validatedLines: 0 }
    };
  }

  // 1. Validación de estructura general
  if (nonEmptyLines[0].substring(0, 1) !== 'H') {
    errors.push({ line: 1, message: "El archivo debe comenzar con un registro de Cabecera (H)." });
  }
  if (nonEmptyLines[nonEmptyLines.length - 1].substring(0, 1) !== 'T') {
      errors.push({ line: nonEmptyLines.length, message: "El archivo debe terminar con un registro de Cierre (T)." });
  }

  nonEmptyLines.forEach((line, index) => {
    const lineNumber = index + 1;

    if (line.length !== 650) {
      errors.push({
        line: lineNumber,
        message: `La línea no tiene la longitud correcta de 650 caracteres (tiene ${line.length}).`
      });
      return; // No procesar una línea con longitud incorrecta
    }

    const recordType = line.substring(0, 1);

    switch (recordType) {
      case 'H':
        const acuerdo = line.substring(1, 18).trim();
        if (!/^\d{11}0\d{2,5}$/.test(acuerdo)) {
             errors.push({ line: lineNumber, field: 'Número de Acuerdo', value: acuerdo, message: 'Formato de Número de Acuerdo (pos 2-18) inválido.' });
        }
        break;

      case 'D':
        detailLineCount++;
        
        // CBU (pos 402-427)
        const cbu = line.substring(401, 423);
        if (!/^\d{22}$/.test(cbu)) {
          errors.push({ line: lineNumber, field: 'CBU', value: cbu, message: 'El CBU (pos 402-427) debe contener 22 dígitos numéricos.' });
        } else {
          if (cbus.has(cbu)) {
            errors.push({ line: lineNumber, field: 'CBU', value: cbu, message: 'CBU duplicado en el archivo.' });
          } else {
            cbus.add(cbu);
          }
        }

        // Importe (pos 444-458)
        const amountStr = line.substring(443, 458);
        if (!/^\d{15}$/.test(amountStr)) {
          errors.push({ line: lineNumber, field: 'Importe', value: amountStr, message: 'El Importe (pos 444-458) debe ser un número de 15 dígitos (13 enteros, 2 decimales).' });
        } else {
          const integerPart = parseInt(amountStr.substring(0, 13), 10);
          const decimalPart = parseInt(amountStr.substring(13, 15), 10);
          totalAmount += integerPart + (decimalPart / 100);
        }

        // CUIL/CUIT del beneficiario (pos 224-234)
        const cuil = line.substring(223, 234);
        if (!/^\d{11}$/.test(cuil)) {
            errors.push({ line: lineNumber, field: 'CUIL/CUIT', value: cuil, message: 'El CUIL/CUIT del beneficiario (pos 224-234) debe ser numérico de 11 dígitos.' });
        }

        // Código de moneda (pos 3)
        const currency = line.substring(2, 3);
        if (currency !== '0' && currency !== '2') {
            errors.push({ line: lineNumber, field: 'Código de moneda', value: currency, message: 'Código de moneda (pos 3) inválido. Debe ser 0 (pesos) o 2 (dólares).' });
        }
        break;

      case 'T':
        // La documentación indica que la posición puede variar. Asumimos la del ejemplo (pos 12-16) para la cantidad.
        const totalRecordsInTrailerStr = line.substring(11, 16);
        if(!/^\d+$/.test(totalRecordsInTrailerStr.trim())){
             errors.push({ line: lineNumber, message: `El campo 'Cantidad de registros' en el Trailer no es un número válido.` });
        } else {
            const totalRecordsInTrailer = parseInt(totalRecordsInTrailerStr, 10);
            if (totalRecordsInTrailer !== detailLineCount) {
                errors.push({ line: lineNumber, message: `La cantidad de registros de detalle (${detailLineCount}) no coincide con el total en el Trailer (${totalRecordsInTrailer}).` });
            }
        }
        // La posición del importe total no está claramente especificada, por lo que se omite la validación cruzada por ahora.
        break;

      default:
        if (lineNumber !== 1 && lineNumber !== nonEmptyLines.length) {
            errors.push({
              line: lineNumber,
              message: `Tipo de registro desconocido: '${recordType}'. Debe ser H, D o T.`
            });
        }
    }
  });

  return {
    bank: 'Santander',
    errorCount: errors.length,
    errors: errors,
    summary: {
      totalLines: lines.length,
      validatedLines: nonEmptyLines.length
    }
  };
}

module.exports = {
  validateSantander
};