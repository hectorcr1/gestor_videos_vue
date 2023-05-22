import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Toastify from 'vue3-toastify';

createApp(App).use(Toastify).mount('#app')
