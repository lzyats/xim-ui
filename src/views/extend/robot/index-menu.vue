<template>
  <a-drawer :width="1000" :open="visible" :body-style="{ paddingBottom: '80px' }" title="编辑菜单" @close="onClose"
    @ok="onSubmit">
    <a-row :gutter="24">
      <div class="content" style="width: 900px; margin: 0 auto">
        <div id="app-menu" v-cloak>
          <!-- 预览窗 -->
          <div class="weixin-preview">
            <div class="weixin-bd">
              <ul class="weixin-menu" id="weixin-menu">
                <li v-for="(btn, i) in menu.button" class="menu-item" :key="btn"
                  :class="{ current: selectedMenuIndex === i && selectedMenuLevel() == 1 }"
                  @click="selectedMenu(i, $event)">
                  <div class="menu-item-title">
                    <i class="icon_menu_dot"></i>
                    <span>{{ btn.name }}</span>
                  </div>
                  <ul class="weixin-sub-menu" v-show="selectedMenuIndex === i">
                    <li v-for="(sub, i2) in btn.children" class="menu-sub-item" :key="sub"
                      :class="{ current: selectedSubMenuIndex === i2 && selectedMenuLevel() == 2 }"
                      @click.stop="selectedSubMenu(i2, $event)">
                      <div class="menu-item-title">
                        <span>{{ sub.name }}</span>
                      </div>
                    </li>
                    <li v-if="btn.children.length < 5" class="menu-sub-item" @click.stop="addMenu(2)">
                      <div class="menu-item-title">
                        <i class="icon14_menu_add"></i>
                      </div>
                    </li>
                    <i class="menu-arrow arrow_out"></i>
                    <i class="menu-arrow arrow_in"></i>
                  </ul>
                </li>
                <li class="menu-item" v-if="menu.button.length < 3" @click="addMenu(1)"><i class="icon14_menu_add"></i>
                </li>
              </ul>
            </div>
          </div>
          <!-- 主菜单 -->
          <div class="weixin-menu-detail" v-if="selectedMenuLevel() == 1">
            <div class="menu-input-group" style="border-bottom: 2px #e8e8e8 solid">
              <div class="menu-name">{{ menu.button[selectedMenuIndex].name }}</div>
              <div class="menu-del" @click="delMenu">删除菜单</div>
            </div>
            <div class="menu-input-group">
              <div class="menu-label">菜单名称</div>
              <div class="menu-input">
                <input type="text" name="name" placeholder="请输入菜单名称" class="menu-input-text"
                  v-model="menu.button[selectedMenuIndex].name"
                  @input="checkMenuName(menu.button[selectedMenuIndex].name)" />
                <p class="menu-tips" style="color: #e15f63" v-show="menuNameBounds">字数超过上限</p>
                <p class="menu-tips">字数不超过4个汉字或8个字母</p>
              </div>
            </div>
            <template v-if="menu.button[selectedMenuIndex].children.length == 0">
              <div class="menu-input-group">
                <div class="menu-label">菜单内容</div>
                <div class="menu-input">
                  <select v-model="menu.button[selectedMenuIndex].type" name="type" class="menu-input-text">
                    <option value="view">跳转网页</option>
                    <option value="mini">选择小程序</option>
                    <option value="page">选择应用路径</option>
                    <option value="even">选择事件回复</option>
                  </select>
                </div>
              </div>
              <div class="menu-content" v-if="selectedMenuType() == 1">
                <div class="menu-input-group">
                  <p class="menu-tips">点击该菜单会跳到以下链接</p>
                  <div class="menu-label">页面地址</div>
                  <div class="menu-input">
                    <input type="text" placeholder="" class="menu-input-text"
                      v-model="menu.button[selectedMenuIndex].value" />
                  </div>
                </div>
              </div>
              <div class="menu-content" v-else-if="selectedMenuType() == 3">
                <div class="menu-input-group">
                  <div class="menu-label">选择事件回复</div>
                  <div class="menu-input">
                    <select v-model="menu.button[selectedMenuIndex].value" class="menu-input-text">
                      <option v-for="(option, index) in extendEven" :key="index" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="menu-content" v-else-if="selectedMenuType() == 4">
                <div class="menu-input-group">
                  <div class="menu-label">选择小程序</div>
                  <div class="menu-input">
                    <select v-model="menu.button[selectedMenuIndex].value" class="menu-input-text">
                      <option v-for="(option, index) in extendMini" :key="index" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="menu-content" v-else-if="selectedMenuType() == 5">
                <div class="menu-input-group">
                  <div class="menu-label">选择应用路径</div>
                  <div class="menu-input">
                    <select v-model="menu.button[selectedMenuIndex].value" class="menu-input-text">
                      <option v-for="(option, index) in extendPage" :key="index" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <!-- 子菜单 -->
          <div class="weixin-menu-detail" v-if="selectedMenuLevel() == 2">
            <div class="menu-input-group" style="border-bottom: 2px #e8e8e8 solid">
              <div class="menu-name">{{ menu.button[selectedMenuIndex].children[selectedSubMenuIndex].name }}</div>
              <div class="menu-del" @click="delMenu">删除子菜单</div>
            </div>
            <div class="menu-input-group">
              <div class="menu-label">子菜单名称</div>
              <div class="menu-input">
                <input type="text" placeholder="请输入子菜单名称" class="menu-input-text"
                  v-model="menu.button[selectedMenuIndex].children[selectedSubMenuIndex].name"
                  @input="checkMenuName(menu.button[selectedMenuIndex].children[selectedSubMenuIndex].name)" />
                <p class="menu-tips" style="color: #e15f63" v-show="menuNameBounds">字数超过上限</p>
                <p class="menu-tips">字数不超过8个汉字或16个字母</p>
              </div>
            </div>
            <div class="menu-input-group">
              <div class="menu-label">子菜单内容</div>
              <div class="menu-input">
                <select v-model="menu.button[selectedMenuIndex].children[selectedSubMenuIndex].type" name="type"
                  class="menu-input-text">
                  <option value="view">跳转网页</option>
                  <option value="mini">选择小程序</option>
                  <option value="page">选择应用路径</option>
                  <option value="even">选择事件回复</option>
                </select>
              </div>
            </div>
            <div class="menu-content" v-if="selectedMenuType() == 1">
              <div class="menu-input-group">
                <p class="menu-tips">点击该菜单会跳到以下链接</p>
                <div class="menu-label">页面地址</div>
                <div class="menu-input">
                  <input type="text" placeholder="" class="menu-input-text"
                    v-model="menu.button[selectedMenuIndex].children[selectedSubMenuIndex].value" />
                </div>
              </div>
            </div>

            <div class="menu-content" v-else-if="selectedMenuType() == 3">
              <div class="menu-input-group">
                <div class="menu-label">选择事件回复</div>
                <div class="menu-input">
                  <select v-model="menu.button[selectedMenuIndex].children[selectedSubMenuIndex].value"
                    class="menu-input-text">
                    <option v-for="(option, index) in extendEven" :key="index" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="menu-content" v-else-if="selectedMenuType() == 4">
              <div class="menu-input-group">
                <div class="menu-label">选择内部小程序</div>
                <div class="menu-input">
                  <select v-model="menu.button[selectedMenuIndex].children[selectedSubMenuIndex].value"
                    class="menu-input-text">
                    <option v-for="(option, index) in extendMini" :key="index" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="menu-content" v-else-if="selectedMenuType() == 5">
              <div class="menu-input-group">
                <div class="menu-label">选择应用路径</div>
                <div class="menu-input">
                  <select v-model="menu.button[selectedMenuIndex].children[selectedSubMenuIndex].value"
                    class="menu-input-text">
                    <option v-for="(option, index) in extendPage" :key="index" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

          </div>
          <div class="weixin-btn-group"></div>
        </div>
      </div>
    </a-row>
    <div class="footer">
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button style="margin-right: 8px" type="primary" @click="onSubmit()">提交 </a-button>
    </div>
  </a-drawer>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { reactive, ref, watch } from 'vue';
