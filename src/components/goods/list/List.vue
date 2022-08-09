<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb name1="商品管理" name2="商品列表"></breadcrumb>
    <!-- card卡片 -->
    <el-card>
      <!-- 搜索框及添加商品 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- input搜索框 按钮-->
          <el-input clearable @clear="_getGoodsList" v-model="queryInfo.query" placeholder="请输入内容">
            <el-button @click="_getGoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格 -->
      <el-table :data="goodsList" stripe border>
        <el-table-column type="index" label="#"> </el-table-column>

        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140px">
          <template v-slot="scope">
            {{scope.row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button icon="el-icon-edit" type="primary" size="mini"></el-button>
            <el-button @click="deleteGoods(scope.row.goods_id)" icon="el-icon-delete" type="danger" size="mini"></el-button>
          </template>
          
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
        :total="total"
        background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import { getGoodsList, deleteGoodsById } from '@/network/goods'
export default {
  components: { Breadcrumb },
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //商品列表
      goodsList: [],
      // 数据条数
      total: 0,
    }
  },
  computed: {},
  methods: {
    //添加商品跳转新标签页
    goAddPage() {
      this.$router.push('goods/add')
    },
    //根据id删除商品数据
    async deleteGoods(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const res = await deleteGoodsById(id)
      if(res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success(res.meta.msg)
      this._getGoodsList()
    },
    // 当前页改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this._getGoodsList()
    },
    // size改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this._getGoodsList()
    },
    //获取商品列表
    async _getGoodsList() {
      const res = await getGoodsList(this.queryInfo)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品失败')
      }
      this.$message.success(res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
  },
  created() {
    this._getGoodsList()
  },
}
</script>

<style lang="less" scoped></style>
