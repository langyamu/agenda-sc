<!-- Layout.vue -->
<script setup lang="ts">
import LayoutAside from './components/LayoutAside/index.vue';
import LayoutHeader from './components/LayoutHeader/index.vue';
</script>

<template>
    <el-container>
        <LayoutAside />
        <el-container direction="vertical">
            <LayoutHeader />
            <el-main>
                <router-view> </router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<style scoped></style>
