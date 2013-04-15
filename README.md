# Click n'Travel

### Estructura jerárquica

```
.
├── assets
│   └── img
├── css
│   └── style.css
├── design
│   ├── contacto.jpg
│   ├── logo.jpg
│   ├── nosotros.jpg
│   └── portada.jpg
├── html
│   ├── about.html
│   ├── contact.html
│   ├── demo.html
│   ├── flights.html
│   └── layout.html
├── index.html
├── js
│   ├── code.js
│   ├── libs
│   │   ├── handlebars.js
│   │   └── require-jquery.js
│   └── main.js
├── README.md
└── start.sh

```

* assets: En esta carpeta se encontrán las imágenes y otros extras
* css: En esta carpeta se encontrarán todas las hojas de estilo
* design: En esta carpeta se encontrarán los diseños de la página
* html: En esta carpeta se encontrarán todos los archivos .html, excepto el index.html
* js: En esta carpeta encontraremos todos los archivos .js


### Cómo testear la página

Para poder testear en Linux o en Mac, se posicionan en el repositorio y
corren el script start.sh y luego en chrome ponen localhost:8000.

### Cómo crear un nuevo .html

Para crear un nuevo .html, copian el archivo html/demo.html y cambian el título
por el nuevo título de la página, cambian el /css/CUSTOM.css por el .css que quieran
o si no necesitan ninguno lo borran.
Dentro de body ponen todo aquello que quieran que se visualice en el cuerpo de la página,
es decir, sin incluir el sidebar ni el header que luego se incluye solo.

