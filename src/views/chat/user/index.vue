<template>
  <!---------- 查询表单form begin ----------->
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">

      <a-form-item label="用户编号" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.userNo" placeholder="用户编号" :allowClear=true />
      </a-form-item>

      <a-form-item label="手机号码" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.phone" :maxlength="11" placeholder="手机号码"
          :allowClear=true />
      </a-form-item>

      <a-form-item label="用户昵称" class="smart-query-form-item">
        <a-input style="width: 150px" v-model:value="queryForm.nickname" placeholder="用户昵称" :allowClear=true />
      </a-form-item>

      <a-form-item class="smart-query-form-item smart-margin-left10">
        <a-button-group>
          <a-button type="primary" @click="searchQuery">
            <template #icon>
              <SearchOutlined />
            </template>
            查询
          </a-button>

          <a-button @click="resetQuery">
            <template #icon>
              <ReloadOutlined />
            </template>
            重置
          </a-button>
        </a-button-group>
        <a-button class="smart-margin-left20" @click="moreQueryConditionFlag = !moreQueryConditionFlag">
          <template #icon>
            <MoreOutlined />
          </template>
          {{ moreQueryConditionFlag ? '收起' : '展开' }}
        </a-button>

      </a-form-item>
    </a-row>

    <a-row class="smart-query-form-row" v-show="moreQueryConditionFlag">
      <a-button-group>

        <a-form-item label="账号状态" class="smart-query-form-item">
          <SmartEnumSelect width="150px" v-model:value="queryForm.status" enumName="CODE_STATUS_ENUM"
            placeholder="账号状态" />
        </a-form-item>

        <a-form-item label="封禁状态" class="smart-query-form-item">
          <SmartEnumSelect width="150px" v-model:value="queryForm.banned" enumName="CODE_BANNED_ENUM"
            placeholder="封禁状态" />
        </a-form-item>

        <a-form-item label="测试账号" class="smart-query-form-item">
          <SmartEnumSelect width="150px" v-model:value="queryForm.special" enumName="CODE_SPECIAL_ENUM"
            placeholder="测试账号" />
        </a-form-item>

      </a-button-group>
    </a-row>

    <a-row class="smart-query-form-row" v-show="moreQueryConditionFlag">
      <a-button-group>

        <a-form-item label="实名认证" class="smart-query-form-item">
          <SmartEnumSelect width="150px" v-model:value="queryForm.auth" enumName="CODE_AUTH_ENUM" placeholder="实名认证" />
        </a-form-item>

        <a-form-item label="账号排序" class="smart-query-form-item">
          <SmartEnumSelect width="150px" v-model:value="queryForm.sorting" enumName="CODE_SORT_ENUM"
            placeholder="账号排序" />
        </a-form-item>
      </a-button-group>
    </a-row>

  </a-form>
  <!---------- 查询表单form end ----------->

  <a-card size="small" :bordered="false" :hoverable="true">

    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button type="primary" v-privilege="'chat:user:add'" @click="add">增加账号</a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID.AJ" :refresh="queryList" />
      </div>
    </a-row>
    <!---------- 表格操作行 end ----------->

    <!---------- 表格 begin ----------->
    <a-table size="small" :dataSource="tableData" :columns="columns" rowKey="userId" bordered :loading="tableLoading"
      :pagination="false">
      <template #bodyCell="{ record, column, index }">
        <template v-if="column.dataIndex === 'rowIndex'">
          <span>
            {{ index + 1 }}
          </span>
        </template>

        <template v-if="column.dataIndex === 'userId'">
          <p>
            <span>用户编号：</span>
            <span>{{ record.userNo }}</span>
          </p>
          <p>
            <span>用户昵称：</span>
            <span>{{ record.nickname }}</span>
          </p>
          <p>
            <span>手机号码：</span>
            <span>{{ record.phone }}</span>
          </p>
          <p v-if="record.remark">
            <span>用户备注：</span>
            <span>{{ record.remark }}</span>
          </p>
        </template>

        <template v-if="column.dataIndex === 'parentId'">
          <p>
            <span>上级ID：</span>
            <span>{{ record.parentId }}
             </span>
          </p>
          <p >
            <span>用户层级：</span>
            <span>{{ record.userDep }}</span>
          </p>
          <p ><span><a-button @click="viewUser(record.parentId)" v-if="record.userDep >0" v-privilege="'chat:user:query'" type="link">
            查看上级详情
            </a-button></span>
            
          </p>
        </template>

        <template v-if="column.dataIndex === 'onLine'">
          <p>
            <span>注册时间：</span>
            <span>{{ record.createTime }}</span>
          </p>
          <p>
            <span>最近登录：</span>
            <span>{{ record.onLine }}</span>
          </p>
          <p>
            <span>登录地址：</span>
            <span>{{ record.ipAddr }}</span>
          </p>
        </template>

        <template v-if="column.dataIndex === 'auth'">
          <p>
            <span>帐号状态：</span>
            <a-tag v-if="record.status == 'Y'" color="success">{{ record.statusLabel }}</a-tag>
            <a-tag v-if="record.status == 'N'" color="error">{{ record.statusLabel }}</a-tag>
          </p>
          <p>
            <span>封禁状态：</span>
            <a-tag v-if="record.banned == 'Y'" color="error">{{ record.bannedLabel }}</a-tag>
            <a-tag v-if="record.banned == 'N'" color="success">{{ record.bannedLabel }}</a-tag>
          </p>
          <p>
            <span>测试账号：</span>
            <a-tag v-if="record.special == 'N'" color="success">正常</a-tag>
            <a-tag v-if="record.special == 'Y'" color="error">测试</a-tag>
          </p>
        </template>

        <template v-if="column.dataIndex === 'portrait'">
          <span>
            <a-image :width="60" :height="60" :src="record.portrait" style="border-radius: 10px;" />
          </span>
        </template>

        <template v-if="column.dataIndex === 'balance'">
          <p>
            <span>实名状态：</span>
            <a-tag v-if="record.auth == '0'" color="magenta">
              {{ record.authLabel }}
            </a-tag>
            <a-tag v-if="record.auth == '1'" color="warning">
              {{ record.authLabel }}
            </a-tag>
            <a-tag v-if="record.auth == '2'" color="success">
              {{ record.authLabel }}
            </a-tag>
            <a-tag v-if="record.auth == '3'" color="error">
              {{ record.authLabel }}
            </a-tag>
          </p>
          <p>
            <span>内部号码：</span>
            <a-tag v-if="record.isvip == '0'" color="magenta">
             普通账号
            </a-tag>
            <a-tag v-if="record.isvip == '1'" color="success">
              内部号码
            </a-tag>

          </p>
          <p v-if="record.authCount">
            <span>实名数量：</span>
            <span>{{ record.authCount }}</span>
          </p>
          <p>
            <span>账户余额：</span>
            <span>{{ record.balance }}</span>
          </p>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="viewUser(record.userId)" v-privilege="'chat:user:query'" type="link">
              用户详情
            </a-button>
          </div>
        </template>
      </template>
    </a-table>
    <!---------- 表格 end ----------->

    <div class="smart-query-table-page">
      <a-pagination showSizeChanger showQuickJumper show-less-items :pageSizeOptions="PAGE_SIZE_OPTIONS"
        :defaultPageSize="queryForm.pageSize" v-model:current="queryForm.pageNum" v-model:pageSize="queryForm.pageSize"
        :total="total" @change="queryList" @showSizeChange="queryList" :show-total="(total) => `共${total}条`" />
    </div>
  </a-card>

  <AddModel ref="addModel" @reloadList="queryList" />
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { chatUserApi } from '/@/api/chat/chat-user-api';
import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
import { TableOperator, TABLE_ID, PAGE_SIZE_OPTIONS } from '/@/components/table-operator';
import AddModel from './index-add.vue';
import { USER_PAGE_PATH } from '/@/constants/sys/home-const';

