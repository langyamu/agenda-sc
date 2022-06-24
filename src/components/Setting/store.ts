import { getNotebookConfList, IGetNotebookConfRes, lsNotebooks } from '@/apis';
import { toReject, toResolve } from '@/utils';
import { defineStore } from 'pinia';
import { useCalendarStore } from '../Calendar/store';

export { useSettingStore };

interface ISettingState {
    model: 'Todo' | 'Journal' | 'Doc';
    curNotebookIdList: string[];
    notebookConfList: IGetNotebookConfRes[];
    loading: boolean;
    limit: number;
}

const useSettingStore = defineStore('setting', {
    state(): ISettingState {
        return {
            model: 'Journal',
            curNotebookIdList: [],
            notebookConfList: [],
            loading: true,
            limit: 50,
        };
    },
    getters: {},
    persist: {
        enabled: true,
        strategies: [
            {
                storage: window.localStorage,
            },
        ],
    },
    actions: {
        async initStore() {
            const [error, res] = await lsNotebooks();

            if (error) return toReject(error);
            const notebooks = res.data.notebooks;

            let notebookConfList = await getNotebookConfList(
                notebooks.map((notebook) => notebook.id),
            );
            notebookConfList = notebookConfList.filter((item) => item != null);

            this.notebookConfList = notebookConfList;
            this.curNotebookIdList = (() => {
                // 从最新的 notebookIdList 中过滤，如果 length 为 0 则返回 fullNotebookIdList
                const notebookList = this.notebookConfList
                    .filter(
                        (notebook) => notebook.conf.dailyNoteSavePath !== '',
                    )
                    .map((notebook) => notebook.box)
                    .filter((notebookId) =>
                        this.curNotebookIdList.includes(notebookId),
                    );

                return notebookList.length > 0
                    ? notebookList
                    : this.notebookConfList.map((notebook) => notebook.box);
            })();

            this.loading = false;
            return toResolve(true);
        },
        async switchNotebook(notebookIdList: string[]) {
            this.curNotebookIdList = notebookIdList;
            return await useCalendarStore().initStore();
        },
        async changeMode(model: 'Todo' | 'Journal' | 'Doc') {
            this.model = model;
            return await useCalendarStore().initStore();
        },
    },
});
