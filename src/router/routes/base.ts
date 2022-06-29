import { RouteRecordRaw } from 'vue-router';
import IEpCalendar from '~icons/ep/calendar';
import IEpSetting from '~icons/ep/setting';
import IEpTickets from '~icons/ep/tickets';

const baseRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/calendar',
    },
    {
        path: '/calendar',
        name: 'Calendar',
        component: () => import('@/views/Calendar/index.vue'),
        meta: {
            title: '日历',
            icon: IEpCalendar,
        },
    },
    {
        path: '/timeline',
        name: 'Timeline',
        component: () => import('@/views/Timeline/index.vue'),
        meta: {
            title: '时间线',
            icon: IEpTickets,
        },
    },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/views/Setting/index.vue'),
        meta: {
            title: '设置',
            icon: IEpSetting,
        },
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: '/' },
];

export default baseRoutes;
