# Book Scraper CLI

Una herramienta de línea de comandos para extraer y analizar datos de libros de http://books.toscrape.com

## Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd book-scraper-cli

# Instalar dependencias
npm install

# Construir el proyecto
npm run build
```

## Uso

### Scraping de Datos

```bash
# Extraer datos de libros
npm run dev -- scrape -u http://books.toscrape.com -o books-data.csv

# Opciones disponibles:
# -u, --url <url>         URL del sitio a scrapear (requerido)
# -o, --output <archivo>  Nombre del archivo de salida (default: scraped-data.csv)
```

### Análisis de Datos

```bash
# Analizar datos extraídos
npm run dev -- analyze -i ./data/books-data.csv -o analysis.json

# Opciones disponibles:
# -i, --input <archivo>   Archivo CSV de entrada (requerido)
# -o, --output <archivo>  Archivo de salida para resultados (default: analysis.json)
```

## Estructura del Proyecto

```
book-scraper-cli/
├── src/
│   ├── commands/        # Comandos CLI
│   ├── services/        # Lógica de negocio
│   ├── interfaces/      # Definiciones de tipos
│   ├── utils/          # Utilidades
│   └── index.ts        # Punto de entrada
├── tests/              # Pruebas
├── data/              # Datos extraídos y análisis
└── dist/              # Código compilado
```

## Scripts Disponibles

- `npm run build`: Compila el proyecto
- `npm start`: Ejecuta la versión compilada
- `npm run dev`: Ejecuta en modo desarrollo
- `npm test`: Ejecuta las pruebas
- `npm run test:watch`: Ejecuta las pruebas en modo watch
- `npm run test:coverage`: Genera reporte de cobertura

## Ejemplos de Análisis

El análisis incluye:
- Estadísticas de precios (min, max, promedio, mediana)
- Distribución de ratings
- Disponibilidad de libros
- Rango de fechas de scraping

Ejemplo de resultado:
```json
{
  "totalItems": 100,
  "priceStats": {
    "min": 10.99,
    "max": 59.99,
    "average": 25.49,
    "median": 23.99
  },
  "ratingStats": {
    "average": 4.2,
    "distribution": {
      "5": 30,
      "4": 45,
      "3": 15,
      "2": 7,
      "1": 3
    }
  },
  "availabilityDistribution": {
    "In stock": 85,
    "Out of stock": 15
  }
}
```

## Manejo de Errores

La aplicación incluye:
- Reintentos automáticos en caso de fallos de red
- Logging detallado
- Validación de entrada
- Manejo de excepciones

## Mejores Prácticas Implementadas

- Clean Architecture
- SOLID Principles
- Error Handling
- Logging
- Testing
- Type Safety


## Construir la imagen
`docker build -t book-scraper .`

## Ejecutar scraping
`docker run book-scraper scrape -u http://books.toscrape.com -o books.csv`

## Ejecutar análisis
`docker run -v $(pwd)/data:/app/data book-scraper analyze -i data/books.csv -o data/analysis.json`

