
# Etapa de construcción
FROM node:18-alpine as build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY bun.lockb ./

# Instalar dependencias usando npm (ya que bun no está disponible en la imagen base)
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar archivos construidos desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
