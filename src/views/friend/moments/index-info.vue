<template>
  <a-card title="朋友圈信息管理">
    <a-form class="ant-advanced-search-form" :model="friendMoments" autocomplete="off" ref="updateFormRef"
      :label-col="{ span: 5 }">
      <a-row :gutter="48">
        <a-col :span="30">
          <a-form-item label="信息可见" name="visibility" :rules="[{ required: true, message: '不能为空' }]">
            <a-radio-group v-model:value="friendMoments.visibility">
              <a-radio :value="0">完全公开</a-radio>
              <a-radio :value="1">好友可见</a-radio>
              <a-radio :value="2">自己可见</a-radio>
              <a-radio :value="3">部分可见</a-radio>
              <a-radio :value="4">部分不可见</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 可见性为3或4时显示用户选择框 -->
      <a-row :gutter="24" v-if="['3', '4'].includes(friendMoments.visibility.toString())">
        <a-col :span="24">
          <a-form-item label="指定用户" name="visuser" :rules="{ required: true, message: '请选择用户' }">
            <a-select v-model:value="friendMoments.visuser" placeholder="请选择用户" mode="multiple" show-search
              :filter-option="filterVisUser" :options="filteredVisUserList" style="width: 100%">
              <template #option="option">
                {{ option.label || '未知用户' }}
              </template>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="10">
          <a-form-item label="发布内容" name="content" :rules="[{ required: true, message: '发布内容不能为空' }]"
            help="发布的内容不能超过300个字">
            <a-textarea v-model:value="friendMoments.content" :rows="4" :maxlength="300" :showCount="true" />
          </a-form-item>
          <a-form-item label="发布时间" name="createTime">
            <a-date-picker :show-date="{ defaultValue: dayjs('00:00:00') }" valueFormat="YYYY-MM-DD HH:mm:ss"
              v-model:value="friendMoments.createTime" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item label="位置信息" name="location" help="位置信息可以为空">
            <a-textarea v-model:value="friendMoments.location" :rows="4" :maxlength="500" :showCount="true" />
            <a-button type="primary" @click="showMapModal">选择位置</a-button>
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
          <CommentRef ref="commentRef" :momentId="momentId" :userId="userId" :key="momentId" />
        </a-tab-pane>
        <a-tab-pane :key="2" tab="图片信息" v-if="privilege('friend:comments:add')">
          <MediaRef ref="mediaRef" :momentId="momentId" :userId="userId" :key="momentId" />
        </a-tab-pane>
      </a-tabs>
      <a-modal :visible="mapModalVisible" title="选择位置" @ok="handleMapOk" @cancel="handleMapCancel">
        <div id="amap-container" style="width: 100%; height: 400px;"></div>
        <a-input v-model:value="searchKeyword" placeholder="请输入搜索关键词"
          style="width: 200px; margin-top: 10px; margin-left: 10px;" />
        <a-button type="primary" @click="searchPlace" style="margin-top: 10px; margin-left: 10px;">搜索</a-button>
      </a-modal>
    </a-card>
  </a-card>
</template>

<script setup>
import { onMounted, onUnmounted, ref, nextTick, watch } from 'vue';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';
import { friendMomentsApi } from '/@/api/friend/friend-moments-api';
import CommentRef from './index-comment.vue';
import MediaRef from './index-media.vue';
import { privilege } from '/@/lib/privilege-plugin';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { useRoute } from 'vue-router';
import AMapLoader from '@amap/amap-jsapi-loader';
import { chatUserApi } from '/@/api/chat/chat-user-api';

const commentRef = ref();
const mediaRef = ref();
const activeKey = ref(1);

// 为friendMoments设置默认值
const friendMoments = ref({
  momentId: undefined,
  userId: undefined,
  visibility: "0", // 默认选中"完全公开"
  content: '',
  createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  location: '',
  visuser: [] // 存储指定用户ID数组
});

const momentId = ref();
const userId = ref();
const updateFormRef = ref();
const route = useRoute();

// 地图模态框相关
const mapModalVisible = ref(false);
let map;
let marker;
let placeSearch;
const searchKeyword = ref('');
let mapInitialized = ref(false);

// 用户列表相关
const userList = ref([]); // 原始用户列表
const filteredVisUserList = ref([]); // 过滤后的用户列表（可见性用户选择用）
const visUserSearchKeyword = ref(''); // 可见性用户搜索关键词

onMounted(() => {
  momentId.value = route.name;
  userId.value = route.params.userId;
  console.log(momentId.value);
  console.log(userId.value);
  queryInfo();
  loadUserList(); // 加载用户列表
});

// 加载用户列表
async function loadUserList() {
  try {
    SmartLoading.show();
    const response = await chatUserApi.queryListall();
    const originalUserList = response.rows || [];
    // 转换为 { value: userId, label: nickname } 结构
    userList.value = originalUserList.map(user => ({
      value: user.userId,
      label: user.nickname,
      ...user
    }));
    filteredVisUserList.value = [...userList.value];
  } catch (error) {
    message.error('加载用户列表失败，请刷新重试');
    console.error('加载用户列表错误:', error);
  } finally {
    SmartLoading.hide();
  }
}

