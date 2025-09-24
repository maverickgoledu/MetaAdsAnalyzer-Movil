# 🌿 Branch Workflow - MetaAdsAnalyzer Móvil

Este documento describe el flujo de trabajo de ramas (branching strategy) para el proyecto MetaAdsAnalyzer Móvil.

## 📋 Tabla de Contenidos

- [Estrategia de Ramas](#estrategia-de-ramas)
- [Tipos de Ramas](#tipos-de-ramas)
- [Nomenclatura](#nomenclatura)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Comandos Git Útiles](#comandos-git-útiles)
- [Pull Requests](#pull-requests)
- [Versionado](#versionado)
- [Ejemplos Prácticos](#ejemplos-prácticos)

## 🎯 Estrategia de Ramas

Utilizamos una estrategia de **Git Flow simplificado** adaptado para desarrollo móvil:

```
main (producción)
├── develop (desarrollo)
│   ├── feature/nueva-funcionalidad
│   ├── feature/otra-funcionalidad
│   └── bugfix/correccion-error
└── hotfix/error-critico
```

## 🌳 Tipos de Ramas

### 1. **main** - Rama Principal
- **Propósito**: Código en producción
- **Estabilidad**: Siempre estable y listo para deploy
- **Protegida**: Requiere Pull Request y revisión
- **Deploy**: Automático a tiendas de aplicaciones

### 2. **develop** - Rama de Desarrollo
- **Propósito**: Integración de features
- **Base para**: Todas las ramas de feature y bugfix
- **Testing**: Debe pasar todos los tests antes de merge a main

### 3. **feature/** - Nuevas Funcionalidades
- **Propósito**: Desarrollo de nuevas características
- **Base**: develop
- **Merge**: Vuelve a develop via Pull Request

### 4. **bugfix/** - Corrección de Bugs
- **Propósito**: Correción de errores no críticos
- **Base**: develop
- **Merge**: Vuelve a develop via Pull Request

### 5. **hotfix/** - Correcciones Críticas
- **Propósito**: Errores críticos en producción
- **Base**: main
- **Merge**: Tanto a main como a develop

### 6. **release/** - Preparación de Release
- **Propósito**: Preparar nueva versión
- **Base**: develop
- **Merge**: A main y develop

## 📝 Nomenclatura

### Formato General
```
tipo/descripcion-corta
```

### Ejemplos
```bash
# Features
feature/login-usuario
feature/dashboard-metricas
feature/integracion-ia
feature/graficos-analytics

# Bugfixes
bugfix/error-autenticacion
bugfix/crash-android
bugfix/menu-navegacion

# Hotfixes
hotfix/seguridad-token
hotfix/crash-inicio-app

# Releases
release/v1.0.0
release/v1.1.0
```

### Convenciones
- Usar **kebab-case** (palabras separadas por guiones)
- Máximo 50 caracteres
- Descriptivo y específico
- En español para este proyecto

## 🔄 Flujo de Trabajo

### Para Features y Bugfixes

1. **Crear rama desde develop**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nombre-feature
   ```

2. **Desarrollar la funcionalidad**
   ```bash
   # Hacer commits frecuentes
   git add .
   git commit -m "feat: implementar autenticación de usuario"
   ```

3. **Mantener actualizada con develop**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/nombre-feature
   git rebase develop
   ```

4. **Push y Pull Request**
   ```bash
   git push origin feature/nombre-feature
   # Crear Pull Request en GitHub/GitLab
   ```

5. **Después del merge, limpiar**
   ```bash
   git checkout develop
   git pull origin develop
   git branch -d feature/nombre-feature
   ```

### Para Hotfixes

1. **Crear desde main**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/descripcion-problema
   ```

2. **Hacer la corrección**
   ```bash
   git add .
   git commit -m "hotfix: corregir crash en pantalla de login"
   ```

3. **Merge a main y develop**
   ```bash
   # A main
   git checkout main
   git merge hotfix/descripcion-problema
   git push origin main
   
   # A develop
   git checkout develop
   git merge hotfix/descripcion-problema
   git push origin develop
   ```

### Para Releases

1. **Crear rama de release**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.0.0
   ```

2. **Preparar release (versioning, changelog, etc.)**
   ```bash
   # Actualizar package.json
   # Actualizar CHANGELOG.md
   git add .
   git commit -m "release: preparar versión 1.0.0"
   ```

3. **Merge a main y develop**
   ```bash
   # A main con tag
   git checkout main
   git merge release/v1.0.0
   git tag -a v1.0.0 -m "Versión 1.0.0"
   git push origin main --tags
   
   # A develop
   git checkout develop
   git merge release/v1.0.0
   git push origin develop
   ```

## 🔧 Comandos Git Útiles

### Configuración Inicial
```bash
# Configurar usuario
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"

# Configurar editor
git config --global core.editor "code --wait"
```

### Trabajo Diario
```bash
# Ver estado
git status

# Ver ramas
git branch -a

# Cambiar rama
git checkout nombre-rama

# Crear y cambiar rama
git checkout -b nueva-rama

# Actualizar rama actual
git pull origin nombre-rama

# Ver diferencias
git diff

# Ver historial
git log --oneline --graph
```

### Limpieza
```bash
# Limpiar ramas locales ya mergeadas
git branch --merged | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d

# Limpiar referencias remotas
git remote prune origin
```

## 📋 Pull Requests

### Criterios para PR
- ✅ Código revisado y testeado
- ✅ Tests unitarios pasan
- ✅ Build exitoso
- ✅ Documentación actualizada si es necesario
- ✅ Conflictos resueltos

### Template de PR
```markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de cambio
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests unitarios pasan
- [ ] Testeado en Android
- [ ] Testeado en iOS
- [ ] Testeado en navegador

## Checklist
- [ ] Mi código sigue las convenciones del proyecto
- [ ] He realizado auto-review del código
- [ ] He comentado código complejo
- [ ] He actualizado documentación si es necesario
```

## 📊 Versionado

Seguimos **Semantic Versioning** (SemVer):

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: Cambios incompatibles (breaking changes)
- **MINOR**: Nueva funcionalidad compatible
- **PATCH**: Correcciones de bugs

### Ejemplos
```
v1.0.0 - Primera versión estable
v1.1.0 - Nueva funcionalidad (dashboard)
v1.1.1 - Corrección de bugs
v2.0.0 - Cambios incompatibles (nueva API)
```

## 💡 Ejemplos Prácticos

### Ejemplo 1: Nueva Feature - Dashboard
```bash
# 1. Crear rama
git checkout develop
git pull origin develop
git checkout -b feature/dashboard-analytics

# 2. Desarrollar
# ... hacer cambios ...
git add .
git commit -m "feat: agregar componente dashboard con métricas"

# 3. Mantener actualizada
git checkout develop
git pull origin develop
git checkout feature/dashboard-analytics
git rebase develop

# 4. Push y PR
git push origin feature/dashboard-analytics
# Crear Pull Request en la plataforma
```

### Ejemplo 2: Hotfix Crítico
```bash
# 1. Crear desde main
git checkout main
git pull origin main
git checkout -b hotfix/crash-login-android

# 2. Corregir problema
# ... hacer corrección ...
git add .
git commit -m "hotfix: corregir crash en login Android API 28+"

# 3. Merge a main
git checkout main
git merge hotfix/crash-login-android
git push origin main

# 4. Merge a develop
git checkout develop
git merge hotfix/crash-login-android
git push origin develop

# 5. Limpiar
git branch -d hotfix/crash-login-android
```

### Ejemplo 3: Preparar Release
```bash
# 1. Crear rama release
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# 2. Actualizar versiones
# Editar package.json: "version": "1.2.0"
# Actualizar CHANGELOG.md
git add .
git commit -m "release: bump version to 1.2.0"

# 3. Merge a main con tag
git checkout main
git merge release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin main --tags

# 4. Merge a develop
git checkout develop
git merge release/v1.2.0
git push origin develop
```

## 🚨 Reglas Importantes

1. **Nunca hacer push directo a main**
2. **Siempre crear Pull Request para review**
3. **Mantener ramas actualizadas con develop**
4. **Eliminar ramas después del merge**
5. **Usar commits descriptivos**
6. **Testear antes de crear PR**

## 🎨 Convención de Commits

Usamos **Conventional Commits**:

```bash
tipo(scope): descripción

feat(auth): agregar login con Google
fix(dashboard): corregir error en gráficos
docs(readme): actualizar instrucciones de instalación
style(login): mejorar diseño del formulario
refactor(services): reestructurar servicio de API
test(dashboard): agregar tests unitarios
chore(deps): actualizar dependencias
```

## 📞 Ayuda y Soporte

Si tienes dudas sobre el flujo de trabajo:
1. Consulta este documento
2. Pregunta al equipo de desarrollo
3. Revisa la documentación de Git

---

**Recuerda**: Un buen flujo de ramas mantiene el código organizado y facilita la colaboración en equipo. 🚀
