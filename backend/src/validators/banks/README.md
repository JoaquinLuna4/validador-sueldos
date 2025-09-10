# Documentación de Validadores por Banco

Este documento detalla las reglas de validación específicas implementadas para cada banco soportado en el **Plan Premium**.

---

## Banco Santander

Las validaciones para Santander se basan en el formato de archivo de **longitud fija** especificado por el banco para la carga masiva de pagos.

### Validación de Estructura General

- **Codificación**: El archivo debe ser de texto plano (ASCII/Latin-1).
- **Longitud de Línea**: Cada línea debe tener una longitud fija y exacta de **650 caracteres**.
- **Estructura de Registros**:
    - El archivo debe comenzar con un registro de **Cabecera** (línea que empieza con `H`).
    - El archivo debe finalizar con un registro de **Cierre** (línea que empieza con `T`).
    - Entre la cabecera y el cierre, debe existir al menos un registro de **Detalle** (línea que empieza con `D`).

### Validaciones por Tipo de Registro

#### 1. Registro de Cabecera (`H`)
- **Tipo de Registro**: El primer carácter de la línea debe ser `H`.
- **Número de Acuerdo**: Se valida el formato del campo en las posiciones 2-18.

#### 2. Registro de Detalle (`D`)
- **Tipo de Registro**: El primer carácter debe ser `D`.
- **CBU (Pos. 402-427)**:
    - Debe contener exactamente **22 dígitos numéricos**.
    - No debe estar duplicado dentro del mismo archivo.
- **Importe (Pos. 444-458)**:
    - Debe ser un campo numérico de **15 dígitos** (13 para la parte entera y 2 para los decimales, sin separador).
- **CUIL/CUIT del Beneficiario (Pos. 224-234)**:
    - Debe ser un campo numérico de **11 dígitos**.
- **Código de Moneda (Pos. 3)**:
    - Debe ser `0` (Pesos) o `2` (Dólares).

#### 3. Registro de Cierre (`T`)
- **Tipo de Registro**: El primer carácter debe ser `T`.
- **Cantidad de Registros (Ej: Pos. 12-16)**:
    - Debe ser un valor numérico que coincida con la cantidad total de registros de detalle (`D`) presentes en el archivo.

---
*A medida que se agregue soporte para más bancos, su documentación aparecerá aquí.*
