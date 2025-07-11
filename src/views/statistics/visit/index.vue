<template>
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="查询时间" class="smart-query-form-item">
        <a-date-picker valueFormat="YYYY-MM" picker="month" v-model:value="queryForm.beginTime" style="width: 150px" />
      </a-form-item>
      <a-form-item class="smart-query-form-item smart-margin-left10">
        <a-button-group>
          <a-button type="primary" @click="queryList">
            <template #icon>
              <SearchOutlined />
            </template>
            查询
          </a-button>
        </a-button-group>
      </a-form-item>
    </a-row>
  </a-form>
  <!---------- 查询表单form end ----------->

  <a-card size="small" :bordered="false" :hoverable="true">
    <div ref="chartRef" class="category-main" style="width: 1200px; height: 400px"></div>
  </a-card>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, reactive, ref } from 'vue';
import { visitApi } from '/@/api/statistics/visit-api';
import { SearchOutlined } from '@ant-design/icons-vue';

const queryFormState = {
  beginTime: '2024-01',
};
const queryForm = reactive({ ...queryFormState });

async function queryList() {
  let queryResult = await visitApi.userVisit(queryForm);
  seriesData.value = queryResult.data.map((item) => ({
    name: item.label,
    value: item.value,
  }));
  xAxisData.value = queryResult.data.map((item) => item.label);
  updateChart();
}

onMounted(() => {
  // 初始化
  const now = new Date()
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  queryForm.beginTime = year + '-' + month;
  // 初始化
  queryList();
  // 初始化
  initChart();
});

const chartRef = ref(null);
const xAxisData = ref([]);
const seriesData = ref([]);

let chartInstance = null;

function initChart() {
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value);
  }
  setChartOptions();
}

function setChartOptions() {
  chartInstance.setOption({
     tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    xAxis: {
      type: 'category',
      data: xAxisData.value,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: seriesData.value,
        type: 'line',
      },
    ],
  });
}

function updateChart() {
  if (chartInstance) {
    setChartOptions();
  }
}
</script>
