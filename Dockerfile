# Usar imágenes base específicas para múltiples arquitecturas
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Etapa de compilación con soporte para múltiples arquitecturas
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Instalar herramientas para ARM64 si es necesario
RUN if [ "$(arch)" = "x86_64" ]; then \
    dpkg --add-architecture arm64 && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
    libc6:arm64 \
    libicu-dev:arm64 \
    libssl-dev:arm64; \
    fi || true

# Copiar y restaurar las dependencias del proyecto
COPY ["MinimalApiDemo.csproj", "./"]
RUN dotnet restore "MinimalApiDemo.csproj"

# Copiar el resto del código y compilar
COPY . .
RUN dotnet build "MinimalApiDemo.csproj" -c Release -o /app/build

# Publicar la aplicación
FROM build AS publish
RUN dotnet publish "MinimalApiDemo.csproj" -c Release -o /app/publish

# Imagen final optimizada
FROM --platform=$TARGETPLATFORM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_ENVIRONMENT=Production

# Configuraciones para mejorar el rendimiento en entornos edge
ENV DOTNET_EnableDiagnostics=0
ENV DOTNET_gcServer=1
ENV DOTNET_gcConcurrent=1

# Punto de entrada de la aplicación
ENTRYPOINT ["dotnet", "MinimalApiDemo.dll"]