import { robotApi } from '../../../api/extend/robot-api';
import { SmartLoading } from '/@/components/framework/smart-loading/index.js';
const emit = defineEmits(['reloadList']);

// 数据声明
const menu = ref({ button: [] }); // 当前菜单
const selectedMenuIndex = ref(''); // 当前选中菜单索引
const selectedSubMenuIndex = ref(''); // 当前选中子菜单索引
const menuNameBounds = ref(false); // 菜单长度是否过长
const extendMini = ref([]);
const extendPage = ref([]);
const extendEven = ref([]);
// 方法
const getExtend = async () => {
  try {
    const res = await robotApi.extendMini(updateForm.robotId);
    extendMini.value = res.data;
    const res2 = await robotApi.extendPage(updateForm.robotId);
    extendPage.value = res2.data;
    const res3 = await robotApi.extendEven(updateForm.robotId);
    extendEven.value = res3.data;
  } catch (err) {
    console.error(err);
  }
};

const selectedMenu = (i) => {
  selectedSubMenuIndex.value = '';
  selectedMenuIndex.value = i;
  const selectedMenu = menu.value.button[selectedMenuIndex.value];
  if (selectedMenu.media_id && selectedMenuType() === 2) {
    getMaterial(selectedMenu.media_id);
  }
  checkMenuName(selectedMenu.name);
};

