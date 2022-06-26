import { useCalendarStore } from '@/components/Calendar/store';
import { useSettingStore } from '@/components/Setting/store';
import { toReject } from '@/utils';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist';
import { useAppStore } from './modules/app';
export { initStore, useAppStore, useCalendarStore, useSettingStore };

const store = createPinia();

store.use(piniaPersist);

async function initStore(app: any) {
    app.use(store);

    const [error] = await useSettingStore().initStore();
    if (error) return toReject(error);

    return await useAppStore().initStore();
}
export default store;
