<script setup lang="ts">
import { IQueryRes } from '@/apis';
import { useSettingStore } from '@/store';
import { storeToRefs } from 'pinia';
const props = defineProps<{
    dayData: IQueryRes[] | [];
}>();

let { model } = storeToRefs(useSettingStore());
const itemCount = computed(() => props.dayData.length);

function onClickEventItem(e: Event, item: IQueryRes) {
    e.stopPropagation();

    ElMessageBox.confirm(`确认跳转到“${item.fcontent}”?`, '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            ElMessage({
                type: 'success',
                message: `跳转到“${item.fcontent}”`,
            });
            window.location.href = `siyuan://blocks/${item.id}`;
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消跳转',
            });
        });
}

function retItemBgColor(item: IQueryRes) {
    if (model.value === 'Todo') {
        return item.markdown.startsWith('* [X]') ? '#67C23A' : '#F56C6C';
    } else {
        return '#409eff';
    }
}
</script>
<template>
    <div v-if="itemCount > 0" class="date-cell-list-container">
        <ul class="date-cell-list">
            <li
                v-for="item in dayData"
                :key="item.id"
                class="date-cell-list-item"
                :style="{
                    backgroundColor: retItemBgColor(item),
                }"
                @click="onClickEventItem($event, item)"
            >
                {{ item.fcontent }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
.date-cell-list-container {
    font-size: 12px;
    height: auto;
}

.date-cell-list {
    padding: 0;
}

.date-cell-list-item,
.date-cell-list-title {
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #fff;
    padding: 8px;
    border-radius: 3px;
    border: 1px solid #fff;
}
</style>
