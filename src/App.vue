<template>
  <div class="contenedor">
    <VideoInput @addVideo="addVideo" />
    <div v-if="isLoading">Cargando videos...</div>
    <VideoList v-else :videos="videos" />
  </div>
</template>

<script setup>
import VideoList from './components/VideoList.vue';
import VideoInput from './components/VideoInput.vue';
import { ref, onMounted } from 'vue';


const videos = ref([]);
const isLoading = ref(true);

async function getMyVideos() {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_API}/videos`);
    
    const data = await response.json();
    videos.value = data;
    isLoading.value = false;
  } catch (error) {
    console.error('Error al obtener los videos:', error);
    isLoading.value = false; // Asegurarse de que isLoading se establezca en false incluso en caso de error

  }
}


onMounted(getMyVideos);

const addVideo = (videoUrl) => {
  getMyVideos()
}

</script>

<style>
/* el contenedor debe res responsivo en pantallas grandes debe usar maximo el 80% de la pantallay en pantallas pequeñas debe usar el 100% */
.contenedor {
  min-width: 100%;
}


</style>
