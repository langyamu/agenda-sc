// import { auth_token } from '@/config';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import { ref, watch } from 'vue';
import { isDev } from '.';
const service = axios.create(); // Request interceptors
const cancel = ref(false);

const stop = watch(cancel, (val) => {
    if (val) {
        ElMessage.error('请先在该环境下登录思源！');
        window.open(window.location.origin);
        stop();
    }
});

service.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
        // 开发环境下 验证 token
        if (isDev() && config['headers'] && !config.headers['Authorization']) {
            config.headers['Authorization'] = import.meta.env.VITE_AUTH_TOKEN;
        }
        // do something
        return config;
    },
    (error: any) => {
        Promise.reject(error);
    },
); // Response interceptors

service.interceptors.response.use(
    async (response: AxiosResponse) => {
        const res = response.data;
        const url = response.config.url;
        const code = res.code || (url === '/api/file/getFile' && !res ? -1 : 0);

        // console.log('response::', response);

        if (code !== 0) {
            ElMessage.error(res.msg);
            return Promise.reject(new Error(res.msg));
        }

        if (typeof res === 'string' && res.includes('SiYuan Auth')) {
            console.error('302');
            cancel.value = true;
            return Promise.reject(new Error('302'));
        }
        // do something
        return res;
    },
    (error: any) => {
        ElMessage.error(error || error?.msg);
        // do something
        return Promise.reject(error);
    },
);

export default service;
