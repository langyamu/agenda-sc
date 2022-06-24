import { Component } from 'vue';
import 'vue-router';

declare module 'vue-router' {
    interface RouteMeta {
        title?: string;
        icon?: Component;
    }
}
