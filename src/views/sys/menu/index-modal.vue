<!--
  * 菜单 表单弹窗
-->
<template>
  <a-drawer :body-style="{ paddingBottom: '80px' }" :maskClosable="true" :title="updateForm.menuId ? '编辑' : '添加'"
    :open="visible" :width="600" @close="onClose">
    <a-form ref="formRef" :labelCol="{ span: labelColSpan }" :labelWrap="true" :model="updateForm" :rules="rules">
      <a-form-item label="菜单类型" name="menuType">
        <a-radio-group v-model:value="updateForm.menuType" button-style="solid">
          <a-radio-button v-for="item in MENU_TYPE_ENUM" :key="item.value" :value="item.value">
            {{ item.desc }}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="updateForm.menuType === MENU_TYPE_ENUM.CATALOG.value ? '上级目录' : '上级菜单'">
        <MenuTreeSelect ref="parentMenuTreeSelect" v-model:value="updateForm.parentId" />
      </a-form-item>
      <!--      目录 菜单 start   -->
      <template
        v-if="updateForm.menuType === MENU_TYPE_ENUM.CATALOG.value || updateForm.menuType === MENU_TYPE_ENUM.MENU.value">
        <a-form-item label="菜单名称" name="menuName">
          <a-input v-model:value="updateForm.menuName" placeholder="请输入菜单名称" :maxlength="20" :showCount="true" />
        </a-form-item>
        <a-form-item label="菜单图标" name="icon">
          <IconSelect @updateIcon="selectIcon">
            <template #iconSelect>
              <a-input v-model:value="updateForm.icon" placeholder="请输入菜单图标" style="width: 200px" :maxlength="20"
                :showCount="true" />
              <component :is="$antIcons[updateForm.icon]" class="smart-margin-left15" style="font-size: 20px" />
            </template>
          </IconSelect>
        </a-form-item>
        <a-form-item v-if="updateForm.menuType === MENU_TYPE_ENUM.MENU.value" label="路由地址" name="path"
          help="比如 商品列表：/shop/goods">
          <a-input v-model:value="updateForm.path" placeholder="请输入路由地址" :maxlength="200" :showCount="true" />
        </a-form-item>
        <template v-if="updateForm.menuType === MENU_TYPE_ENUM.MENU.value">
          <a-form-item v-if="updateForm.frameFlag" label="外链地址" name="frameUrl" help="比如 https://www.baidu.com">
            <a-input v-model:value="updateForm.frameUrl" placeholder="请输入外链地址" :maxlength="200" :showCount="true" />
          </a-form-item>
          <a-form-item v-else label="组件地址" name="component" help="比如 商品列表：/shop/goods/index">
            <a-input v-model:value="updateForm.component" placeholder="请输入组件地址" />
          </a-form-item>
          <a-form-item label="系统权限" name="perms" help="比如 系统权限：sys:user:list">
            <a-input v-model:value="updateForm.perms" placeholder="请输入系统权限" :maxlength="200" :showCount="true" />
          </a-form-item>
          <a-form-item v-if="updateForm.menuType === MENU_TYPE_ENUM.MENU.value" label="是否外链" name="frameFlag">
            <a-switch v-model:checked="updateForm.frameFlag" checked-children="启用" un-checked-children="禁用" />
          </a-form-item>
        </template>
        <template v-if="updateForm.menuType !== MENU_TYPE_ENUM.POINTS.value">
          <a-form-item label="显示状态" name="visible">
            <a-switch v-model:checked="updateForm.visible" checked-children="显示" un-checked-children="隐藏" />
          </a-form-item>
        </template>
        <a-form-item label="启用状态" name="status">
          <a-switch v-model:checked="updateForm.status" checked-children="启用" un-checked-children="禁用" />
        </a-form-item>
      </template>
      <!--      目录 菜单 end   -->
      <!--      按钮 start   -->
      <template v-if="updateForm.menuType === MENU_TYPE_ENUM.POINTS.value">
        <a-form-item label="按钮名称" name="menuName">
          <a-input v-model:value="updateForm.menuName" placeholder="请输入按钮名称" :maxlength="20" :showCount="true" />
        </a-form-item>
        <a-form-item label="系统权限" name="perms" help="比如 系统权限：sys:user:list">
          <a-input v-model:value="updateForm.perms" placeholder="请输入系统权限" :maxlength="200" :showCount="true" />
        </a-form-item>
      </template>
      <!--      按钮 end   -->
      <a-form-item label="排列序号" name="sort" help="值越小越靠前">
        <a-input-number v-model:value="updateForm.sort" :min="0" :max="9999" :precision="0" style="width: 100%"
          placeholder="值越小越靠前">
        </a-input-number>
      </a-form-item>
    </a-form>
    <div class="footer">
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button style="margin-right: 8px" type="primary" @click="onSubmit(false)">提交 </a-button>
      <a-button v-if="!updateForm.menuId" type="primary" @click="onSubmit(true)">提交并添加下一个 </a-button>
    </div>
  </a-drawer>
