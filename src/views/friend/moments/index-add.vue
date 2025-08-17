<template>
  <a-modal title="添加朋友圈动态" :open="visible" @close="onClose" @ok="onSubmit" @cancel="onClose">
    <a-form ref="formRef" :model="updateForm" :rules="rules" :label-col="{ span: 5 }">
      <a-form-item label="发布用户ID" name="userId">
        <a-select v-model:value="updateForm.userId" placeholder="请选择发布用户" show-search :filter-option="filterUser"
          :options="filteredUserList" style="width: 100%">
          <template #option="option">
            {{ option.label || '未知用户' }}
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="文字内容" name="content">
        <a-textarea v-model:value="updateForm.content" :maxlength="1000" placeholder="文字内容" />
      </a-form-item>
      <a-form-item label="位置信息" name="location" help="位置信息可以为空">
        <a-textarea v-model:value="updateForm.location" :rows="3" :maxlength="500" :showCount="true" />
        <a-button type="primary" @click="showMapModal" style="margin-top: 8px;">选择位置</a-button>
      </a-form-item>
      <a-form-item label="可见性" name="visibility">
        <a-select v-model:value="updateForm.visibility">
          <a-select-option value="0">广场可见</a-select-option>
          <a-select-option value="1">朋友可见</a-select-option>
          <a-select-option value="2">自己可见</a-select-option>
          <a-select-option value="3">指定可见</a-select-option>
          <a-select-option value="4">指定不可见</a-select-option>
        </a-select>
      </a-form-item>

      <!-- 可见性为3或4时显示用户选择框 -->
      <a-form-item v-if="['3', '4'].includes(updateForm.visibility)"
        label="指定用户"
        name="visuser"
        :rules="{ required: true, message: '请选择用户' }"
        >
        <a-select v-model:value="updateForm.visuser" placeholder="请选择用户" mode="multiple" show-search
          :filter-option="filterVisUser" :options="filteredVisUserList" style="width: 100%">
          <template #option="option">
            {{ option.label || '未知用户' }}
          </template>
        </a-select>
      </a-form-item>
    </a-form>

    <!-- 地图选择模态框 -->
    <a-modal :visible="mapModalVisible" title="选择位置" @ok="handleMapOk" @cancel="handleMapCancel" :maskClosable="false">
      <div id="amap-container" style="width: 100%; height: 400px;"></div>
      <div style="margin-top: 10px; display: flex; gap: 10px;">
        <a-input v-model:value="mapSearchKeyword" placeholder="请输入搜索关键词" style="flex: 1;" />
        <a-button type="primary" @click="searchPlace">搜索</a-button>
      </div>
    </a-modal>
  </a-modal>
</template>

<script setup>
import { ref, nextTick, reactive, watch, onUnmounted } from 'vue';
import { message } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import _ from 'lodash';
import { friendMomentsApi } from '/@/api/friend/friend-moments-api';
import { chatUserApi } from '/@/api/chat/chat-user-api';
import AMapLoader from '@amap/amap-jsapi-loader';

// emit
const emit = defineEmits(['reloadList']);

// 组件ref
const formRef = ref();

// 数据模型定义
const formDefault = {
  userId: undefined,
  content: undefined,
  location: null,
  visibility: "1",
  visuser: [] // 改为数组存储多个用户ID
};

const rules = {
  userId: [{ required: true, message: '用户ID不能为空' }],
  content: [{ required: true, message: '发表内容不能为空' }],
  // visuser规则在form-item中动态添加
};

let updateForm = reactive({ ...formDefault });

// 用户列表相关
const userList = ref([]); // 原始用户列表
const filteredUserList = ref([]); // 过滤后的用户列表（发布用户选择用）
const filteredVisUserList = ref([]); // 过滤后的用户列表（可见性用户选择用）
const userSearchKeyword = ref(''); // 发布用户搜索关键词
const visUserSearchKeyword = ref(''); // 可见性用户搜索关键词
const isUserLoaded = ref(false);

// 是否展示抽屉
const visible = ref(false);

// 地图相关
const mapModalVisible = ref(false);
const mapSearchKeyword = ref(''); // 地图搜索关键词
let map = null;
let marker = null;
let placeSearch = null;
const mapInitialized = ref(false);

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
    filteredUserList.value = [...userList.value];
    filteredVisUserList.value = [...userList.value];
    isUserLoaded.value = true;
  } catch (error) {
    message.error('加载用户列表失败，请刷新重试');
    console.error('加载用户列表错误:', error);
  } finally {
    SmartLoading.hide();
  }
}

