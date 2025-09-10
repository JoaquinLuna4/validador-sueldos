# Validador de Archivos de Pago

Este proyecto es una aplicación web diseñada para validar archivos de texto plano (`.txt`) utilizados para la liquidación de sueldos y pagos. El objetivo es proporcionar una herramienta flexible que ofrezca desde validaciones genéricas hasta chequeos de formato específicos de cada banco argentino.

## Arquitectura de Validación

El validador opera bajo un sistema de dos niveles para adaptarse a distintas necesidades:

1.  **Plan Básico**: Ofrece validaciones genéricas sobre archivos de formato simple (delimitados por espacios o tabulaciones). Es ideal para chequeos rápidos sin necesidad de adherirse a un layout bancario estricto.
2.  **Plan Premium**: Proporciona validaciones exhaustivas basadas en los formatos de archivo oficiales de cada banco. Esta opción es para usuarios que necesitan garantizar la compatibilidad total de sus archivos antes de subirlos a la plataforma del banco.

### Lógica de Validación

- **Plan Básico (Genérico)**: Realiza chequeos de alto nivel sobre archivos de formato simple, como la correcta formación de CBU y montos, y la no existencia de duplicados.
- **Plan Premium (Por Banco)**: Aplica las reglas específicas de cada entidad bancaria, como formatos de longitud fija, estructuras de registros (cabecera, detalle, cierre) y validación de campos posicionales.

Para una descripción detallada de las reglas de validación de cada banco soportado en el Plan Premium, por favor consulta la documentación específica en la carpeta de validadores:

**[Ver Documentación de Validaciones por Banco](./backend/src/validators/banks/README.md)**

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

-   `POST /api/validate`

Este es el endpoint principal para validar archivos. La petición debe ser de tipo `multipart/form-data` y contener los siguientes campos:

| Key           | Value                   | Descripción                                                                   |
| :------------ | :---------------------- | :---------------------------------------------------------------------------- |
| `paymentFile` | (Archivo `.txt`)        | El archivo de pagos que se desea validar.                                     |
| `plan`        | `basic` o `premium`     | El nivel de validación a aplicar.                                             |
| `bank`        | `santander` (u otro)    | El banco específico para la validación `premium`. No es necesario para el plan `basic`. |

### Ejemplo de Uso

#### Solicitud para Plan Básico
- **Archivo**: Un `.txt` con líneas como `0123456789012345678901 1500.50`.
- **Cuerpo de la petición (`form-data`):**
  - `paymentFile`: (tu archivo `testBasic.txt`)
  - `plan`: `basic`

#### Solicitud para Plan Premium
- **Archivo**: Un `.txt` con el formato de longitud fija de Santander.
- **Cuerpo de la petición (`form-data`):**
  - `paymentFile`: (tu archivo `testSantander.txt`)
  - `plan`: `premium`
  - `bank`: `santander`

La respuesta en ambos casos será un JSON con el resultado detallado de la validación.