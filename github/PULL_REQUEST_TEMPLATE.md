## Descripción
<!-- Describe brevemente los cambios realizados -->

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Cambio que rompe compatibilidad
- [ ] Actualización de documentación

## ¿Cómo se ha probado?
<!-- Describe las pruebas realizadas -->

## Checklist
- [ ] Mi código sigue las guías de estilo del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código en áreas difíciles de entender
- [ ] He actualizado la documentación correspondiente
- [ ] Mis cambios no generan nuevas advertencias
- [ ] He añadido pruebas que demuestran que mi corrección es efectiva
```

## Opción 2: Template en carpeta .github

Puedes crear el archivo en `.github/PULL_REQUEST_TEMPLATE.md` (esta es la ubicación más común y organizada).

## Opción 3: Múltiples templates

Si necesitas diferentes templates para distintos tipos de PRs, crea una carpeta:
```
.github/
  PULL_REQUEST_TEMPLATE/
    bug_fix.md
    feature.md
    documentation.md