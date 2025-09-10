/**
 * Valida el contenido de un archivo de pago del Banco Galicia según el formato de longitud fija "Diseño TXT 3".
 * @param {string} fileContent - El contenido del archivo como un string.
 * @returns {object} - Un objeto con los resultados de la validación.
 */
function validateGalicia(fileContent) {
  const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== '');
  const errors = [];
  let detailLines = [];
  let header = null;
  let footer = null;

  if (lines.length < 2) {
    errors.push({ line: 0, message: "El archivo debe contener al menos una cabecera y un pie." });
    return { bank: 'Galicia', errorCount: errors.length, errors, summary: { totalLines: lines.length, validatedLines: 0 } };
  }

  // 1. Identificar Header, Footer y Detalles
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    if (line.length !== 477) {
      errors.push({ line: lineNumber, message: `La línea no tiene la longitud correcta de 477 caracteres (tiene ${line.length}).` });
      return;
    }

    const recordType = line.substring(0, 3);
    if (recordType.startsWith('*H')) {
      if (header) errors.push({ line: lineNumber, message: "Se encontró más de un registro de cabecera." });
      header = { line, lineNumber };
    } else if (recordType.startsWith('*F')) {
      if (footer) errors.push({ line: lineNumber, message: "Se encontró más de un registro de pie." });
      footer = { line, lineNumber };
    } else {
      detailLines.push({ line, lineNumber });
    }
  });

  if (!header) errors.push({ line: 0, message: "No se encontró un registro de cabecera (debe empezar con '*H')." });
  if (!footer) errors.push({ line: 0, message: "No se encontró un registro de pie (debe empezar con '*F')." });

  if (errors.length > 0) {
    return { bank: 'Galicia', errorCount: errors.length, errors, summary: { totalLines: lines.length, validatedLines: lines.length } };
  }

  // 2. Validaciones de Cabecera y Pie
  let totalAmountInHeader = 0;
  if (header) {
    const totalAmountStr = header.line.substring(60, 74);
    if (!/^\d{14}$/.test(totalAmountStr)) {
      errors.push({ line: header.lineNumber, field: 'Importe Total (Cabecera)', message: 'El importe total en la cabecera (pos 61-74) no es un número válido de 14 dígitos.' });
    } else {
      totalAmountInHeader = parseFloat(totalAmountStr.substring(0, 12) + '.' + totalAmountStr.substring(12));
    }
  }

  if (footer) {
    const recordCountInFooter = parseInt(footer.line.substring(8, 15), 10);
    if (isNaN(recordCountInFooter) || recordCountInFooter !== detailLines.length) {
      errors.push({ line: footer.lineNumber, field: 'Cantidad de Registros (Pie)', message: `La cantidad de registros en el pie (${recordCountInFooter}) no coincide con la cantidad de líneas de detalle (${detailLines.length}).` });
    }
  }

  // 3. Validaciones de Detalle
  let detailAmountSum = 0;
  detailLines.forEach(detail => {
    const { line, lineNumber } = detail;

    // CUIT/CUIL (pos 17-27)
    const cuil = line.substring(16, 27);
    if (!/^\d{11}$/.test(cuil)) {
      errors.push({ line: lineNumber, field: 'CUIT/CUIL', value: cuil, message: 'El CUIT/CUIL (pos 17-27) debe ser numérico de 11 dígitos.' });
    }

    // CBU (pos 50-71)
    const cbu = line.substring(49, 71);
    // Es obligatorio si la cuenta no es de Galicia. Asumimos que siempre puede venir.
    if (cbu.trim() !== '' && !/^\d{22}$/.test(cbu)) {
        errors.push({ line: lineNumber, field: 'CBU', value: cbu, message: 'El CBU (pos 50-71), si está presente, debe ser numérico de 22 dígitos.' });
    }

    // Importe (pos 79-92)
    const amountStr = line.substring(78, 92);
    if (!/^\d{14}$/.test(amountStr)) {
      errors.push({ line: lineNumber, field: 'Importe', value: amountStr, message: 'El Importe (pos 79-92) debe ser un número de 14 dígitos (12 enteros, 2 decimales).' });
    } else {
      detailAmountSum += parseFloat(amountStr.substring(0, 12) + '.' + amountStr.substring(12));
    }
  });

  // 4. Validación cruzada de montos
  if (header && Math.abs(totalAmountInHeader - detailAmountSum) > 0.01) {
      errors.push({ line: header.lineNumber, message: `El importe total de la cabecera (${totalAmountInHeader.toFixed(2)}) no coincide con la suma de los importes de detalle (${detailAmountSum.toFixed(2)}).` });
  }

  return {
    bank: 'Galicia',
    errorCount: errors.length,
    errors,
    summary: {
      totalLines: lines.length,
      validatedLines: lines.length
    }
  };
}

module.exports = {
  validateGalicia
};
