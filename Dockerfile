# Etapa 1: Construcción
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Instalamos solo las dependencias de producción para mantener la imagen ligera
RUN npm install --omit=dev --legacy-peer-deps
# Copiamos la build compilada de la etapa anterior
COPY --from=build /app/dist ./dist
# Exponemos el puerto de NestJS
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
