# MCP API Endpoint

Esta implementación proporciona un endpoint HTTP para servir herramientas MCP (Model Context Protocol) a través de una API REST de Next.js.

## Endpoint

```
POST /api/mcp
```

## Protocolo MCP

La API implementa el protocolo MCP 2024-11-05 usando JSON-RPC 2.0.

### Métodos disponibles

#### 1. Initialize
Inicializa la conexión MCP.

```json
{
  "jsonrpc": "2.0",
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": {
      "name": "test-client",
      "version": "1.0.0"
    }
  },
  "id": 1
}
```

#### 2. Listar herramientas
Obtiene la lista de herramientas disponibles.

```json
{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "params": {},
  "id": 2
}
```

#### 3. Ejecutar herramienta
Ejecuta una herramienta específica.

```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "disk-view_space",
    "arguments": {}
  },
  "id": 3
}
```

## Herramientas disponibles

### 1. `disk-view_space`
- **Descripción**: Ver el espacio en disco disponible
- **Argumentos**: Ninguno
- **Ejemplo de respuesta**: 
```json
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Available disk space: 48G"
      }
    ]
  },
  "id": 3
}
```

### 2. `courses-search_all`
- **Descripción**: Retorna una lista completa de todos los cursos disponibles
- **Argumentos**: Ninguno

### 3. `courses-search_by_id`
- **Descripción**: Buscar un curso específico por su ID
- **Argumentos**: `{ "id": "course_id" }`

### 4. `courses-search_by_similar_name`
- **Descripción**: Buscar un curso específico por nombre similar
- **Argumentos**: `{ "name": "course_name" }`

### 5. `courses-search_similar_by_ids`
- **Descripción**: Buscar cursos similares a los proporcionados por IDs
- **Argumentos**: `{ "ids": ["id1", "id2"] }`

## Pruebas

Puedes usar el script de pruebas incluido:

```bash
node test-mcp-api.js
```

## Despliegue en Vercel

Esta implementación está lista para desplegarse en Vercel siguiendo la guía oficial de MCP servers. El endpoint estará disponible en:

```
https://your-app.vercel.app/api/mcp
```

## Características técnicas

- **Runtime**: Node.js
- **Inyección de dependencias**: Integrado con el sistema DI del proyecto
- **Manejo de errores**: Implementa códigos de error estándar JSON-RPC
- **Validación**: Valida estructura y formato de requests MCP
- **Herramientas dinámicas**: Carga automáticamente todas las herramientas MCP registradas
