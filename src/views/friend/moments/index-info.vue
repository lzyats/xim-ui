<template>
  <a-card title="朋友圈信息管理">
    <a-form class="ant-advanced-search-form" :model="friendMoments" autocomplete="off" ref="updateFormRef"
      :label-col="{ span: 5 }">
      <a-row :gutter="24">
        <a-col :span="30">
          <a-form-item label="信息可见" name="visibility" :rules="[{ required: true, message: '不能为空' }]"
            >
            <a-radio-group v-model:value="friendMoments.visibility">
              <a-radio :value="0" >完全公开</a-radio>
              <a-radio :value="1">好友可见</a-radio>
              <a-radio :value="2">自己可见</a-radio>
            </a-radio-group>
          </a-form-item>

        </a-col>

      </a-row>
      <a-row :gutter="24">
        <a-col :span="10">
          
          <a-form-item label="发布内容" name="content" :rules="[{ required: true, message: '发布内容不能为空' }]" help="发布的内容不能超过300个字">
            <a-textarea v-model:value="friendMoments.content" :rows="4" :maxlength="300" :showCount="true" />
          </a-form-item>
          <a-form-item label="发布时间" name="createTime">
            <a-date-picker :show-date="{ defaultValue: dayjs('00:00:00') }" valueFormat="YYYY-MM-DD HH:mm:ss"
              v-model:value="friendMoments.createTime" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item label="位置信息" name="location"  help="位置信息可以为空">
            <a-textarea v-model:value="friendMoments.location" :rows="4" :maxlength="500" :showCount="true" />
          </a-form-item>
          <a-col>
          <a-form-item style="text-align: center;">
            <a-button type="primary" v-privilege="'friend:moments:edit'" @click="confirmUpdate">提交</a-button>
          </a-form-item>
        </a-col>
        </a-col>
        
      </a-row>
      
    </a-form>

    <a-card title="关联信息" size="small" style="margin-top: 15px" v-if="momentId">
      <a-tabs v-model:activeKey="activeKey" size="small">
        <a-tab-pane :key="1" tab="评论信息" v-if="privilege('friend:comments:add')">
          <CommentRef ref="commentRef" :momentId="momentId" :key="momentId" />
        </a-tab-pane>
        <a-tab-pane :key="2" tab="图片信息" v-if="privilege('friend:comments:add')">
          <MediaRef ref="mediaRef" :momentId="momentId" :key="momentId" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-card>
  <!---------- 查询表单form end ----------->

  <!-- 表单操作 -->
 
</template>

<script setup>
import { onMounted, ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { message, Modal } from 'ant-design-vue';
import { friendMomentsApi } from '/@/api/friend/friend-moments-api';
import  CommentRef  from './index-comment.vue';
import  MediaRef  from './index-media.vue';
import { privilege } from '/@/lib/privilege-plugin';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { useRoute } from 'vue-router';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';
const commentRef = ref();
const mediaRef = ref();
// 为friendMoments设置默认值
const friendMoments = ref({
  momentId:undefined,
  userId:undefined,
  visibility: 0, // 默认选中"完全公开"
  content: '',
  createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  location: ''
});

const momentId = ref();



const updateFormRef=ref();

const route = useRoute();

onMounted(() => {
  momentId.value = route.name;
  console.log(momentId.value);
  queryInfo();
});

// 查询详情
async function queryInfo() {
  SmartLoading.show();
  const result = await friendMomentsApi.queryInfo(momentId.value);
  friendMoments.value = result.data;
}

// 确认更新
async function confirmUpdate() {
  updateFormRef.value.validate().then(async () => {
    SmartLoading.show();
    await friendMomentsApi.editMoments(friendMoments.value);
    message.success('修改成功');
    queryInfo();
  });
}


</script>

<style lang="less" scoped>
:deep(.ant-descriptions-item-content) {
  flex: 1;
  overflow: hidden;
}
</style>