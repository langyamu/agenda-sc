<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useLayoutAsideStore } from '../LayoutAside/store';
import SettingsDialog from './SettingDialog.vue';

const { isShow: isShowLayoutAside } = storeToRefs(useLayoutAsideStore());
const isShowSettingDialog = ref(false);

function openBrowser() {
    window.open(window.location.href);
}
function reloadWindow() {
    // console.log(window.location.href);
    window.location.reload();
}
</script>
<template>
    <el-header class="layout-header">
        <div class="layout-header-item">
            <el-button link @click="isShowLayoutAside = !isShowLayoutAside">
                <el-icon :size="20"
                    ><i-ep-expand
                        :style="{
                            transform: isShowLayoutAside
                                ? 'rotate(180deg)'
                                : 'rotate(0deg)',
                        }"
                /></el-icon>
            </el-button>
        </div>
        <div class="layout-header-item">
            <el-tooltip content="重新加载" effect="dark">
                <el-button link @click="reloadWindow">
                    <el-icon :size="20"><i-ep-refresh /></el-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip content="打开“设置”" effect="dark">
                <el-button
                    link
                    @click="isShowSettingDialog = !isShowSettingDialog"
                >
                    <el-icon :size="20"><i-ep-setting /></el-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip content="浏览器打开" effect="dark">
                <el-button link @click="openBrowser">
                    <el-icon :size="20"><i-ep-top-right /></el-icon>
                </el-button>
            </el-tooltip>
        </div>

        <teleport to="body">
            <SettingsDialog v-model="isShowSettingDialog" />
        </teleport>
    </el-header>
</template>

<style scoped>
.layout-header {
    line-height: var(--el-header-height);
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
.layout-header-item {
    display: inline-flex;
}
</style>
