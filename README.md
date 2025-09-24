# MetaAdsAnalyzer Móvil

Una aplicación móvil desarrollada con **Ionic Framework** y **Angular** para el análisis de anuncios de Meta (Facebook/Instagram).

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Prerequisitos](#prerequisitos)
- [Instalación](#instalación)
- [Desarrollo](#desarrollo)
- [Build](#build)
- [Deployment](#deployment)
- [Testing](#testing)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Características

- 📊 Dashboard con métricas de anuncios
- 🤖 Integración con Inteligencia Artificial
- 👥 Gestión de usuarios
- 📱 Aplicación móvil nativa (Android/iOS)
- 🔐 Sistema de autenticación
- 📈 Visualización de datos con gráficos interactivos

## 🚀 Tecnologías

- **Framework**: Ionic 8.0.0
- **Frontend**: Angular 20.0.0
- **Mobile Runtime**: Capacitor 7.4.3
- **UI Components**: Ionic Angular
- **Charts**: Chart.js + ng2-charts
- **Icons**: Ionicons 7.4.0
- **Language**: TypeScript 5.8.0

## Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

```bash
Node.js >= 18.x
npm >= 9.x
```

### Instalaciones Globales Requeridas

```bash
npm install -g @ionic/cli
npm install -g @capacitor/cli
npm install -g @angular/cli
```

### Para desarrollo móvil:

#### Android
- Android Studio
- Android SDK
- Java JDK 11 o superior

#### iOS (solo en macOS)
- Xcode 12+
- iOS SDK

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd MetaAdsAnalyzer-Movil
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Sincronizar plataformas móviles**
   ```bash
   ionic capacitor sync
   ```

## Desarrollo

### Servidor de Desarrollo

Ejecutar en modo desarrollo web:
```bash
npm start
# o
ionic serve
```

La aplicación estará disponible en `http://localhost:8100`

### Desarrollo con Live Reload en Dispositivo

```bash
# Android
ionic capacitor run android -l --external

# iOS (solo macOS)
ionic capacitor run ios -l --external
```

### Comandos de Capacitor

```bash
# Agregar plataforma
ionic capacitor add android
ionic capacitor add ios

# Sincronizar cambios
ionic capacitor sync

# Copiar assets web
ionic capacitor copy

# Actualizar dependencias nativas
ionic capacitor update
```

## Build

### Build para Producción Web
```bash
npm run build
```

### Build para Móvil

1. **Generar build de producción**
   ```bash
   ionic build --prod
   ```

2. **Sincronizar con plataformas**
   ```bash
   ionic capacitor sync
   ```

3. **Abrir en IDE nativo**
   ```bash
   # Android Studio
   ionic capacitor open android
   
   # Xcode (macOS)
   ionic capacitor open ios
   ```

## Deployment

### Android
1. Abrir Android Studio
2. Build > Generate Signed Bundle/APK
3. Seguir el asistente para generar el APK/AAB

### iOS
1. Abrir Xcode
2. Product > Archive
3. Distribuir a través de App Store Connect

### Web
```bash
# Build y deploy (configurar según tu hosting)
ionic build --prod
# Subir contenido de ./www a tu servidor web
```

## Testing

```bash
# Tests unitarios
npm run test

# Tests con cobertura
npm run test -- --code-coverage

# Linting
npm run lint
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   └── bottom-nav/     # Navegación inferior
│   ├── pages/              # Páginas de la aplicación
│   │   ├── dashboard/      # Panel principal
│   │   ├── ia/            # Inteligencia Artificial
│   │   ├── login/         # Autenticación
│   │   └── usuarios/      # Gestión de usuarios
│   ├── services/          # Servicios Angular
│   │   ├── auth.service.ts
│   │   ├── dashboard.service.ts
│   │   └── ia.service.ts
│   └── home/              # Página de inicio
├── assets/                # Recursos estáticos
├── environments/          # Configuraciones de entorno
└── theme/                # Estilos globales
```

## Personalización de Tema

Los colores y estilos se pueden personalizar en:
- `src/theme/variables.scss` - Variables CSS personalizadas
- `src/global.scss` - Estilos globales

## Configuración

### Variables de Entorno

Editar `src/environments/environment.ts` y `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://your-api-url.com',
  // Otras configuraciones...
};
```

### Configuración de Capacitor

Modificar `capacitor.config.ts` según tus necesidades:

```typescript
const config: CapacitorConfig = {
  appId: 'com.yourcompany.metaadsanalyzer',
  appName: 'MetaAdsAnalyzer',
  webDir: 'www',
  // Configuraciones adicionales...
};
```

## Plugins Utilizados

- `@capacitor/app` - Información de la aplicación
- `@capacitor/clipboard` - Acceso al portapapeles
- `@capacitor/haptics` - Feedback táctil
- `@capacitor/keyboard` - Control del teclado
- `@capacitor/preferences` - Almacenamiento local
- `@capacitor/share` - Compartir contenido
- `@capacitor/status-bar` - Control de la barra de estado

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

Ver [BRANCH_WORKFLOW.md](./BRANCH_WORKFLOW.md) para más detalles sobre el flujo de trabajo con ramas.

