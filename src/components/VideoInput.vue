<template>
    <label for="url-video">
        <h2>Añadir nuevo video</h2>
    </label>
    <div class="buscador">
        <input id="url-video" type="text" placeholder="Añadir" v-model="videoUrl" @keypress.enter="addVideo"
            @input="validateUrl()">
        <button @click="addVideo" class="boton-agregar">Añadir</button>
    </div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
</template>

<script setup>

import { ref, defineEmits } from 'vue';
import 'vue3-toastify/dist/index.css';
import { toast } from 'vue3-toastify';

const isYoutubeUrl = ref(true)
const videoUrl = ref('');
const errorMessage = ref('');
const emit = defineEmits(['addVideo'])


const validateUrl = () => {
    const videoId = obtenerIDdeURL(videoUrl.value);
    console.log('videoId', videoId)
    if (!videoId) {
        errorMessage.value = 'URL invalida';
        return false;
    }
    errorMessage.value = '';
    return true;
}

const addVideo = async () => {
    const videoId = obtenerIDdeURL(videoUrl.value);

    if (!validateUrl()) {
        return
    }
    errorMessage.value = '';

    let urlVideo = ''
    let title = ''
    let duration = ''
    let thumbnail = ''
    let description = ''
    let data2 = {}

    if (isYoutubeUrl.value) {

        //obtener los datos del video desde la api de youtube
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${import.meta.env.VITE_API_KEY}&part=snippet&part=contentDetails`
        const response = await fetch(url)
        const data = await response.json();

        if (data.items.length === 0) {
            errorMessage.value = 'No se ha encontrado el video';
            return
        }

        //obtener los datos del video para enviarlos a la base de datos
        urlVideo = `https://www.youtube.com/watch?v=${data.items[0].id}`
        title = data.items[0].snippet.title
        duration = iso8601ToTime(data.items[0].contentDetails.duration)
        thumbnail = data.items[0].snippet.thumbnails.medium.url
        description = data.items[0].snippet.description

        //Guardar el video en la base de datos   
        const response2 = await fetch(`${import.meta.env.VITE_SERVER_API}/videos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: urlVideo,
                title,
                description,
                duration,
                thumbnail
            })
        })
        data2 = await response2.json();
        //si el resultado tiene la clave error, mostrar el mensaje de error
        if (data2.error) {
            notify(data2.error, 'error')
            return
        }
        notify("video agregado correctamente", 'success')
        emit('addVideo', videoUrl.value);
        videoUrl.value = '';

    } else {

        const url = `https://api.vimeo.com/videos/${videoId}`

        //pasar bearer token en la peticion
        fetch(url, {
            headers: {
                'Authorization': 'Bearer 2fe9ac3bc736b82b7697c95ea562c022'
            }
        }).then(resp => resp.json())
            .then(async (json) => {

                //obtener los datos del video para enviarlos a la base de datos
                videoUrl.value = json.link
                urlVideo = json.link
                title = json.name
                duration = segundosaATexto(json.duration)
                thumbnail = json.pictures.base_link
                description = json.description

                console.log('urlVideo', urlVideo)
                //Guardar el video en la base de datos   
                const response2 = await fetch(`${import.meta.env.VITE_SERVER_API}/videos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        url: urlVideo,
                        title,
                        description,
                        duration,
                        thumbnail
                    })
                })
                data2 = await response2.json();
                //si el resultado tiene la clave error, mostrar el mensaje de error
                if (data2.error) {
                    notify(data2.error, 'error')
                    return
                }

                notify("video agregado correctamente", 'success')
                emit('addVideo', videoUrl.value);
                videoUrl.value = '';
            })

            
            
    }

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
}

const iso8601ToTime = (isoString) => {
    if (isoString == 'P0D') { // es un video en directo;
        return 'live';
    }
    const durationRegex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = durationRegex.exec(isoString);
    console.log(matches)
    const hours = matches[1] ? parseInt(matches[1]) : 0;
    const minutes = matches[2] ? parseInt(matches[2]) : 0;
    const seconds = matches[3] ? parseInt(matches[3]) : 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};


const segundosaATexto = seconds => {
    let hour = Math.floor(seconds / 3600);
    hour = (hour < 10) ? '0' + hour : hour;
    let minute = Math.floor((seconds / 60) % 60);
    minute = (minute < 10) ? '0' + minute : minute;
    let second = seconds % 60;
    second = (second < 10) ? '0' + second : second;
    return hour + ':' + minute + ':' + second;
}


function obtenerIDdeURL(url) {
    let videoId;
    try {
        if (url.includes('youtu')) {

            if (url.includes('youtu.be')) {
                videoId = url.split('/').pop();
            } else if (url.includes('youtube.com') && !url.includes('short')) {
                var params = new URL(url).searchParams;
                videoId = params.get('v');
            } else if (url.includes('shorts')) {
                videoId = url.split('/').pop();
            }
        } else {
            if (url.includes('vimeo.com')) {
                videoId = url.split('/').pop();
            }
            isYoutubeUrl.value = false
        }
        return videoId;
    } catch (error) {
        console.log(error)
    }

}

</script>

<style>
.buscador {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

input {
    padding: 0.8rem;
    border-radius: 0.25rem 0 0 0.25rem;
    background-color: white !important;
    border: 1px solid #c6c6c6;
    font-size: 1rem;
    color: black;
    padding-left: 1rem;
    width: 100%;
}

.boton-agregar {
    padding: 0.8rem 5rem 0.8rem 5rem;
    border-radius: 0 0.5rem 0.5rem 0;
    border: 1px solid #136ae4;
    background-color: #136ae4;
    font-size: 1rem;
    color: white;
    box-shadow: 0 0.1rem 0.1rem rgba(0, 0, 0, 0.2);
    width: auto;
}

.error-message {
    color: red;
    margin-top: 0.5rem;
}
</style>
