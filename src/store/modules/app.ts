import { IQueryRes, querySQL } from '@/apis';
import { useSettingStore } from '@/components/Setting/store';
import { toReject, toResolve } from '@/utils';
import dayjs from 'dayjs';
import { ElLoading } from 'element-plus';
import { defineStore } from 'pinia';
export type { IAppState };
export { useAppStore };
interface IAppState {
    curMonthData: IQueryRes[];
    curCalValue: Date;
    curDayEventData: IQueryRes[];
}

const structureMap = {
    '/YYYY/YYYY-MM-DD': '2006/2006-01-02',
    '/YYYY/MM/YYYY-MM-DD': '2006/01/2006-01-02',
    '/YYYY/MM-DD': '2006/01-02',
    '/YYYY/MM/DD': '2006/01/02',
    '/YYYY/MM/YYYY.MM.DD': '2006/01/2006.01.02',
};

const useAppStore = defineStore('app', {
    state(): IAppState {
        return {
            curMonthData: [],
            curCalValue: new Date(),
            curDayEventData: [],
        };
    },
    getters: {
        model() {
            return useSettingStore().model;
        },
        curNotebookIdList() {
            return useSettingStore().curNotebookIdList;
        },
        notebookConfList() {
            return useSettingStore().notebookConfList;
        },
        limit() {
            return useSettingStore().limit;
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: window.localStorage,
            },
        ],
    },
    actions: {
        initStore: async function () {
            const loading = ElLoading.service({ fullscreen: true });

            const [error] = await this.setMonthData();
            if (error) {
                loading.close();
                return toReject(error);
            }
            loading.close();
            return toResolve(true);
        },

        setMonthData() {
            if (this.model === 'Todo') {
                return this.setMonthEventData();
            } else if (this.model === 'Journal') {
                return this.setMonthJournal();
            } else if (this.model === 'Doc') {
                return this.setMonthDailyDoc();
            }
            return toReject(new Error('模式不匹配'));
        },

        setMonthEventData: async function (date?: Date) {
            const day = dayjs(date || this.curCalValue).format('YYYYMM');

            const notebookIdWhere = this.curNotebookIdList
                .map((item) => `OR box = '${item}'`)
                .join(' ')
                .substr(2);

            // -- beginsql
            const sql = `
            SELECT
                *
            FROM
                blocks
            WHERE
                type = 'l'
                AND subtype = 't'
                AND created LIKE '${day}%'
                AND parent_id = root_id
                AND ( ${notebookIdWhere} )
            ORDER BY
                created DESC
            LIMIT
                ${this.limit}
            `;
            //-- endsql
            console.log('setMonthEventData:[sql]:', sql);
            const [error, res] = await querySQL(sql);
            if (error) return toReject(error);

            this.curMonthData = res.data;

            return toResolve(true);
        },
        setMonthJournal: async function (date?: Date) {
            const day = dayjs(date || this.curCalValue);
            const year = day.format('YYYY');
            const month = day.format('MM');
            let hpathWhere = '';

            const dailyNoteSavePathList = this.notebookConfList.map((item) => ({
                dailyNoteSavePath: item.conf.dailyNoteSavePath,
                notebookId: item.box,
            }));

            for (const {
                dailyNoteSavePath,
                notebookId,
            } of dailyNoteSavePathList) {
                if (dailyNoteSavePath === '') continue;

                const pathPrefix = matchDailyNotePathPrefix(dailyNoteSavePath);
                const pathStructure =
                    matchDailyNotePathStructure(dailyNoteSavePath);
                let hpath = '';
                switch (true) {
                    case pathStructure === '' || pathStructure === undefined:
                        continue;
                    case structureMap['/YYYY/YYYY-MM-DD'] === pathStructure:
                        hpath = `${pathPrefix}/${year}/${year}-${month}-__`;
                        break;
                    case structureMap['/YYYY/MM/YYYY-MM-DD'] === pathStructure:
                        hpath = `${pathPrefix}/${year}/${month}/__`;
                        break;
                    case structureMap['/YYYY/MM-DD'] === pathStructure:
                        hpath = `${pathPrefix}/${year}/${month}-__`;
                        break;
                    case structureMap['/YYYY/MM/DD'] === pathStructure:
                        hpath = `${pathPrefix}/${year}/${month}/__`;
                        break;
                    case structureMap['/YYYY/MM/YYYY.MM.DD'] === pathStructure:
                        hpath = `${pathPrefix}/${year}/${month}/${year}.${month}.__`;
                        break;
                }

                hpathWhere += `OR (hpath LIKE '${hpath}' AND type = 'd' AND box = '${notebookId}')`;
            }

            // -- beginsql
            const sql = `
                SELECT
                    *
                FROM
                     blocks
                WHERE
                   ${hpathWhere.substr(2)}
                ORDER BY
                        created
                LIMIT
                    ${this.limit}
                `;
            // -- endsql
            console.log('setMonthJournal:[sql]:', sql);
            const [error, res] = await querySQL(sql);

            if (error) return toReject(error);

            this.curMonthData = res.data;

            console.log('curMonthData::', this.curMonthData);
            return toResolve(true);
        },
        setMonthDailyDoc: async function (date?: Date) {
            const day = dayjs(date || this.curCalValue).format('YYYYMM');
            // -- beginsql
            const sql = `
                SELECT 
                    *
                FROM 
                    blocks
                WHERE
                    type = 'd'
                    AND created LIKE '${day}%'
                ORDER BY
                    created DESC
                LIMIT
                    ${this.limit}
            `;
            // -- endsql
            console.log('setMonthDailyDoc:[sql]:', sql);

            const [error, res] = await querySQL(sql);

            if (error) return toReject(error);

            this.curMonthData = res.data;

            console.log('setMonthDailyDoc:[curMonthData]:', this.curMonthData);
            return toResolve(true);
        },
    },
});

function matchDailyNotePathPrefix(path: string) {
    const prefix = `/${path
        .split('/')
        .filter(
            (item) =>
                !item.includes('{{') && !item.includes('}}') && item !== '',
        )
        .join('/')}`;
    return prefix === '/' ? '' : prefix;
}
function matchDailyNotePathStructure(path: string): string | undefined {
    return path
        .match(/({{[^{}]*\"([^\"]+)\"[{}]*}})/g)
        ?.join('/')
        .replaceAll(/({{[^{}]*\"([^\"]+)\"[{}]*}})/g, '$2');
}
