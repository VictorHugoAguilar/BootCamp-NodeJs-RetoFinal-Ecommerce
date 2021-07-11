# Ecommerce Online BackEnd

Backend de app ecommerce

## Requisitos para levantar

Es necesario configurar una variable de entorno que cogera los datos necesarios la variable tiene que llamarse .env en el directorio raiz.

`````
.env
`````

## Configuración de puerto de la app

En la variable de entorno configurar el puerto donde levantamos la app.

`````
PORT=3003
`````

## Mongodb

La aplicación utiliza mongodb como base de datos, para que la aplicación funcione hay que configurar las variables de entorno con la direccion de la base de datos.

- Configuración en variable de entorno:

`````
DB_CNN=mongodb://localhost:27017/ecommerce
``````

## JWT

Configuración del JWT secret, este hay que configurarlo en el mismo fichero .env

`````
JWT_SECRET = 'SECRETO'
``````

## ID_CONFIG_APP

La aplicación tiene que configurarse con unos datos que luego se pueden consultar en el front, en el siguiente end-point 

- api/config/registrar-config

`````
{
        "categorias": [
            {
                "titulo": "moda",
                "icono": "ico_moda"
            },
            {
                "titulo": "complemento",
                "icono": "ico_complemento"
            }
        ],
        "titulo": "titulo",
        "serie": "0001",
        "correlativo": "0002",
        "logo": "aLuUOJfJT0gzbWpz2adRQ4Z7.gif",
        "createdAt": "2021-07-11T20:47:36.349Z",
        "uid": "60eb58e8bdddc9c402efaef2"
    }
``````

El id este tenemos que configurarlo en la variable de entorno

`````
ID_CONFIG_APP = 60eb58e8bdddc9c402efaef2
``````

## Levantar Aplicacion

Una vez que se tiene levantado el servidor de mongodb levantamos la aplicación con el comando

`````
npm start
`````

@Author: Victor Hugo Aguilar Aguilar