const selectedSubMenu = (i) => {
  selectedSubMenuIndex.value = i;
  const selectedSubMenu = menu.value.button[selectedMenuIndex.value].children[selectedSubMenuIndex.value];
  if (selectedSubMenu.media_id && selectedMenuType() === 2) {
    getMaterial(selectedSubMenu.media_id);
  }
  checkMenuName(selectedSubMenu.name);
};

const selectedMenuLevel = () => {
  if (selectedMenuIndex.value !== '' && selectedSubMenuIndex.value === '') {
    return 1; // 主菜单
  } else if (selectedMenuIndex.value !== '' && selectedSubMenuIndex.value !== '') {
    return 2; // 子菜单
  } else {
    return 0; // 未选中任何菜单
  }
};

const selectedMenuType = () => {
  if (selectedMenuLevel() === 1 && menu.value.button[selectedMenuIndex.value].children.length === 0) {
    switch (menu.value.button[selectedMenuIndex.value].type) {
      case 'view':
        return 1;
      case 'mini':
        return 4;
      case 'page':
        return 5;
      case 'even':
        return 3;
      default:
        return 1;
    }
  } else if (selectedMenuLevel() === 2) {
    switch (menu.value.button[selectedMenuIndex.value].children[selectedSubMenuIndex.value].type) {
      case 'view':
        return 1;
      case 'mini':
        return 4;
      case 'page':
        return 5;
      case 'even':
        return 3;
      default:
        return 1;
    }
  } else {
    return 1;
  }
};

const addMenu = (level) => {
  if (level === 1 && menu.value.button.length < 3) {
    menu.value.button.push({
      type: 'view',
      name: '菜单名称',
      children: [],
      value: '',
    });
    selectedMenuIndex.value = menu.value.button.length - 1;
    selectedSubMenuIndex.value = '';
  }
  if (level === 2 && menu.value.button[selectedMenuIndex.value].children.length < 5) {
    menu.value.button[selectedMenuIndex.value].children.push({
      type: 'view',
      name: '子菜单名称',
      value: '',
    });
    selectedSubMenuIndex.value = menu.value.button[selectedMenuIndex.value].children.length - 1;
  }
};

const delMenu = async () => {
  if (selectedMenuLevel() === 1) {
    if (selectedMenuIndex.value === 0) {
      menu.value.button.splice(selectedMenuIndex.value, 1);
      selectedMenuIndex.value = 0;
    } else {
      menu.value.button.splice(selectedMenuIndex.value, 1);
      selectedMenuIndex.value -= 1;
    }
    if (menu.value.button.length === 0) {
      selectedMenuIndex.value = '';
    }
  } else if (selectedMenuLevel() === 2) {
    if (selectedSubMenuIndex.value === 0) {
      menu.value.button[selectedMenuIndex.value].children.splice(selectedSubMenuIndex.value, 1);
      selectedSubMenuIndex.value = 0;
    } else {
      menu.value.button[selectedMenuIndex.value].children.splice(selectedSubMenuIndex.value, 1);
      selectedSubMenuIndex.value -= 1;
    }
    if (menu.value.button[selectedMenuIndex.value].children.length === 0) {
      selectedSubMenuIndex.value = '';
    }
  }
};

const checkMenuName = (val) => {
  if (selectedMenuLevel() === 1 && getMenuNameLen(val) <= 8) {
    menuNameBounds.value = false;
  } else if (selectedMenuLevel() === 2 && getMenuNameLen(val) <= 16) {
    menuNameBounds.value = false;
  } else {
    menuNameBounds.value = true;
  }
};

