# Flujo de Trabajo de Ramas

Este documento describe la estrategia y flujo de trabajo de ramas para el proyecto MetaAdsAnalyzer-Movil.

## Estructura de Ramas

### Ramas Principales

1. **main**
   - Rama principal que contiene el código en producción
   - Todo el código aquí debe estar probado y validado
   - Los merges a main requieren aprobación

2. **pruebas**
   - Rama de integración y validación
   - Se utiliza para probar las características antes de producción
   - Ambiente de pre-producción

## Historial de Cambios Significativos

### Septiembre 2025
- **24/09/2025**: Actualización de documentación del proyecto
- **23/09/2025**: Merge de características principales desde pruebas a producción
  - Implementación de páginas principales
  - Servicios base de la aplicación
  - Sistema de rutas
  - Estructura Angular/Ionic base
- **21/09/2025**: Commit inicial del proyecto
- **11/09/2025**: Creación del repositorio

## Proceso de Trabajo

1. **Desarrollo de Nuevas Características**
   - Crear rama desde `pruebas`
   - Desarrollar la característica
   - Probar localmente
   - Crear Pull Request a `pruebas`

2. **Integración a Producción**
   - Validar cambios en rama `pruebas`
   - Realizar pruebas de integración
   - Crear Pull Request a `main`
   - Obtener aprobaciones necesarias

3. **Hotfixes (Correcciones Urgentes)**
   - Crear rama desde `main`
   - Implementar corrección
   - Pull Request directo a `main`
   - Backport a `pruebas`

## Convenciones de Commits

Utilizamos los siguientes prefijos para los commits:
- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `config:` Cambios de configuración
- `refactor:` Refactorización de código
- `test:` Adición o modificación de tests

## Políticas de Merge

1. **Pull Requests**
   - Requieren al menos 1 revisión
   - Deben pasar todos los tests
   - No conflictos pendientes

2. **Estrategia de Merge**
   - Se prefiere merge commit sobre squash
   - Mantener historial de commits limpio y descriptivo
