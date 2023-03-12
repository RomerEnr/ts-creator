# TS-CREATOR

TS-CREATOR es un script que facilita la creación de proyectos en Typescript de NodeJS.

## Instalación

```bash
git clone ${repo}
cd ts-creator
chmod +x installer.sh
./installer.sh
```

## Uso

```bash
ts-creator [nombre del proyecto] -[opciones] [tipo de proyecto]
```

### Opciones

| Opción | Descripción |
| ------ | ----------- |
| --help -h     | Muestra la ayuda |
| --type -t    | Eliges una tipo de proyecto |

### Tipos de proyecto

| Tipo | Descripción |
| ---- | ----------- |
| back-empty | Crea un proyecto de NodeJS con Typescript con las mínimas dependencias |
| back-express | Crea un proyecto de NodeJS con Typescript con las dependencias de Express |