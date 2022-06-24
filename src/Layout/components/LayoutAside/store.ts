import { defineStore } from 'pinia';

export { useLayoutAsideStore };

const useLayoutAsideStore = defineStore('LayoutAsideStore', {
    state() {
        return {
            isShow: true,
            isCollapse: false,
        };
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: window.localStorage,
            },
        ],
    },
});
