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

## Banco Galicia

Las validaciones para Galicia se basan en el formato de archivo de **longitud fija "Diseño TXT 3"** (477 caracteres).

### Validación de Estructura General

- **Longitud de Línea**: Cada línea debe tener una longitud fija y exacta de **477 caracteres**.
- **Estructura de Registros**:
    - El archivo debe comenzar con un registro de **Cabecera** (línea que empieza con `*H3`).
    - El archivo debe finalizar con un registro de **Pie** (línea que empieza con `*F`).
    - Las líneas intermedias se consideran registros de **Detalle**.

### Validaciones por Tipo de Registro y Cruzadas

#### 1. Registro de Cabecera (`*H3`)
- **Importe Total (Pos. 61-74)**: Se extrae el importe total del lote, que debe ser un número de 14 dígitos.

#### 2. Registros de Detalle
- **CUIT/CUIL (Pos. 17-27)**: Debe ser un campo numérico de **11 dígitos**.
- **CBU (Pos. 50-71)**: Si se informa, debe ser un campo numérico de **22 dígitos**.
- **Importe (Pos. 79-92)**: Debe ser un campo numérico de **14 dígitos** (12 enteros y 2 decimales).

#### 3. Registro de Pie (`*F`)
- **Cantidad de Registros (Pos. 9-15)**: Se extrae la cantidad total de registros de detalle.

### Validaciones Cruzadas
- **Suma de Importes**: La suma de todos los importes de los registros de **Detalle** debe coincidir exactamente con el **Importe Total** declarado en la **Cabecera**.
- **Conteo de Registros**: La cantidad de registros de **Detalle** debe coincidir exactamente con la **Cantidad de Registros** declarada en el **Pie**.

---
*A medida que se agregue soporte para más bancos, su documentación aparecerá aquí.*
