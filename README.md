# Aplicación Vue para gestionar videos de Youtube

Esta es una aplicación simple construida con Vue.js que te permite agregar y mostrar una lista de videos, lives o shorts desde URL de YouTube. La aplicación cuenta con dos componentes principales: un formulario de entrada y una lista de videos agregados.

## Demo

Puedes revisar la [Demo en vivo aquí](http://18.191.69.236/) para ver la aplicación en funcionamiento.

sí le interesa ver la aplicación backend puede hacerlo en el siguiente repositorio https://github.com/hectorcr1/gestor_videos

## Capturas de pantalla

A continuación se muestran algunas capturas de pantalla que muestran las funcionalidades de la aplicación:

![1](https://github.com/hectorcr1/gestor_videos_vue/assets/29236594/ec40f711-2090-41f3-a2a7-228769180ae5)
Pantalla principal

![2](https://github.com/hectorcr1/gestor_videos_vue/assets/29236594/e0770b4d-d6d3-4853-9c8b-f7c0f149b084)
Validación url ingresada

![3](https://github.com/hectorcr1/gestor_videos_vue/assets/29236594/cd93b48d-1ae5-4de7-b9a1-1b40f095f8ed)
Mensaje de feedback para el usuario al agregar video

![4](https://github.com/hectorcr1/gestor_videos_vue/assets/29236594/feb27e0f-92a8-443a-aaca-c565c057feb9)
Modal con detalles que permite ver el título, la descripción y reproducir el video

![duplicado](https://github.com/hectorcr1/gestor_videos_vue/assets/29236594/b15ed210-6d1d-42cf-8556-0cff120ea827)
Mensaje de feedback para el usuario al intentar agregar video que ya existe

![eliminar](https://github.com/hectorcr1/gestor_videos_vue/assets/29236594/6e691138-0b47-4ef8-8b07-479ddf2e155e)
Mensaje de feedback para el usuario al eliminar un video

![sin datos](https://github.com/hectorcr1/gestor_videos_vue/assets/29236594/30f075ab-dfe6-478e-b518-73628dc2c33e)
Imagen para informar al usuario que no hay videos en la plataforma

## Características

- Agregar videos desde URL de YouTube.
- Mostrar la lista de videos agregados con miniaturas, duración y opción para eliminar.
- Diseño responsivo que se adapta a diferentes tamaños de pantalla.
- Las miniaturas de video se ajustan al contenedor sin deformarse y conservan la relación de aspecto.
- La duración del video se muestra en la esquina inferior derecha de cada miniatura.
- Botón de eliminación en la esquina superior derecha de cada miniatura para eliminar el video de la lista.

## Tecnologías utilizadas

- Vue 3 (con Composition API y <script setup>)
- HTML5
- CSS3

## Instalación y Uso

1. Clona este repositorio: `git clone https://github.com/hectorcr1/gestor_videos_vue.git`
2. Navega al directorio del proyecto: `cd gestor_videos_vue`
3. Instala las dependencias: `npm install`
4. Inicia la aplicación: `npm run dev`
5. Abre tu navegador web y accede a `http://localhost:3000` para ver la aplicación en funcionamiento.