// 监听发布用户搜索关键词变化
watch(userSearchKeyword, (newVal) => {
  if (!newVal) {
    filteredUserList.value = [...userList.value];
  } else {
    const keyword = newVal.toLowerCase();
    filteredUserList.value = userList.value.filter(user =>
      user.nickname.toLowerCase().includes(keyword)
    );
  }
});

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

// 发布用户搜索过滤函数
function filterUser(inputValue) {
  userSearchKeyword.value = inputValue || '';
  return true;
}

// 可见性用户搜索过滤函数
function filterVisUser(inputValue) {
  visUserSearchKeyword.value = inputValue || '';
  return true;
}

function showDrawer() {
  visible.value = true;
  nextTick(async () => {
    if (formRef.value) {
      formRef.value.clearValidate();
    }
    await loadUserList(); // 显示抽屉时加载用户列表
  });
}

function onClose() {
  Object.assign(updateForm, formDefault);
  visible.value = false;
  userSearchKeyword.value = ''; // 重置发布用户搜索关键词
  visUserSearchKeyword.value = ''; // 重置可见性用户搜索关键词
  mapSearchKeyword.value = ''; // 重置地图搜索关键词
}

async function onSubmit() {
  console.log(_.cloneDeep(updateForm));
  formRef.value.validate()
    .then(async () => {
      SmartLoading.show();
      let params = _.cloneDeep(updateForm);
      // 确保 location 为空时为 null
      params.location = params.location === '' ? null : params.location;
      // 确保visuser始终是数组类型
      if (!Array.isArray(params.visuser)) {
        params.visuser = [];
      }
      await friendMomentsApi.addMoments(params);
      message.success(`操作成功`);
      onClose();
      emit('reloadList');
    })
    .catch(() => {
      message.error('表单验证失败，请检查输入');
    });
}

// 地图相关方法
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

  // 配置高德地图安全密钥
  window._AMapSecurityConfig = {
    securityJsCode: "a6c70d77c2069e008e31ca3510d2fd6c",
  };

  try {
    const AMap = await AMapLoader.load({
      key: "38ee25eed447d766c0db8919f9ad4130", // 高德地图开发者Key
      version: "2.0",
      plugins: ["AMap.PlaceSearch", "AMap.Geocoder"],
    });

    // 初始化地图
    map = new AMap.Map('amap-container', {
      zoom: 13,
      center: [121.4737, 31.2304] // 上海市中心经纬度
    });

    // 添加标记点
    marker = new AMap.Marker({
      position: map.getCenter(),
      draggable: true // 允许拖拽
    });
    marker.setMap(map);

    // 监听标记点拖拽结束事件
    marker.on('dragend', function (e) {
      const position = e.lnglat;
      getAddress(position);
    });

    // 监听地图点击事件
    map.on('click', function (e) {
      const position = e.lnglat;
      marker.setPosition(position);
      getAddress(position);
    });

    // 初始化地点搜索
    placeSearch = new AMap.PlaceSearch({
      map: map
    });

    mapInitialized.value = true;
  } catch (error) {
    message.error('地图初始化失败，请稍后重试');
    console.error('地图初始化失败:', error);
  }
}

// 根据经纬度获取地址信息
function getAddress(position) {
  const geocoder = new AMap.Geocoder({
    radius: 1000,
    extensions: 'all'
  });

  geocoder.getAddress(position, function (status, result) {
    if (status === 'complete' && result.info === 'OK') {
      const address = result.regeocode.formattedAddress;
      const lng = position.getLng();
      const lat = position.getLat();
      updateForm.location = `${address}|${lng}|${lat}`;
    }
  });
}

// 处理地图选择确认
function handleMapOk() {
  mapModalVisible.value = false;
}

// 处理地图选择取消
function handleMapCancel() {
  mapModalVisible.value = false;
}

// 搜索地点
async function searchPlace() {
  if (!mapInitialized.value) {
    message.error('地图尚未初始化，请稍后重试');
    return;
  }

  if (!window.AMap) {
    message.error('高德地图 API 加载失败，请检查网络或 API 密钥');
    return;
  }

  const keyword = mapSearchKeyword.value.trim();
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

// 组件卸载时清理地图实例
onUnmounted(() => {
  if (map) {
    map.destroy();
    map = null;
    marker = null;
    placeSearch = null;
    mapInitialized.value = false;
  }
});

defineExpose({
  showDrawer,
});
</script>