import { createApp } from 'vue'
import App from './App.vue'

import './theme/index.css'
import './theme/core.css';

import store from './store';

createApp(App).use(store).mount('#app')
