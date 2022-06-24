import { useSettingStore } from '@/components/Setting/store';
import { toReject, toResolve } from '@/utils';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist';
export { initStore };

const store = createPinia();

store.use(piniaPersist);

async function initStore(app: any) {
    app.use(store);

    const [error] = await useSettingStore().initStore();
    if (error) return toReject(error);

    return toResolve(true);
}
export default store;