const getMenuNameLen = (val) => {
  let len = 0;
  for (let i = 0; i < val.length; i++) {
    const a = val.charAt(i);
    if (a.match(/[^\x00-\xff]/gi) != null) {
      len += 2;
    } else {
      len += 1;
    }
  }
  return len;
};

const visible = ref(false);
const updateFormDefault = {
  robotId: undefined,
  menu: [],
};
let updateForm = reactive({ ...updateFormDefault });
function openUpdateModal(record) {
  Object.assign(updateForm, record);
  getExtend();
  console.log(menu.value);
  selectedMenuIndex.value = '';
  menu.value.button = JSON.parse(record.menu);
  visible.value = true;
}

function onClose() {
  visible.value = false;
}

async function onSubmit() {
  SmartLoading.show();
  const formData = {
    robotId: updateForm.robotId,
    menu: JSON.stringify(menu.value.button),
  };
  await robotApi.editRobotMenu(formData);
  message.success(updateForm.robotId ? '更新成功' : '新增成功');
  emit('reloadList');
  visible.value = false;
}

defineExpose({
  openUpdateModal,
});
</script>
<style scoped>
* {
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
}

ul {
  padding: 0;
}

li {
  list-style: none;
}

[v-cloak] {
  display: none;
}

#app-menu {
  overflow: hidden;
  width: 950px;
}

.weixin-preview {
  position: relative;
  width: 320px;
  height: 540px;
  float: left;
  margin-right: 10px;
  border: 1px solid #e7e7eb;
}

.weixin-preview a {
  text-decoration: none;
  color: #616161;
}

.weixin-preview .weixin-hd {
  color: #fff;
  text-align: center;
  position: relative;
  top: 0px;
  left: 0px;
  width: 320px;
  height: 64px;
  background: transparent url(/@/assets/images/wexin/menu_head.png) no-repeat 0 0;
  background-position: 0 0;
}

.weixin-preview .weixin-hd .weixin-title {
  color: #fff;
  font-size: 15px;
  width: 100%;
  text-align: center;
  position: absolute;
  top: 33px;
  left: 0px;
}

.weixin-preview .weixin-menu {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #e7e7e7;
  background: transparent url(/@/assets/images/wexin/menu_foot.png) no-repeat 0 0;
  background-position: 0 0;
  background-repeat: no-repeat;
  padding-left: 43px;
  margin-bottom: 0px;
}

/*一级*/
.weixin-preview .weixin-menu .menu-item {
  position: relative;
  float: left;
  line-height: 50px;
  height: 50px;
  text-align: center;
  width: 33.33%;
  border-left: 1px solid #e7e7e7;
  cursor: pointer;
  color: #616161;
}

.weixin-preview .weixin-menu .menu-item:first-child {
  border-left-width: 0px;
}

/*二级*/
.weixin-preview .weixin-sub-menu {
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  border-top: 1px solid #d0d0d0;
  margin-bottom: 0px;
  background: #fafafa;
  display: block;
  padding: 0;
}

.weixin-preview .weixin-sub-menu .menu-sub-item {
  line-height: 50px;
  height: 50px;
  text-align: center;
  width: 100%;
  border: 1px solid #d0d0d0;
  border-top-width: 0px;
  cursor: pointer;
  position: relative;
  color: #616161;
}

.weixin-preview .menu-arrow {
  position: absolute;
  left: 50%;
  margin-left: -6px;
}

.weixin-preview .arrow_in {
  bottom: -4px;
  display: inline-block;
  width: 0px;
  height: 0px;
  border-width: 6px 6px 0px;
  border-style: solid dashed dashed;
  border-color: #fafafa transparent transparent;
}

.weixin-preview .arrow_out {
  bottom: -5px;
  display: inline-block;
  width: 0px;
  height: 0px;
  border-width: 6px 6px 0px;
  border-style: solid dashed dashed;
  border-color: #d0d0d0 transparent transparent;
}

.weixin-preview .menu-item .menu-item-title,
.weixin-preview .menu-sub-item .menu-item-title {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  box-sizing: border-box;
}

.weixin-preview .menu-item.current,
.weixin-preview .menu-sub-item.current {
  border: 1px solid #44b549;
  background: #fff;
  color: #44b549;
}

.weixin-preview .weixin-sub-menu.show {
  display: block;
}

.weixin-preview .icon_menu_dot {
  background: url(/@/assets/images/wexin/index_z354723.png) 0px -36px no-repeat;
  width: 7px;
  height: 7px;
  vertical-align: middle;
  display: inline-block;
  margin-right: 2px;
  margin-top: -2px;
}

