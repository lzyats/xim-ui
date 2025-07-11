<!--
  * 首页
-->
<template>
  <div class="user-header">
    <a-page-header :title="welcome + dayInfo"></a-page-header>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { Solar, Lunar } from 'lunar-javascript';
import _ from 'lodash';

// 欢迎语
const welcome = computed(() => {
  let sentence = '';
  let now = new Date().getHours();
  if (now > 0 && now <= 6) {
    sentence = '午夜好，';
  } else if (now > 6 && now <= 11) {
    sentence = '早上好，';
  } else if (now > 11 && now <= 14) {
    sentence = '中午好，';
  } else if (now > 14 && now <= 18) {
    sentence = '下午好，';
  } else {
    sentence = '晚上好，';
  }
  return sentence;
});

//日期、节日、节气
const dayInfo = computed(() => {
  //阳历
  let solar = Solar.fromDate(new Date());
  let day = solar.toString();
  let week = solar.getWeekInChinese();
  //阴历
  let lunar = Lunar.fromDate(new Date());
  let lunarMonth = lunar.getMonthInChinese();
  let lunarDay = lunar.getDayInChinese();
  return `现在是 ${day} 星期${week} 农历${lunarMonth}月${lunarDay}`;
});

</script>
<style scoped lang="less">
.user-header {
  width: 100%;
  background-color: #fff;
  margin-bottom: 10px;
}
</style>
