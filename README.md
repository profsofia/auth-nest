### Backend en Nestjs

1. abrir docker y verificar que esté funcionando

### docker es el archivo .yml lo creamos para no tener que estar trabajando siempre con la terminal.
2. levantar el backend ``npm run start:dev``
3. levantar la base de datos con mongoDB compas


## Levanta nuestra base de datos
- cuando ejecutamos este comando, lo que hace es ejecutar el archivo .yml para poder levantar nuestra base de datos que está en doker
#### -d es "La sentencia DETACH separa una parte de un árbol de mensajes sin suprimirla." es decir que podemos eliminar la terminal sin que el comando se detenga

``
docker compose up -d
``
## variables de entorno
``
Copiar el .env.template y renombrarlo a .env
``


## OBLIGATORIAMENTE NECESITAMOS TENER DOCKER CORRIENDO, Y ESO NO DAMOS CUENTA CUANDO LA BALLENA ESTÁ EN "VERDE" 
### Nota: no olvidar una vez terminada la práctica, hay que frenarlo para que no ocupe espacio en el disco
