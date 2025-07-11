<template>
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="充值类型" class="smart-query-form-item">
        <a-select style="width: 150px" v-model:value="queryForm.timeUnit"
          :onchange="handleTimeUnitChange(queryForm.timeUnit)" placeholder="请选择">
          <a-select-option value="month">按月统计</a-select-option>
          <a-select-option value="year">按年统计</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="查询时间" class="smart-query-form-item">
        <a-date-picker :valueFormat='valueFormat' :picker="picker" v-model:value="queryForm.beginTime"
          style="width: 150px" />
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
import { onMounted, reactive, ref, computed } from 'vue';
import { trendApi } from '/@/api/statistics/trend-api';
import { SearchOutlined } from '@ant-design/icons-vue';

const queryFormState = {
  beginTime: '2024-08',
  timeUnit: 'month',
};
const queryForm = reactive({ ...queryFormState });

async function queryList() {
  try {
    let queryResult = await trendApi.userTrend(queryForm);
    seriesData.value = queryResult.data.map((item) => ({
      name: item.label,
      value: item.value,
    }));
    xAxisData.value = queryResult.data.map((item) => item.label);
    updateChart();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const picker = ref('year');
const valueFormat = ref('YYYY');

function handleTimeUnitChange(value) {
  picker.value = value === 'year' ? 'year' : 'month';
  valueFormat.value = value === 'year' ? 'YYYY' : 'YYYY-MM';
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