.weixin-preview .icon14_menu_add {
  background: url(/@/assets/images/wexin/index_z354723.png) 0px 0px no-repeat;
  width: 14px;
  height: 14px;
  vertical-align: middle;
  display: inline-block;
  margin-top: -2px;
}

.weixin-preview li:hover .icon14_menu_add {
  background: url(/@/assets/images/wexin/index_z354723.png) 0px -18px no-repeat;
}

.weixin-preview .menu-item:hover {
  color: #000;
}

.weixin-preview .menu-sub-item:hover {
  background: #eee;
}

.weixin-preview li.current:hover {
  background: #fff;
  color: #44b549;
}

/*菜单内容*/
.weixin-menu-detail {
  width: 600px;
  padding: 0px 20px 5px;
  background-color: #f4f5f9;
  border: 1px solid #e7e7eb;
  float: left;
  min-height: 540px;
}

.weixin-menu-detail .menu-name {
  float: left;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
}

.weixin-menu-detail .menu-del {
  float: right;
  height: 40px;
  line-height: 40px;
  color: #459ae9;
  cursor: pointer;
}

.weixin-menu-detail .menu-input-group {
  width: 540px;
  margin: 10px 0 30px 0;
  overflow: hidden;
}

.weixin-menu-detail .menu-label {
  float: left;
  height: 30px;
  line-height: 30px;
  width: 80px;
  text-align: right;
}

.weixin-menu-detail .menu-input {
  float: left;
  width: 380px;
}

.weixin-menu-detail .menu-input-text {
  border: 0px;
  outline: 0px;
  background: #fff;
  width: 300px;
  padding: 5px 0px 5px 0px;
  margin-left: 10px;
  text-indent: 10px;
  height: 35px;
}

.weixin-menu-detail .menu-tips {
  color: #8d8d8d;
  padding-top: 4px;
  margin: 0;
}

.weixin-menu-detail .menu-tips.cursor {
  color: #459ae9;
  cursor: pointer;
}

.weixin-menu-detail .menu-input .menu-tips {
  margin: 0 0 0 10px;
}

.weixin-menu-detail .menu-content {
  padding: 16px 20px;
  border: 1px solid #e7e7eb;
  background-color: #fff;
}

.weixin-menu-detail .menu-content .menu-input-group {
  margin: 0px 0 10px 0;
}

.weixin-menu-detail .menu-content .menu-label {
  text-align: left;
  width: 100px;
}

.weixin-menu-detail .menu-content .menu-input-text {
  border: 1px solid #e7e7eb;
}

.weixin-menu-detail .menu-content .menu-tips {
  padding-bottom: 10px;
}

.weixin-menu-detail .menu-msg-content {
  padding: 0;
  border: 1px solid #e7e7eb;
  background-color: #fff;
}

.weixin-menu-detail .menu-msg-content .menu-msg-head {
  overflow: hidden;
  border-bottom: 1px solid #e7e7eb;
  line-height: 38px;
  height: 38px;
  padding: 0 20px;
}

.weixin-menu-detail .menu-msg-content .menu-msg-panel {
  padding: 30px 50px;
}

.weixin-menu-detail .menu-msg-content .menu-msg-select {
  padding: 40px 20px;
  border: 2px dotted #d9dadc;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.weixin-menu-detail .menu-msg-content .menu-msg-select:hover {
  border-color: #b3b3b3;
}

.weixin-menu-detail .menu-msg-content strong {
  display: block;
  padding-top: 3px;
  font-weight: 400;
  font-style: normal;
}

.weixin-menu-detail .menu-msg-content .menu-msg-title {
  float: left;
  width: 310px;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon36_common {
  width: 36px;
  height: 36px;
  vertical-align: middle;
  display: inline-block;
}

.icon_msg_sender {
  margin-right: 3px;
  margin-top: -2px;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  display: inline-block;
}

.weixin-btn-group {
  text-align: center;
  width: 950px;
  margin: 30px 0px;
  overflow: hidden;
}

.weixin-btn-group .btn {
  width: 100px;
  border-radius: 0px;
}

#material-list {
  padding: 20px;
  overflow-y: scroll;
  height: 558px;
}

#news-list {
  padding: 20px;
  overflow-y: scroll;
  height: 558px;
}

#material-list table {
  width: 100%;
}

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