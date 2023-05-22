<template>
    <center>

        <div v-if="videos.length === 0" class="content-no-data">
            <img src="../assets/no_content_illustration_v3.svg" alt="imagen">
            <p><b>No hay videos disponibles.</b></p>
            <p>Pega un enlace de YouTube en el buscador y luego da Clic al botón añadir..</p>
        </div>

        <div class="video-list">
            <div class="video-item" v-for="video in videos" :key="video.id" @click="toggleModal(video)">
                <div class="thumbnail-container">
                    <img :src="video.thumbnail" alt="Video thumbnail" />
                    <div class="overlay" @click="toggleDeleteModal(video, $event)">
                        <button class="delete-button">
                            x
                        </button>
                    </div>
                    <div class="overlay-bottom">
                        <div class="duration-button-container">
                            {{ video.duration }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </center>

    <Modal @close="toggleModal" :modalActive="modalActive" from="modal-inner">
        <div class="modal-content">
            <div class="video-container">
                <iframe width="100%" height="100%" :src="embedUrl" frameborder="0" allowfullscreen></iframe>
            </div>
            <div class="info-container">
                <h3>{{ videTitle }}</h3>
                <div class="description">
                    <p>{{ videoDescription }}</p>
                    <!-- Más contenido de descripción aquí -->
                </div>
            </div>
        </div>
    </Modal>

    <Modal @close="toggleDeleteModal(null)" :modalActive="deleteModalActive" from="modal-inner-small">
        <div class="modal-content-video-delete">
            <center>
                <h3>¿Seguro de que quieres eliminar este video?</h3>
                <br>
                <div class="modal-buttons">
                    <button class="modal-cancel" @click="toggleDeleteModal(null)">Cancelar</button>
                    <button class="modal-confirm" @click="deleteVideo(videoToDelete, $event)">Eliminar</button>
                </div>
            </center>
        </div>
    </Modal>
</template>
  
<script setup>

import { ref } from 'vue';
import Modal from "./Modal.vue";
import 'vue3-toastify/dist/index.css';
import { toast } from 'vue3-toastify';

const props = defineProps({
    videos: {
        type: Array,
        default: () => []
    }
});

//const videos = ref(props.videos); //esto generaba problemas

const deleteVideo = async (video, event) => {
    console.log("video", video);
    console.log("indexOf", props.videos.indexOf(video));
    props.videos.splice(props.videos.indexOf(video), 1)

    //eliminar de la base de datos
    const response = await fetch(`${import.meta.env.VITE_SERVER_API}/videos/${video.id}`, {
        method: 'DELETE'
    })

    toggleDeleteModal(null);

    const data = await response.json();

    notify(data.message, 'success')
}



const modalActive = ref(false);
const deleteModalActive = ref(false);
const videoToDelete = ref(null);



const toggleModal = (video) => {

    modalActive.value = !modalActive.value;

    //validar que el modal se este abriendo para hacer la peticion
    if (modalActive.value) {
        getVideoInfo(video);
    } else {
        // Si el modal se está cerrando, pausar el video
        embedUrl.value = "";
    }

};

const toggleDeleteModal = (video, event = false) => {
    if (event) {
        event.stopPropagation();
    }
    videoToDelete.value = video;
    deleteModalActive.value = !deleteModalActive.value;

};

const videTitle = ref("");
const videoDescription = ref("");
const videoId = ref("");
const embedUrl = ref("");

const getVideoInfo = async (video) => {
    //obtener informacion de un video y mostrarla en el Modal
    const response = await fetch(`${import.meta.env.VITE_SERVER_API}/videos/${video.id}`, {
        method: 'GET'
    })

    const data = await response.json();

    videTitle.value = data.title;
    videoDescription.value = data.description;

    //obtgener el id de la url del video para mostrarlo en el iframe
    videoId.value = video.url.split("v=")[1]
    embedUrl.value = `https://www.youtube.com/embed/${videoId.value}`
}


const notify = (message, type) => {
    if (type === 'success') {
        toast.success(message, {
            autoClose: 1000,
        });
    } else if (type === 'error') {
        toast.error(message, {
            autoClose: 1000,
        });
    } else if (type === 'info') {
        toast.info(message, {
            autoClose: 1000,
        });
    } else if (type === 'warning') {
        toast.warning(message, {
            autoClose: 1000,
        });
    } else if (type === 'default') {
        toast(message, {
            autoClose: 1000,
        });
    }
    // ToastOptions
}

</script>

<style scoped>
.video-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    width: 80%;
    padding-top: 100px;
    margin-bottom: 40px;
}

.video-item {
    background-color: #ececec;
    max-width: 200px;
    max-height: 100%;
    cursor: pointer;
}

@media (max-width: 600px) {
    .video-item {
        max-width: 100%;
        /* background: #136AE4; */
    }

}

@media (max-width: 1049px) {
    .video-item {
        max-width: 100%;
        /* background: #136AE4; */
    }

}

.thumbnail-container {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    /* Relación de aspecto 16:9 (9 dividido por 16, luego multiplicado por 100) */
}

.thumbnail-container img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.overlay {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    padding: 0px 6px 0px 6px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    width: auto;
    margin: 5px;
    cursor: pointer;
    border-radius: 10%;
}

.overlay:hover {
    padding: 0px 6px 0px 6px;
    background-color: rgba(0, 0, 0, 1);
    padding: 1px 8px 1px 8px;
    font-weight: bold;
    margin: 3px;
}


.overlay-bottom {
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    padding: 0px 6px 0px 6px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    width: auto;
    margin: 5px;
}

.duration {
    font-size: 12px;
}

.duration-button-container {
    align-self: flex-start;
    font-size: 12px;
}

.delete-button {
    background: none;
    border: none;
    font-size: 16px;
    color: #fff;
    padding: 0;
    cursor: pointer;
}

@media (max-width: 991px) {
    .video-list {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
}

@media (max-width: 767px) {
    .video-list {
        grid-template-columns: 1fr;
    }
}


/* Contenido del modal */
.modal-content {
    display: flex;
    max-height: 100%;
}

.video-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
    /* Proporción de aspecto 16:9 (dividir la altura por el ancho y multiplicar por 100) */
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 80%;
}

.info-container {
    width: 50%;
    padding: 0 20px;
}

h1 {
    text-align: center;
}

.description {
    max-height: 90%;
    /* Altura máxima de la descripción */
    overflow: auto;
    /* Permitir desplazamiento vertical */
}

/* Media queries para estilos responsivos */
@media (max-width: 768px) {
    .modal-content {
        flex-direction: column;
    }

    .video-container {
        padding-bottom: 0;
        /* Eliminar el padding inferior */
        width: 100%;
        /* Ancho completo */
        height: auto;
        /* Altura automática */
    }

    .info-container {
        width: 100%;
        padding: 20px;
    }

    .video-container iframe {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .description {
        max-height: 200px;
        overflow: auto;
        /* Permitir desplazamiento vertical */
        padding-right: 20px;
    }

}


/* estils botones eliminar video */

.modal-cancel {
    background: white;
    border: 1px solid #136ae4;
    font-size: 16px;
    color: #136ae4;
    padding: 0;
    cursor: pointer;
    padding: 16px 100px 16px 100px;
    border-radius: 10px;
    margin: 10px;
}

.modal-confirm {
    color: white;
    background-color: #136ae4;
    border: 0px;
    font-size: 16px;
    cursor: pointer;
    padding: 16px 100px 16px 100px;
    border-radius: 10px;
    margin: 10px;
}

.modal-content-video-delete {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 150px;
}



.content-no-data {
    padding-top: 100px;
}
</style>