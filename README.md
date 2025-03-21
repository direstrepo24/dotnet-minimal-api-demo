# .NET Minimal API Demo

A simple demonstration of a .NET Minimal API built with .NET 10.

## Features

- Minimal API architecture
- Swagger documentation
- Docker containerization
- GitHub Actions for CI/CD
- Deployment to Azion

## API Endpoints

- `GET /` - Welcome message
- `GET /api/info` - Application information
- `GET /api/env` - Safe environment variables (excludes secrets)
- `POST /api/echo` - Echo back the posted JSON data

## Development

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
