<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb name1="订单管理" name2="订单列表"></breadcrumb>
    <!-- card卡片 -->
    <el-card>
      <!-- 搜索 -->
      <el-row>
        <el-col :span="8">
          <el-input clearable @clear="_getOrders" v-model="queryInfo.query" placeholder="请输入内容">
            <el-button @click="_getOrders" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- table表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"  width="400"> </el-table-column>
        <el-table-column label="订单价格" prop="order_price"  width="100"> </el-table-column>
        <el-table-column label="是否付款" prop="pay_status"  width="100">
          <template v-slot="scope">
            <el-tag v-if="scope.row.pay_status === '1'" type="success">{{scope.row.pay_status | getPayStatus}}</el-tag>

            <el-tag v-else type="danger">{{scope.row.pay_status | getPayStatus}}</el-tag>
            
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"  width="100"> </el-table-column>
        <el-table-column label="下单时间" prop="create_time"  width="180">
          <template v-slot="scope">
            {{scope.row.create_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" v-slot="scope">
          <el-button @click="showEditClick" class="el-icon-edit" type="primary" size="mini"></el-button>
          <el-button @click="showProgressBox" class="el-icon-location" type="success" size="mini"></el-button>
        </el-table-column>
      </el-table>
      <!-- pagination分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%">
      <!-- timeline时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo.data"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '../common/Breadcrumb'
import { getOrders, getLogistics } from '@/network/orders'
import cityData from './citydata'
export default {
  data() {
    return {
      queryInfo: {
        query: '', //查询关键字
        pagenum: 1, //当前页
        pagesize: 10, //每页数据
      },
      orderList: [], //订单列表数据
      total: 0, //总条数
      editDialogVisible: false, //修改地址对话框
      addressForm: {
        address1: [],
        address2: '',
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      cityData,//导入的城市
      // 物流进度
      progressVisible: false, 
      progressInfo: {//物流信息假数据
        "data": [
          {
            "time": "2018-05-10 09:39:00",
            "ftime": "2018-05-10 09:39:00",
            "context": "已签收,感谢使用顺丰,期待再次为您服务",
            "location": ""
          },
          {
            "time": "2018-05-10 08:23:00",
            "ftime": "2018-05-10 08:23:00",
            "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
            "location": ""
          },
          {
            "time": "2018-05-10 07:32:00",
            "ftime": "2018-05-10 07:32:00",
            "context": "快件到达 [北京海淀育新小区营业点]",
            "location": ""
          },
          {
            "time": "2018-05-10 02:03:00",
            "ftime": "2018-05-10 02:03:00",
            "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
            "location": ""
          },
          {
            "time": "2018-05-09 23:05:00",
            "ftime": "2018-05-09 23:05:00",
            "context": "快件到达 [北京顺义集散中心]",
            "location": ""
          },
          {
            "time": "2018-05-09 21:21:00",
            "ftime": "2018-05-09 21:21:00",
            "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
            "location": ""
          },
          {
            "time": "2018-05-09 13:07:00",
            "ftime": "2018-05-09 13:07:00",
            "context": "顺丰速运 已收取快件",
            "location": ""
          },
          {
            "time": "2018-05-09 12:25:03",
            "ftime": "2018-05-09 12:25:03",
            "context": "卖家发货",
            "location": ""
          },
          {
            "time": "2018-05-09 12:22:24",
            "ftime": "2018-05-09 12:22:24",
            "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
            "location": ""
          },
          {
            "time": "2018-05-08 21:36:04",
            "ftime": "2018-05-08 21:36:04",
            "context": "商品已经下单",
            "location": ""
          }
        ],
        "meta": { "status": 200, "message": "获取物流信息成功！" }
      }

    }
  },
  components: { Breadcrumb },

  methods: {
    // 物流进度
    async showProgressBox() {
      // 已废弃
      // const res = await getLogistics()
      this.progressVisible = true
    },
    //关闭对话框充值字符
    editDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    //修改地址对话框的显示及数据请求 没借口，没添加动态
    showEditClick() {
      this.editDialogVisible = true
    },
    // 当前页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this._getOrders()
    },
    //每页数量
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this._getOrders()

    },
    async _getOrders() {
      const res = await getOrders(this.queryInfo)
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.$message.success(res.meta.msg)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
  },
  filters: {
    getPayStatus(val) {
      return val === '0' ? '未付款' : '已付款'
    },
  },
  created() {
    this._getOrders()
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
