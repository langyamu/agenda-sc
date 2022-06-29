import { getWidgetDom } from '@/apis';
import to from 'await-to-js';
import { AxiosRequestConfig } from 'axios';
import service from './axios';
export * from './axios';
export { isDev, request, toLine, toReject, toResolve, getRuntimeEnv, chunkArr };
export type { IResponseType };

interface IResponseType<P = object | Array<object> | null> {
    code?: number;
    // status: number;
    msg: string;
    data: P;
}

const isDev = () => import.meta.env.MODE === 'development';

function request<T, U = Error>(
    config: AxiosRequestConfig,
): Promise<[U, undefined] | [null, IResponseType<T>]> {
    return to<IResponseType<T>, U>(service(config));
}

const toLine = (name: string) => name.replace(/([A-Z])/g, '-$1').toLowerCase();

function toReject<U>(error: U): Promise<[U, undefined]> {
    return Promise.reject([error, undefined]);
}
function toResolve<T>(res: T): Promise<[null, T]> {
    return Promise.resolve([null, res]);
}

function getRuntimeEnv(): 'widget' | 'browser' {
    const widgetDom = getWidgetDom();

    if (widgetDom) {
        return 'widget';
    } else {
        return 'browser';
    }
}

// 根据指定个数分割数组
function chunkArr(arr: any[], size: number) {
    //判断如果不是数组(就没有length)，或者size没有传值，size小于1，就返回空数组
    if (!arr.length || !size || size < 1) return [];
    let start: number, end: number;
    const result: any[] = [];

    for (let i = 0; i < Math.ceil(arr.length / size); i++) {
        start = i * size;
        end = start + size;
        result.push(arr.slice(start, end));
    }
    return result;
}
