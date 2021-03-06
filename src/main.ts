import App from '@/App.vue';
import { initRouter } from '@/router';
import { initStore } from '@/store';
import 'element-plus/es/components/message-box/style/css';
import 'element-plus/es/components/message/style/css';
import { createApp } from 'vue';

async function bootstrap() {
    const app = createApp(App);

    initRouter(app);

    const [error] = await initStore(app);

    app.mount('#app');

    if (error) throw error;
}

bootstrap();
