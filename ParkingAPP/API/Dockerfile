# Dockerfile

FROM mcr.microsoft.com/dotnet/core/sdk:3.1.200-alpine3.11 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . .
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1.2-alpine3.11
WORKDIR /app
COPY --from=build-env /app/out .

# Run the app on container startup
# Use your project name for the second parameter
# e.g. MyProject.dll
CMD ASPNETCORE_URLS=http://*:$PORT dotnet HerokuApp.dll