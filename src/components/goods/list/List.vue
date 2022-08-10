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
            <el-button @click="editGoods(scope.row.goods_id)" icon="el-icon-edit" type="primary" size="mini"></el-button>
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

      <!-- 编辑对话框 -->
      <el-dialog
        title="修改信息"
        :visible.sync="editDialogVisible"
        width="50%">
        <!-- form表单 -->
        <el-form :model="formList" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="formList.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="formList.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="formList.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="formList.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品描述" prop="goods_introduce">
            <el-input v-model="formList.goods_introduce"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              v-model="formList.goods_cat"
              :options="cateList"
              :props="{ expandTrigger: 'hover', ...cateProps }"
              disabled
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="_editGoods">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import { getGoodsList, deleteGoodsById, getGoodsById, editGoodsById, getCateList } from '@/network/goods'
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
      editDialogVisible: false, //添加按钮显示状态
      formList: {//商品列表存储
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: '',
        attrs: [],
        goods_cat: [],//商品所属的分类
      }, 
      //商品分类列表
      cateList: [],
      //级联选择器props
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      editFormRules: {
        //添加表单规则验证
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_introduce: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
      },
      goods_id: 0,//当前选中商品id
    }
  },
  computed: {},
  methods: {
    
    //获取商品分类
    async _getCateList() {
      const res = await getCateList()
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.cateList = res.data
    },
    // 修改商品
    _editGoods() {
      
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return
        const res = await editGoodsById(this.goods_id, this.formList)
        if(res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('修改商品成功')

        this._getGoodsList()
        this.editDialogVisible = false
      })
      
    },
    //展示商品
    async editGoods(id) {
      
      const res = await getGoodsById(id)
      if(res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      this.formList = res.data
      this.goods_id = id
      this.editDialogVisible = true
      this.formList.goods_cat = [this.formList.cat_one_id, this.formList.cat_two_id, this.formList.cat_three_id]
      console.log(this.formList.goods_cat);
    },
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
    this._getCateList()
  },
}
</script>

<style lang="less" scoped></style>
