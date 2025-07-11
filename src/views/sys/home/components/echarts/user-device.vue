<template>
  <default-home-card title="用户设备占比" :refresh="queryData">
    <div class="echarts-box">
      <div class="category-main" ref="chartRef"></div>
    </div>
  </default-home-card>
</template>

<script setup>
import DefaultHomeCard from '/@/views/sys/home/components/default-home-card.vue';
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';
import { homeApi } from '/@/api/sys/home-api';

// 数据绑定
const xAxisData = ref([]);
const seriesData = ref([]);

const chartRef = ref();

// 查询数据函数
async function queryData() {
  try {
    let queryResult = await homeApi.userDevice();
    seriesData.value = queryResult.data.map((item) => ({
      name: item.label,
      value: item.value,
    }));
    initChart();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// 图表初始化函数
function initChart() {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',

    },
    series: [
      {
        name: '用户设备',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: seriesData.value
      }
    ]
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