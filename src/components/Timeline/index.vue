<script setup lang="ts">
import { getDoc } from '@/apis';
import { useAppStore } from '@/store';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
const { curMonthData } = storeToRefs(useAppStore());

let index = 0;
const monthTimelineData = reactive<
    Array<{
        id: string;
        content: string;
        created: string;
    }>
>([]);

async function load() {
    const [error, res] = await getDoc(curMonthData.value[index].id);

    if (error) return error;

    monthTimelineData.push({
        id: curMonthData.value[index].id,
        content: res.data.content,
        created: curMonthData.value[index].created,
    });

    index++;
}
</script>
<template>
    <el-scrollbar height="80vh">
        <el-timeline v-infinite-scroll="load">
            <el-timeline-item
                v-for="block in monthTimelineData"
                :key="block.id"
                :timestamp="dayjs(block.created).format('YYYY/MM/DD')"
                placement="top"
                :infinite-scroll-distance="50"
            >
                <el-collapse>
                    <el-collapse-item>
                        <el-card v-html="block.content"> </el-card>
                    </el-collapse-item>
                </el-collapse>
            </el-timeline-item>
        </el-timeline>
    </el-scrollbar>
</template>
<style scoped></style>
