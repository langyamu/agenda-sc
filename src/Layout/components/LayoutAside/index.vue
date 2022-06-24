<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useLayoutAsideStore } from './store';
const router = useRouter();
const route = useRoute(); // 当前 路由
const routes = router.getRoutes().filter((route) => route.meta?.title);
console.log('routes::', routes);
console.log('route::', route);
const { isShow, isCollapse } = storeToRefs(useLayoutAsideStore());
</script>
<template>
    <el-aside v-show="isShow" width="auto">
        <div style="text-align: center">
            <el-switch v-model="isCollapse" />
        </div>
        <el-menu :default-active="route.path" router :collapse="!isCollapse">
            <el-menu-item
                v-for="route in routes"
                :key="route.name"
                :index="route.path"
            >
                <el-icon>
                    <component :is="route.meta.icon"></component>
                </el-icon>
                <template #title>{{ route.meta.title }}</template>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>

<style scoped></style>
