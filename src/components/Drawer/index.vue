<script setup lang="ts">
import { IQueryRes } from '@/apis';
import { useAppSize } from '@/hooks/windowSize';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { useDrawerStore } from './store';

const drawerStore = useDrawerStore();
const { width, height } = useAppSize();
const { isShow, curData, title, model } = storeToRefs(drawerStore);

const activeNames = computed(() =>
    curData.value.length > 1 ? [] : [curData.value[0].id],
);

const drawerSize = computed(() => (width.value < 1024 ? '100vw' : '50vw'));

const titleTooltipPlacement = computed(() =>
    width.value < 1024 ? 'top' : 'left',
);

function retItemColor(block: IQueryRes) {
    if (model.value === 'Todo') {
        return block.markdown.startsWith('* [X]') ? '#67C23A' : '#F56C6C';
    } else {
        return '#409eff';
    }
}

function onClickJumpToNotes(block: IQueryRes) {
    ElMessageBox.confirm(`确认跳转到“${block.hpath}”?`, '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            ElMessage({
                type: 'success',
                message: `跳转到“${block.hpath}”`,
            });
            window.location.href = `siyuan://blocks/${block.id}`;
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消跳转',
            });
        });
}
</script>
<template>
    <el-drawer
        v-model="isShow"
        direction="rtl"
        :size="drawerSize"
        :before-close="
            () => {
                isShow = false;
            }
        "
    >
        <template #header="{ titleId, titleClass }">
            <h3 :id="titleId" :class="titleClass">
                {{ title }}
            </h3>
        </template>
        <el-scrollbar>
            <div class="info-list-container">
                <el-collapse v-model="activeNames">
                    <el-collapse-item
                        v-for="block in curData"
                        :key="block.id"
                        :name="block.id"
                    >
                        <template #title>
                            <div
                                class="info-list-item-title"
                                :style="{
                                    'border-left': `5px solid ${retItemColor(
                                        block,
                                    )}`,
                                    'padding-left': '10px',
                                }"
                            >
                                <el-tooltip
                                    :content="block.fcontent"
                                    effect="dark"
                                    :placement="titleTooltipPlacement"
                                >
                                    <div
                                        :style="{
                                            display: 'inline-flex',
                                            overflow: 'hidden',
                                            'white-space': 'nowrap',
                                            width: 'calc(100% -36px -15px)',
                                        }"
                                    >
                                        {{ block.fcontent }}
                                    </div>
                                </el-tooltip>
                                <el-tooltip
                                    :content="`跳转到“${block.hpath}”`"
                                    effect="dark"
                                    placement="left"
                                >
                                    <el-button
                                        link
                                        type="primary"
                                        style="padding: 0 10px"
                                        @click="onClickJumpToNotes(block)"
                                        ><el-icon> <i-ep-link /></el-icon
                                    ></el-button>
                                </el-tooltip>
                            </div>
                        </template>

                        <el-descriptions
                            class="info-list-item-desc"
                            :column="1"
                        >
                            <el-descriptions-item label-align="center">
                                <template #label>
                                    <div class="info-list-item-desc-item-label">
                                        <el-icon><i-ep-timer /></el-icon>
                                        <span> 创建时间</span>
                                    </div>
                                </template>
                                {{
                                    dayjs(block.created).format(
                                        'YYYY-MM-DD HH:mm:ss',
                                    )
                                }}</el-descriptions-item
                            >
                            <el-descriptions-item label-align="center">
                                <template #label>
                                    <div class="info-list-item-desc-item-label">
                                        <el-icon><i-ep-timer /></el-icon>
                                        <span> 更新时间</span>
                                    </div>
                                </template>
                                {{
                                    dayjs(block.created).format(
                                        'YYYY-MM-DD HH:mm:ss',
                                    )
                                }}</el-descriptions-item
                            >
                        </el-descriptions>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-scrollbar>
    </el-drawer>
</template>

<style scoped>
.info-list-container {
    height: auto;
}

.info-list-item {
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 8px;
    border-radius: 3px;
}

.info-list-item-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 3px 0 0 3px;
}

.info-list-item-desc {
    margin-top: 20px;
    margin-left: 5px;
}

.info-list-item-desc-item-label {
    display: inline-flex;
    align-items: center;
    position: relative;
    top: 1px;
}
</style>

<style>
.el-drawer__header {
    margin-bottom: 20px;
}

.el-collapse-item__arrow {
    margin-left: 10px;
}
</style>