// 监听可见性用户搜索关键词变化
watch(visUserSearchKeyword, (newVal) => {
  if (!newVal) {
    filteredVisUserList.value = [...userList.value];
  } else {
    const keyword = newVal.toLowerCase();
    filteredVisUserList.value = userList.value.filter(user =>
      user.nickname.toLowerCase().includes(keyword)
    );
  }
});

// 可见性用户搜索过滤函数
function filterVisUser(inputValue) {
  visUserSearchKeyword.value = inputValue || '';
  return true;
}

async function queryInfo() {
  SmartLoading.show();
  try {
    const result = await friendMomentsApi.queryInfo(momentId.value);
    console.log(result);
    friendMoments.value = {
      ...result.data,
      // 确保visuser为数组类型
      visuser: Array.isArray(result.data.visuser) ? result.data.visuser : (result.data.visuser ? [result.data.visuser] : [])
    };
   
  } catch (error) {
    message.error('查询信息失败');
    console.error(error);
  } finally {
    SmartLoading.hide();
  }
}

async function confirmUpdate() {
  updateFormRef.value.validate().then(async () => {
    SmartLoading.show();
    try {
      const params = { ...friendMoments.value };
      // 确保visuser始终是数组类型
      if (!Array.isArray(params.visuser)) {
        params.visuser = [];
      }
      await friendMomentsApi.editMoments(params);
      message.success('修改成功');
      queryInfo();
    } catch (error) {
      message.error('修改失败');
      console.error(error);
    } finally {
      SmartLoading.hide();
    }
  });
}

function showMapModal() {
  mapModalVisible.value = true;
  nextTick(() => {
    if (!mapInitialized.value) {
      initMap();
    }
  });
}

async function initMap() {
  const mapContainer = document.getElementById('amap-container');
  if (!mapContainer) {
    message.error('地图容器元素未找到，请稍后重试');
    return;
  }
  window._AMapSecurityConfig = {
    securityJsCode: "a6c70d77c2069e008e31ca3510d2fd6c",
  };
  try {
    const AMap = await AMapLoader.load({
      key: "38ee25eed447d766c0db8919f9ad4130",
      version: "2.0",
      plugins: ["AMap.Scale", "AMap.PlaceSearch", "AMap.Geocoder"],
    });

    map = new AMap.Map('amap-container', {
      zoom: 13,
      center: [116.397428, 39.90923]
    });

    marker = new AMap.Marker({
      position: map.getCenter(),
      draggable: true
    });
    marker.setMap(map);

    marker.on('dragend', function (e) {
      const position = e.lnglat;
      getAddress(position);
    });

    map.on('click', function (e) {
      const position = e.lnglat;
      marker.setPosition(position);
      getAddress(position);
    });

    placeSearch = new AMap.PlaceSearch({
      map: map
    });

    mapInitialized.value = true;
  } catch (error) {
    message.error('地图初始化失败，请稍后重试');
    console.error('地图初始化失败:', error);
  }
}

function getAddress(position) {
  const geocoder = new AMap.Geocoder({
    radius: 1000,
    extensions: 'all'
  });
  geocoder.getAddress(position, function (status, result) {
    console.log(position);
    console.log(status);
    console.log(result.info);
    if (status === 'complete' && result.info === 'OK') {
      const address = result.regeocode.formattedAddress;
      const lng = position.getLng();
      const lat = position.getLat();
      friendMoments.value.location = `${address}|${lng}|${lat}`;
    }
  });
}

function handleMapOk() {
  mapModalVisible.value = false;
}

function handleMapCancel() {
  mapModalVisible.value = false;
}

async function searchPlace() {
  if (!mapInitialized.value) {
    message.error('地图尚未初始化，请稍后重试');
    return;
  }
  if (!window.AMap) {
    message.error('高德地图 API 加载失败，请检查网络或 API 密钥');
    return;
  }
  const keyword = searchKeyword.value.trim();
  if (keyword) {
    try {
      placeSearch.search(keyword, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result.poiList.pois.length > 0) {
            const firstPoi = result.poiList.pois[0];
            marker.setPosition(firstPoi.location);
            map.setCenter(firstPoi.location);
            getAddress(firstPoi.location);
          } else {
            message.warning('未找到相关地点，请更换关键词重试');
          }
        } else {
          message.error(`搜索地点失败，请稍后重试。错误信息: ${result ? result.info : '未知错误'}`);
          console.error('搜索地点失败:', status, result);
        }
      });
    } catch (error) {
      message.error('搜索地点时发生错误，请稍后重试');
      console.error('搜索地点时发生错误:', error);
    }
  } else {
    message.warning('请输入有效的搜索关键词');
  }
}

onUnmounted(() => {
  if (map) {
    map.destroy();
    map = null;
    marker = null;
    placeSearch = null;
    mapInitialized.value = false;
  }
});
</script>

<style lang="less" scoped>
:deep(.ant-descriptions-item-content) {
  flex: 1;
  overflow: hidden;
}
</style>