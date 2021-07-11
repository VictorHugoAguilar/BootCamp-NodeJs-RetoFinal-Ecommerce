# Ecommerce Online BackEnd

Backend de app ecommerce.

# Endpoint

** Admin:
        - Registro
        - Obtencion
        - Login    
* Clientes:
        - Registro
        - Login
        - Obtener todos
        - Obtener con filtro
        - Obtener por id (solo rol admin)
        - Actualizar cliente 
        - Actualizar cliente por admin (solo rol admin)
        - Registrar cliente por admin (solo rol admin)
        - Obtener cliente actual por token
        - Obtencion de direción cliente
        - Obtener dirección principal
* Productos:
        - Listar productos
        - Listar productos por titulo
        - Listar productos por categoria
        - Listar productos mayor venta
        - Listar productos orden precio
        - Listar producto por tipo y orden
        - Obtener detalle de producto
        - Listar inventario de producto
        - Obtener portada producto por nombre de imagen
        - Obtener portada producto por titulo de producto
        - Actualizar producto (solo rol admin)
        - Eliminar producto (solo rol admin)
        - Registrar inventario (solo rol admin)
        - Eliminar inventario (solo rol admin)
        - Registrar variedad producto (solo rol admin)
        - Registrar galeria de producto (solo rol admin)
        - Eliminar imagen de galeria (solo rol admin)
* Cupones:
        - Registrar cuppón (solo rol admin)
        - Listar cupón por código
        - Listar cupón por id
        - Actualizar cupón (solo rol admin)
        - Eliminar cupón (solo rol admin)
* Config:
        - Crear configuración
        - Modificar configuración
        - Obtener configuración publica
        - Obtener configuracion por id (solo rol admin)
        - Obtener 
* Carrito:
        - Añadir producto a carrito
        - Obtener carrito con productos
        - Eliminar producto de carrito
* Compras-Ventas:
        - Registra compra
        - Obtener Compras cliente
        - Obtener Detalles compra cliente
        - Obtener Ventas totales (solo rol admin)
        - Obtener Ventas por rango fechas(solo rol admin)

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