</template>
<script setup>
import { message } from 'ant-design-vue';
import _ from 'lodash';
import { computed, nextTick, reactive, ref } from 'vue';
import MenuTreeSelect from './index-select.vue';
import { menuApi } from '/@/api/sys/menu-api';
import IconSelect from '/@/components/framework/icon-select/index.vue';
import { MENU_TYPE_ENUM } from '/@/constants/sys/menu-const';
import { SmartLoading } from '/@/components/framework/smart-loading';

// ----------------------- 以下是字段定义 emits props ------------------------
// emit
const emit = defineEmits(['reloadList']);

// ----------------------- 展开、隐藏编辑窗口 ------------------------

// 是否展示抽屉
const visible = ref(false);

const labelColSpan = computed(() => {
  return 4;
});

const parentMenuTreeSelect = ref();

//展开编辑窗口
async function showDrawer(rowData) {
  Object.assign(updateForm, formDefault);
  if (rowData && !_.isEmpty(rowData)) {
    Object.assign(updateForm, rowData);
    if (updateForm.parentId === '0') {
      updateForm.parentId = null;
    }
    updateForm.status = rowData.status !== 'N';
    updateForm.visible = rowData.visible !== 'N';
    updateForm.frameFlag = rowData.frameFlag === 'Y';
  }
  visible.value = true;
}

// 隐藏窗口
function onClose() {
  Object.assign(updateForm, formDefault);
  formRef.value.resetFields();
  visible.value = false;
}

// ----------------------- form表单相关操作 ------------------------

const formRef = ref();
const formDefault = {
  menuId: undefined,
  menuName: undefined,
  menuType: MENU_TYPE_ENUM.CATALOG.value,
  icon: undefined,
  parentId: undefined,
  path: undefined,
  perms: undefined,
  sort: undefined,
  component: undefined,
  status: true,
  visible: true,
  frameFlag: false,
  frameUrl: undefined,
};
let updateForm = reactive({ ...formDefault });

function resetForm() {
  const menuType = updateForm.menuType;
  const parentId = updateForm.parentId;
  Object.assign(updateForm, formDefault);
  formRef.value.resetFields();
  updateForm.menuType = menuType;
  updateForm.parentId = parentId;
}

const rules = {
  menuType: [{ required: true, message: '菜单类型不能为空' }],
  permsType: [{ required: true, message: '权限类型不能为空' }],
  menuName: [
    { required: true, message: '菜单名称不能为空' },
    { max: 20, message: '菜单名称不能大于20个字符', trigger: 'blur' },
  ],
  frameUrl: [
    { required: true, message: '外链地址不能为空' },
    { max: 200, message: '外链地址不能大于200个字符', trigger: 'blur' },
  ],
  path: [
    { required: true, message: '路由地址不能为空' },
    { max: 200, message: '路由地址不能大于200个字符', trigger: 'blur' },
  ],
  perms: [
    { required: true, message: '系统权限不能为空' },
    { max: 200, message: '系统权限不能大于200个字符', trigger: 'blur' },
  ],
};

function validateForm(formRef) {
  return new Promise((resolve) => {
    formRef.validate().then(() => {
      resolve(true);
    }).catch(() => {
      resolve(false);
    });
  });
}

const onSubmit = async (continueFlag) => {
  let validateFormRes = await validateForm(formRef.value);
  if (!validateFormRes) {
    message.error('参数验证错误，请仔细填写表单数据');
    return;
  }
  SmartLoading.show();
  let params = _.cloneDeep(updateForm);
  // 若无父级ID 默认设置为0
  if (!params.parentId) {
    params.parentId = '0';
  }
  params.status = params.status ? 'Y' : 'N';
  params.visible = params.visible ? 'Y' : 'N';
  params.frameFlag = params.frameFlag ? 'Y' : 'N';
  if (params.menuId) {
    await menuApi.updateMenu(params);
  } else {
    await menuApi.addMenu(params);
  }
  message.success(`${params.menuId ? '修改' : '添加'}成功`);
  if (continueFlag) {
    resetForm();
  } else {
    onClose();
  }
  emit('reloadList');
};

function selectIcon(icon) {
  updateForm.icon = icon;
}

// ----------------------- 以下是暴露的方法内容 ------------------------
defineExpose({
  showDrawer,
});
</script>
<style lang="less" scoped>
.footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: left;
  z-index: 1;
}
</style>
