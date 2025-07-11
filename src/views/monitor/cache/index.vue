<template>
  <a-card size="small" :bordered="false" :hoverable="true" style="height: 100%">

    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :refresh="queryList" />
      </div>
    </a-row>

    <a-card title="基本信息" style="margin-bottom: 15px" size="small">
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="版本号码">{{ cacheData.redis_version }}</a-descriptions-item>
        <a-descriptions-item label="运行模式">{{ cacheData.redis_mode === 'standalone' ? '单机' : '集群'
          }}</a-descriptions-item>
        <a-descriptions-item label="操作系统">{{ cacheData.os }}</a-descriptions-item>
        <a-descriptions-item label="架构位数">{{ cacheData.arch_bits }}位</a-descriptions-item>
        <a-descriptions-item label="端口号码">{{ cacheData.tcp_port }}</a-descriptions-item>
        <a-descriptions-item label="进程ID">{{ cacheData.process_id }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card title="运行时间" style="margin-bottom: 15px" size="small">
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="运行时间">{{ cacheData.uptime_in_seconds }}秒</a-descriptions-item>
        <a-descriptions-item label="运行时间">{{ cacheData.uptime_in_days }}天</a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card title="内存使用" style="margin-bottom: 15px" size="small">
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="内存总量">{{ cacheData.used_memory_human }}</a-descriptions-item>
        <a-descriptions-item label="物理内存">{{ cacheData.used_memory_rss_human }}</a-descriptions-item>
        <a-descriptions-item label="最大内存">{{ cacheData.used_memory_peak_human }}</a-descriptions-item>
        <a-descriptions-item label="碎片比例">{{ cacheData.mem_fragmentation_ratio }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card title="性能" style="margin-bottom: 15px" size="small">
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="总命令数">{{ cacheData.total_commands_processed }}</a-descriptions-item>
        <a-descriptions-item label="总连接数">{{ cacheData.total_connections_received }}</a-descriptions-item>
        <a-descriptions-item label="当前连接">{{ cacheData.connected_clients }}</a-descriptions-item>
        <a-descriptions-item label="阻塞数量">{{ cacheData.blocked_clients }}</a-descriptions-item>
        <a-descriptions-item label="输入带宽">{{ cacheData.instantaneous_input_kbps }}</a-descriptions-item>
        <a-descriptions-item label="输出带宽">{{ cacheData.instantaneous_output_kbps }}</a-descriptions-item>
        <a-descriptions-item label="每秒操作">{{ cacheData.instantaneous_ops_per_sec }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card title="CPU" style="margin-bottom: 15px" size="small">
      <a-descriptions :column="2" size="small">
        <a-descriptions-item label="用户空间">{{ cacheData.used_cpu_user }}M</a-descriptions-item>
        <a-descriptions-item label="系统空间">{{ cacheData.used_cpu_sys }}M</a-descriptions-item>
      </a-descriptions>
    </a-card>
  </a-card>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { cacheApi } from '/@/api/monitor/cache-api';
import { TableOperator, TABLE_ID } from '/@/components/table-operator';

const route = useRoute();

const props = defineProps({
  newsType: {
    type: Number,
  },
});

const cacheData = ref({});

onMounted(queryList);

// 查询详情
async function queryList() {
  SmartLoading.show();
  const result = await cacheApi.queryList();
  cacheData.value = result.data;
}
</script>

<style lang="less" scoped>
:deep(.ant-descriptions-item-content) {
  flex: 1;
  overflow: hidden;
}
</style>