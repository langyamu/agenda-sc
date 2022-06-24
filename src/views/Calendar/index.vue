<script setup lang="ts">
import Calendar from '@/components/Calendar/index.vue';
import Drawer from '@/components/Drawer/index.vue';
</script>

<template>
    <el-container direction="vertical">
        <el-main>
            <Calendar />
            <Drawer />
        </el-main>
    </el-container>
</template>

<style scoped></style>
