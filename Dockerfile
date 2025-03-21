FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src
COPY ["MinimalApiDemo.csproj", "./"]
RUN dotnet restore "MinimalApiDemo.csproj"
COPY . .
RUN dotnet build "MinimalApiDemo.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MinimalApiDemo.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MinimalApiDemo.dll"]
