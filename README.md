# ⚙️ GECIT - Backend API
**NestJS • TypeScript • MySQL • JWT • TypeORM • Swagger • Docker**

¡Bienvenido al núcleo central de **GECIT** (Gestión de Espacios y Citas de Innovasur)! Este repositorio contiene la robusta y eficiente API RESTful que actúa como cerebro de la plataforma integral de gestión de reservas, turnos, ofimática y administración.

El objetivo de este backend es proporcionar una infraestructura escalable, segura y altamente performante para administrar citas previas, mapas de mesas, competencias de empleados y generación automática de tickets, sirviendo datos complejos de forma ágil a los diferentes clientes.

---

## 🚀 Características Principales
- **Seguridad de Grado Militar (JWT)**: Sistema centralizado de autenticación con JSON Web Tokens y un sistema de control de acceso hiper-granular validando múltiples perfiles y jerarquías (`SUPERADMIN`, `ADMIN`, `EMPLEADO`, `CLIENTE`).
- **Arquitectura Multitenant**: La base de datos y la lógica de negocio soportan múltiples entidades de manera simultánea. La información está encapsulada para que un operador de una organización jamás interfiera con los datos de otra entidad.
- **Eventos en Tiempo Real (SSE)**: Implementación de flujos reactivos mediante Server-Sent Events (SSE) para emitir actualizaciones en vivo, como la notificación a pantallas de sala de espera cuando se llama a un ticket, sin sobrecargar la red.
- **Escalabilidad y Balanceo de Carga**: Configuración nativa para su ejecución en clústers mediante Docker y **Nginx Load Balancer**, soportando arquitecturas asimétricas (ej: un nodo procesando el 70% de la carga y réplicas menores).
- **Dashboard Analytics**: Múltiples endpoints analíticos para calcular y retornar distribuciones, mapas de calor horarios, históricos y tendencias en vivo requeridas por los gráficos del administrador.
- **Documentación Viva**: Integración total con **Swagger/OpenAPI** parametrizada profesionalmente en idioma inglés, lo que garantiza que cualquier desarrollador externo pueda explorar e invocar la API mediante una interfaz visual sin escribir código extra.

---

## 🛠️ Arquitectura y Construcción
Este proyecto abraza los principios de la Arquitectura Modular y la Inyección de Dependencias impulsada por NestJS, manteniendo un código sumamente escalable.

### 1. Capa de Seguridad (Security & Decorators)
El "portero" blindado de la aplicación.
- Uso de Guards globales combinados con decoradores customizados (`@Auth()`, `@CurrentUser()`, `@Public()`) para decidir la autorización de forma declarativa.
- Empleo del estándar `bcrypt` para el hasheo unidireccional de contraseñas de todos los agentes del sistema.

### 2. Capa de Controladores (Controllers)
Los puentes de la aplicación hacia internet.
- Capturan peticiones HTTP y delegan instantáneamente en la capa de servicios.
- Sanitación automática de payloads entrantes mediante el uso de `class-validator` en los Data Transfer Objects (DTOs).
- Totalmente anotados (`@ApiResponse`, `@ApiOperation`) para el autodescubrimiento de Swagger.

### 3. Lógica de Negocio (Services & Adapters)
Donde reside toda la magia de cálculo.
- **Trámites y Horarios**: Procesos exhaustivos para cruzar calendarios de empleados, festivos, sus competencias y las mesas disponibles para deducir de forma precisa los "slots" horarios a ofertar.
- **Adapters**: Patrón de diseño estructural implementado para transmutar las Entidades complejas de base de datos a respuestas DTO prístinas y uniformes para el Frontend.

### 4. Acceso a Datos (TypeORM + Entities)
Comunicación ORM nativa y robusta contra el motor MySQL.
- Mapeos de bases de datos altamente relacionales (`@OneToMany`, `@ManyToMany`, `@JoinColumn`) para soportar entidades en cascada y foreign keys dinámicas.
- Tipado rígido desde la concepción de la base de datos hasta su llegada al Response JSON final.

---

## 📦 Instalación y Desarrollo
¿Quieres arrancar la API en tu servidor o máquina de pruebas? Sigue los pasos:

1. **Clona el repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>/gecit-backend.git
   cd gecit-backend
   ```

2. **Configura tu Base de Datos**: 
   Asegúrate de contar con MySQL ejecutándose en el puerto 3306. Copia o renombra tu archivo `.env.template` a `.env` y carga tus credenciales:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=tu_password
   DB_NAME=gecit_db
   JWT_SECRET=gecit_super_secreto_cambiar_en_produccion
   JWT_EXPIRES_IN=8h
   ```

3. **Instala dependencias y levanta el entorno**:
   ```bash
   npm install --legacy-peer-deps
   npm run start:dev
   ```

¡Listo! Tu backend estará en activo e interactuando en caliente desde: `http://localhost:3000/api/v1`

4. **Datos de Prueba (Seed)**:
   Si necesitas rellenar la base de datos con información de prueba para probar la plataforma (Entidades, Roles, Empleados, Salas, Mesas y Trámites), simplemente realiza una petición `GET` al endpoint de Seed una vez levantado el servidor:
   ```bash
   curl http://localhost:3000/api/v1/seed
   ```
   *Nota: Este proceso borrará los datos existentes y generará un entorno limpio y configurado para demostraciones.*

---

## 🏗️ Despliegue en Clúster (Docker Compose)
Este proyecto de backend incluye la infraestructura exacta para ser servido en producción a través de un ecosistema Dockerizado de alta disponibilidad.

En la raíz global del proyecto ejecuta:
```bash
docker-compose up --build -d
```
Esto desplegará **3 instancias del backend** de NestJS trabajando en un clúster simultáneo y balanceado dinámicamente por un servidor **Nginx** frontal. 

---

## 🧪 Pruebas y Documentación Interactiva
Una vez tengas el servidor local encendido (o a través del clúster), la documentación interactiva Swagger estará accesible de inmediato desde:

👉 **[http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)**

---

<p align="center">
  Desarrollado con ❤️ para el Reto Innovasur y mi Trabajo de Final de Grado de Desarrollo de Aplicaciones Web.
</p>