// ---------------------------- 表格列 ----------------------------

const columns = ref([
  {
    title: '序号',
    dataIndex: 'rowIndex',
    width: 60,
    align: 'center',
  },
  {
    title: '用户头像',
    dataIndex: 'portrait',
    width: 80,
    align: 'center',
  },
  {
    title: '用户信息',
    dataIndex: 'userId',
  },
  {
    title: '推荐信息',
    dataIndex: 'parentId',
  },
  {
    title: '登录信息',
    dataIndex: 'onLine',
  },
  {
    title: '账户余额',
    dataIndex: 'balance',
    width: 180,
  },
  {
    title: '用户状态',
    dataIndex: 'auth',
    width: 180,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 80,
    align: 'center',
    fixed: 'right',
  },
]);

// ---------------------------- 查询数据表单和方法 ----------------------------

const queryFormState = {
  phone: undefined,
  userNo: undefined,
  nickname: undefined,
  special: undefined,
  status: 'Y',
  banned: undefined,
  auth: undefined,
  sorting: undefined,
  pageNum: 1,
  pageSize: 10,
};
// 查询表单form
const queryForm = reactive({ ...queryFormState });
// 表格加载loading
const tableLoading = ref(false);
// 表格数据
const tableData = ref([]);
// 总数
const total = ref(0);
const moreQueryConditionFlag = ref(false);
// 重置查询条件
function resetQuery() {
  let pageSize = queryForm.pageSize;
  Object.assign(queryForm, queryFormState);
  queryForm.pageSize = pageSize;
  queryList();
}

// 重置分页条件
function searchQuery() {
  queryForm.pageNum = queryFormState.pageNum;
  queryList();
}

async function queryList() {
  tableLoading.value = true;
  try {
    let queryResult = await chatUserApi.queryList(queryForm);
    console.log(queryResult);
    tableData.value = queryResult.rows;
    total.value = queryResult.total;
  } finally {
    tableLoading.value = false;
  }
}

// 新建、编辑
const addModel = ref();
function add() {
  addModel.value.showDrawer();
}

const router = useRouter();
function viewUser(userId) {
  router.push(USER_PAGE_PATH + userId);
}

onMounted(queryList);

</script>