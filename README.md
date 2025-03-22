# .NET Minimal API Demo en Azion Edge Computing

Una demostración de una API Minimal en .NET 8 desplegada en Azion Edge Computing utilizando contenedores Docker multi-arquitectura.

## Características

- Arquitectura Minimal API de .NET 8
- Documentación con Swagger
- Contenedores Docker multi-arquitectura (AMD64 y ARM64)
- GitHub Actions para CI/CD automatizado
- Despliegue en Azion Edge Computing con soporte para contenedores

## Endpoints de la API

- `GET /` - Mensaje de bienvenida
- `GET /api/info` - Información de la aplicación
- `GET /api/env` - Variables de entorno seguras (excluye secretos)
- `POST /api/echo` - Devuelve los datos JSON enviados
- `GET /swagger` - Documentación Swagger UI

## Arquitectura

Esta aplicación utiliza:

- **Azion Edge Computing**: Plataforma edge que ejecuta nuestra función JavaScript y contenedor Docker.
- **Edge Function**: Código JavaScript que actúa como proxy para redirigir solicitudes al contenedor Docker.
- **Contenedor Docker Multi-Arquitectura**: Imagen compatible con AMD64 y ARM64 que ejecuta nuestra API .NET.

## Configuración del CI/CD

### Requisitos de Secretos de GitHub

> ⚠️ **IMPORTANTE**: El pipeline de CI/CD requiere configurar los siguientes secretos en GitHub:

- `DOCKERHUB_TOKEN`: Token de acceso personal para Docker Hub (usuario: direstrepobr)
- `AZION_TOKEN`: Token de autenticación para Azion

Para configurar estos secretos:

1. Ve a tu repositorio en GitHub
2. Navega a "Settings" > "Secrets and variables" > "Actions"
3. Haz clic en "New repository secret" para cada secreto

## Desarrollo y Troubleshooting

### Solución de Problemas Comunes con Azion

#### Error 500 Internal Server

Si encuentras errores 500 al acceder a tu aplicación desplegada en Azion, verifica:

1. **Compatibilidad de la imagen Docker**: Asegúrate de que tu imagen Docker soporte múltiples arquitecturas (AMD64/ARM64)
   ```bash
   # Puedes verificar las arquitecturas soportadas con
   docker manifest inspect direstrepobr/minimal-api-demo:multiarch
   ```

2. **Configuración del args.json**: Verifica que el puerto y la imagen en `args.json` sean correctos
   ```json
   {
     "container": {
       "image": "direstrepobr/minimal-api-demo:multiarch",
       "port": 8080
     }
   }
   ```

3. **Función Edge JavaScript**: Asegúrate de que tu función JavaScript simplemente devuelva el objeto `request` sin modificaciones para permitir que Azion lo redirija al contenedor

4. **Reglas de Enrutamiento**: Verifica que las reglas de enrutamiento de Azion apunten al ID de función correcto

#### Problemas con la Imagen Docker

Si la imagen Docker no se puede descargar o ejecutar en Azion:

1. Construye manualmente la imagen multi-arquitectura:
   ```bash
   docker buildx create --name multiarch-builder --use
   docker buildx build --platform linux/amd64,linux/arm64 -t [tu-usuario]/[tu-imagen]:multiarch --push .
   ```

2. Actualiza el `args.json` para usar esta imagen

### Prerequisites

- .NET 10 SDK
- Docker

### Running Locally

```bash
dotnet run
```

### Building Docker Image

```bash
docker build -t minimal-api-demo .
docker run -p 8080:80 minimal-api-demo
```

## Deployment

This project is automatically deployed to Azion using GitHub Actions when changes are pushed to the main branch.

## License

MIT
