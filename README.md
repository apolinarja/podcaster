Aplicación SPA para visualizar los 100 podcast más populares de Itunes.

# Instalación

Para lanzar la app de la manera más simple se ha utilizado un XAMPP para Windows junto con su módulo Apache.

1. Instalar XAMPP [https://www.apachefriends.org/es/download.html](https://www.apachefriends.org/es/download.html)
2. En la carpeta de instalación crear la ruta …\xampp\htdocs\podcaster
3. Clonar el repositorio en la carpeta &quot;podcaster&quot; teniendo especial importancia el archivo .htacces. Esta configurado para redireccionar dentro de servidor las peticiones de nuestra app.
4. Arrancar el módulo Apache.
5. En el navegador introducir &quot;localhost/podcaster&quot;.

# Desarrollo

Para el desarrollo de la app se han usado las siguientes librerías:

- Backbone.js
- Underscore.js
- jQuery
- Bootstrap

# Notas

- No se ha realizado la versión minificada de la app debido a que no existe un plugin más allá de algunas fuentes no contrastadas. La única solución que se puede barajar sería hacerlo a mano.
- Para el acceso a los recursos externos he usado [http://cors.io](http://cors.io). En mi caso ha sido necesario crear una excepción en el antivirus
