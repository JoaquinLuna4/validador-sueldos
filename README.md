# Validador de Archivos de Pago

Este proyecto es una aplicación web diseñada para validar archivos de texto plano (`.txt`) utilizados para la liquidación de sueldos en bancos argentinos. El objetivo es proporcionar una herramienta que centralice las validaciones de formato y contenido según las especificaciones de cada banco.

## Características (MVP)

- **Backend robusto**: Construido con Node.js y Express, capaz de procesar archivos de texto.
- **Validación por banco**: Lógica de negocio modular para soportar las reglas específicas de cada entidad.
- **Reporte de errores**: La API devuelve un informe detallado en formato JSON con los errores encontrados, indicando línea, campo y descripción del problema.
- **Soporte inicial**: La primera implementación incluye soporte para el Banco Santander.

## Validaciones Implementadas (Banco Santander)

Actualmente, el validador de Santander aplica las siguientes reglas:

1.  **Estructura de Línea**:
    -   Verifica que cada línea contenga 3 campos separados por una doble tabulación (`		`): `Nombre Apellido`, `CBU` y `Monto`.

2.  **Validación de CBU**:
    -   **Formato y Longitud**: El CBU debe contener exactamente 22 dígitos numéricos.
    -   **Unicidad**: No se permiten CBUs duplicados en el mismo archivo.

3.  **Validación de Monto**:
    -   **Formato Numérico**: El monto debe ser un número válido (entero o decimal).

## Stack de Tecnología

-   **Backend**: Node.js, Express.js
-   **Próximamente - Frontend**: React

## Cómo Empezar

Para levantar el entorno de desarrollo del backend, sigue estos pasos:

1.  **Navegar al directorio del backend**:
    ```bash
    cd backend
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Iniciar el servidor en modo desarrollo**:
    El servidor se iniciará con `nodemon`, reiniciándose automáticamente ante cualquier cambio en el código.
    ```bash
    npm run dev
    ```
    El servidor estará escuchando en `http://localhost:3000`.

## API

### Endpoint de Validación

-   `POST /api/validate/santander`

Sube un archivo de texto plano (`.txt`) a este endpoint para validarlo contra las reglas del Banco Santander.

-   **Key**: `paymentFile`
-   **Value**: (Tu archivo `.txt`)

La respuesta será un JSON con el resultado de la validación.
