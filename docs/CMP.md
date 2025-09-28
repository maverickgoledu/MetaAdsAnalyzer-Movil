# Plan de Gestión de Configuración (CMP)
MetaAdsAnalyzer-Movil

## 1. Información General
- **Fecha:** 27 de Septiembre, 2025
- **Responsable:** Jaime Sarabia
- **Versión del Documento:** 1.0.0

## 2. Alcance del Sistema
MetaAdsAnalyzer-Movil es una aplicación móvil desarrollada con Ionic/Angular que permite analizar y gestionar anuncios de Meta (Facebook/Instagram). El sistema incluye:
- Interfaz de usuario móvil
- Integración con APIs de Meta
- Análisis de datos de campañas publicitarias
- Generación de reportes

## 3. Roles y Responsabilidades
### Configuration Manager
- **Responsables:** 
  - Jaime Sarabia (Principal)
  - Isrrael Lopez
  - Diego Valdivieso
- **Responsabilidades:**
  - Gestión del plan de configuración
  - Supervisión del control de versiones
  - Administración de releases
  - Presidir el CCB (Change Control Board)

### Desarrolladores
- Seguir los estándares de codificación
- Crear y mantener branches según GitFlow
- Documentar cambios
- Participar en revisiones de código

### CCB (Change Control Board)
- **Miembros:**
  - Jaime Sarabia (Presidente)
  - Isrrael Lopez
  - Diego Valdivieso
- Evaluar solicitudes de cambio (CR)
- Aprobar/rechazar cambios
- Documentar decisiones

## 4. Gestión de Repositorios
### Repositorio Principal
- GitHub: [maverickgoledu/MetaAdsAnalyzer-Movil](https://github.com/maverickgoledu/MetaAdsAnalyzer-Movil)
- Acceso: Privado
- Control de Versiones: Git

## 5. Esquema de Versionado (SemVer)
Formato: vX.Y.Z
- X: Versión mayor (cambios incompatibles)
- Y: Versión menor (nuevas funcionalidades compatibles)
- Z: Parche (correcciones de errores)

## 6. Estrategia de Ramas
### Ramas Principales
- `main`: Rama principal de producción
- `pruebas`: Rama de pruebas y validación

### Flujo de Trabajo
1. El desarrollo se realiza en ramas de características
2. Las integraciones se realizan a la rama `pruebas`
3. Una vez validado en `pruebas`, se integra a `main`

### Políticas de Branch
1. Toda feature debe originarse desde `develop`
2. Los releases se mergean a `main` y `develop`
3. Los hotfixes se mergean a `main` y `develop`

## 7. Control de Cambios
### Proceso de Solicitud de Cambios (CR)
1. Apertura de CR con descripción detallada
2. Análisis de impacto
3. Revisión por CCB
4. Implementación si es aprobado

### Documentación Requerida
- Formulario CR
- Análisis de impacto
- Acta de reunión CCB
- Plan de implementación

## 8. Items de Configuración (IC)
- Código fuente (`/src`)
- Documentación (`/docs`)
- Configuraciones (`/*.json`, `/*.ts`)
- Assets (`/src/assets`)
- Tests (`/src/app/**/*.spec.ts`)

## 9. Líneas Base
- Desarrollo: `develop` branch
- QA: Tags de release candidatos
- Producción: Tags en `main`

## 10. Automatización (CI/CD)
Ver `.github/workflows/` para configuración detallada de:
- Build automatizado
- Tests unitarios
- Lint
- Deploy a ambientes

## 11. Contabilidad de Estado (CSA)
| IC | Versión | Estado | Responsable | Fecha |
|----|---------|---------|-------------|--------|
| CMP.md | 1.0.0 | Activo | Jaime Sarabia | 2025-09-27 |
| package.json | 1.0.0 | Activo | Jaime Sarabia | 2025-09-27 |

## 12. Auditorías
### FCA (Functional Configuration Audit)
- Frecuencia: Previo a cada release
- Responsable: Jaime Sarabia
- Documentación: `/docs/audits/fca/`

### PCA (Physical Configuration Audit)
- Frecuencia: Mensual
- Responsable: Jaime Sarabia
- Documentación: `/docs/audits/pca/`