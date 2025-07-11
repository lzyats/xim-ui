<template>
  <default-home-card title="用户日活" :refresh="queryData">
    <div class="echarts-box">
      <div class="category-main" ref="chartRef"></div>
    </div>
  </default-home-card>
</template>

<script setup>
import DefaultHomeCard from '/@/views/sys/home/components/default-home-card.vue';
import * as echarts from 'echarts';
import { onMounted, ref, computed } from 'vue';
import { homeApi } from '/@/api/sys/home-api';

// 初始化查询参数
const queryForm = {
  beginTime: '2024-08', // 示例查询时间
  timeUnit: 'month', // 默认按月统计
};
// 使用 ref 获取当前日期
const currentDate = ref(new Date());

// 使用 computed 属性格式化当前年月
const formattedCurrentYearMonth = computed(() => {
  // 格式化月份，不足两位前面补零
  const formattedMonth = currentDate.value.getMonth() + 1;
  const formattedMonthStr = formattedMonth.toString().padStart(2, '0');
  return `${currentDate.value.getFullYear()}-${formattedMonthStr}`;
});
// 数据绑定
const xAxisData = ref([]);
const seriesData = ref([]);

const chartRef = ref();

// 查询数据函数
async function queryData() {
  try {
    queryForm.beginTime = formattedCurrentYearMonth.value;
    let queryResult = await homeApi.userVisit(queryForm);
    seriesData.value = queryResult.data.map((item) => ({
      name: item.label,
      value: item.value,
    }));
    xAxisData.value = queryResult.data.map((item) => item.label);
    initChart();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// 图表初始化函数
function initChart() {
  const option = {
    xAxis: {
      type: 'category',
      data: xAxisData.value,
    },
    yAxis: {
      type: 'value',
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    series: [{
      name: '用户日活',
      type: 'line',
      data: seriesData.value,
    }],
  };

  // 获取图表容器
  const chartDom = chartRef.value;

  // 初始化或更新图表
  if (chartInstance) {
    chartInstance.dispose();
  }
  chartInstance = echarts.init(chartDom);
  chartInstance.setOption(option);
}

// 生命周期钩子
onMounted(() => {
  queryData(); // 组件挂载完成后查询数据并初始化图表
});

// 图表实例
let chartInstance = null;
</script>

<style lang="less" scoped>
.echarts-box {
  display: flex;
  align-items: center;
  justify-content: center;

  .category-main {
    width: 800px;
    height: 250px;
    background: #fff;
  }
}
</style>