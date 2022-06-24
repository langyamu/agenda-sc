<script setup lang="ts">
import { toReject } from '@/utils';
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';
import { useSettingStore } from './store';

const settingStore = useSettingStore();

const { curNotebookIdList, notebookConfList, model, loading, limit } =
    storeToRefs(settingStore);

async function onSwitchNotebook(notebookIdList: string[]) {
    loading.value = true;
    if (notebookIdList.length === 0) {
        curNotebookIdList.value = notebookConfList.value
            .filter((notebook) => notebook.conf.dailyNoteSavePath !== '')
            .map((notebook) => notebook.box);
        loading.value = false;
        return ElMessage.error(`请选择笔记本！`);
    }
    const [error] = await settingStore.switchNotebook(notebookIdList);
    if (error) return (loading.value = false);

    const notebookNameList = notebookConfList.value
        .map((item) => (notebookIdList.includes(item.box) ? item.name : ''))
        .filter((item) => item !== '');

    loading.value = false;
    ElMessage.success(`切换笔记本为：${notebookNameList.join(' , ')}`);
}

async function onChangeModel(model: 'Todo' | 'Journal' | 'Doc') {
    loading.value = true;

    const [error] = await settingStore.changeMode(model);
    if (error) {
        loading.value = false;
        return toReject(error);
    }
    let message = '';
    switch (true) {
        case model === 'Todo':
            message = '事项';
            break;
        case model === 'Journal':
            message = '日记';
            break;
        case model === 'Doc':
            message = '文档';
            break;
    }

    loading.value = false;
    ElMessage.success(`切换为显示“${message}”`);
}
</script>
<template>
    <el-form v-loading="loading" label-position="top">
        <el-form-item label="显示模式">
            <el-radio-group v-model="model" @change="onChangeModel">
                <el-radio label="Journal" border>日记</el-radio>
                <el-radio label="Todo" border>事项</el-radio>
                <el-radio label="Doc" border>文档</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="笔记本">
            <el-select
                v-model="curNotebookIdList"
                multiple
                collapse-tags
                collapse-tags-tooltip
                @change="onSwitchNotebook"
            >
                <el-option
                    v-for="item in notebookConfList"
                    :key="item.box"
                    :label="item.name"
                    :value="item.box"
                    :disabled="
                        item.conf.closed || item.conf.dailyNoteSavePath === ''
                    "
                >
                    <span> {{ item.name }}</span>
                    <el-tag
                        v-if="
                            item.conf.closed ||
                            item.conf.dailyNoteSavePath === ''
                        "
                        style="margin-left: 5px"
                        type="danger"
                        >未设置笔记本“日记存放路径”</el-tag
                    >
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="最大显示数量">
            <el-input-number v-model="limit" :min="1" />
        </el-form-item>
    </el-form>
</template>
<style scoped></style>
