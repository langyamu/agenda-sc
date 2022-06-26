import { defineStore } from 'pinia';
export const useCalendarStore = defineStore('calendar', {
    state() {
        return {
            loading: false,
        };
    },
});
