<template>
  <div class="card-container">
    <a-card size="small">
      <template #title>
        <div class="title">
          <span v-if="props.title" class="smart-margin-left10">{{ props.title }} </span>
        </div>
      </template>
      <template #extra v-if="props.refresh">
        <a-tooltip title="刷新">
          <a-button type="text" @click="props.refresh" size="small">
            <template #icon><redo-outlined /></template>
          </a-button>
        </a-tooltip>
      </template>
      <slot></slot>
    </a-card>
  </div>
</template>
<script setup>
let props = defineProps({
  title: String,
  refresh: Function,
});
</script>
<style lang="less" scoped>
.card-container {
  background-color: #fff;
  height: 100%;

  .title {
    display: flex;
    align-items: center;

    &::before {
      content: '';
      position: absolute;
      top: 3px;
      left: 0;
      width: 3px;
      height: 30px;
    }
  }
}
</style>
