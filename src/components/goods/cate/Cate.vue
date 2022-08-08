<template>
  <div>
    <!-- 导航 封装面包屑 -->
    <breadcrumb name1="商品管理" name2="商品分类" />
    <!-- 卡片组件 -->
    <el-card>
      <el-row>
        <el-col>
          <!-- 添加分类按钮 -->
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表单主题 自带 -->
      <!-- <el-table :data="cateList" border stripe row-key="cat_id" :tree-props="{children: 'children'}">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效"></el-table-column>
        <el-table-column prop="cat_level" label="排序"></el-table-column>
        <el-table-column label="操作">
          <el-button type="primary"><i class="el-icon-edit"></i>编辑</el-button>
          <el-button type="danger"><i class="el-icon-delete"></i>删除</el-button>
        </el-table-column>
      </el-table> -->
      <!-- 表单主体 使用组件 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        class="tree-table"
      >
        <!-- 是否有效 -->
        <template v-slot:isok="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:opt="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options指定数据源 v-model双向绑定  -->
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="{ expandTrigger: 'true', checkStrictly: 'true', ...cascaderProps }"
            clearable
            @change="parentCateChanged"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%">
      <el-form :model="editCateForm" :rules="editFormRules" ref="editRuleForm" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateForms">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Breadcrumb from '../../common/Breadcrumb.vue'
import { getCategories, addCategories, editCategories, delCategories } from '@/network/goods'
export default {
  components: { Breadcrumb },
  data() {
    return {
      cateList: [], //存储商品分类列表
      queryInfo: {
        //查询条件
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0, //总数据条数,
      columns: [
        //为table指定列的名称
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template', //当前列定义为模板列
          template: 'isok', //模板名称
        },
        {
          label: '排序',
          type: 'template', //当前列定义为模板列
          template: 'order', //模板名称
        },
        {
          label: '操作',
          type: 'template', //当前列定义为模板列
          template: 'opt', //模板名称
        },
      ],
      addCateDialogVisible: false,//分类列表显示状态,
      addCateForm: {//添加表单参数
        cat_name: '',
        cat_pid: 0,//分类父级id
        cat_level: 0, //分类等级
      },
      addCateFormRules: {//表单参数规则
        cat_name: [
          {required:true, message:'请输入分类名称', trigger: 'blur'},
          {min: 1, max: 20, message: '长度在1-20个字符', trigger: 'blur'}
          ]
      },
      parentCateList: [],//父级分类的列表
      cascaderProps: {//指定级联选择器
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      selectKeys: [], // 选中的父级分类

      editCateDialogVisible: false,//修改对话框的状态
      editFormRules: {//验证修改表单
        cat_name: [
          {required:true, message:'请输入分类名称', trigger: 'blur'},
        ]
      },
      editCateForm: {//存储修改表单列表
      }
    }
  },
  created() {
    this._getCategories()
  },
  methods: {
    async removeCateById(id) {//删除分类
      const confirmResult = await this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      // 如果用户确认删除，返回字符串confirm;取消删除，返回cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const res = await delCategories(id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success(res.meta.msg)
      //刷新用户列表
      this._getCategories()
    },
    editCateForms() {//修改分类数据
      this.$refs.editRuleForm.validate(async valid => {
        const res = await editCategories(this.editCateForm.cat_id, this.editCateForm.cat_name)
        if(res.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.$message.success(res.meta.msg)
        this.editCateDialogVisible = false
        this._getCategories()
      })
    },
    showEditCateDialog(rowList) {//打开修改分类状态栏
      this.editCateDialogVisible = true
      this.editCateForm = rowList
      
    },
    addCateDialogClosed() {//点击清空对话框
    // 分类名称重置
      this.$refs.addCateFormRef.resetFields()
      // 父级分类清空
      this.selectKeys = ''
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0

    },
    addCate() {//点击按钮，添加分类
    this.$refs.addCateFormRef.validate(async valid => {
      if(!valid) return
      const res = await addCategories(this.addCateForm)
      if(res.meta.status !== 201) {
        return this.$message.error('创建失败')
      }
      this.$message.success(res.meta.msg)
      this.addCateDialogVisible = false
      this._getCategories()
    })

    },
    // 选择项发生变化触发函数
    parentCateChanged() {

      if(this.selectKeys.length > 0) {
        //父级分类id
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addCateForm.cat_level = this.selectKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }

      console.log(this.selectKeys);
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const res = await getCategories({
        //查询条件
        type: 2,
      })
      if(res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.parentCateList = res.data

    },
    // 点击按钮添加分类
    showAddCateDialog() {
      // 获取父级分类数据列表
      this.getParentCateList()

      this.addCateDialogVisible = true
    },
    // 监听pagenum
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this._getCategories()
    },
    // 监听pagesize
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this._getCategories()
    },
    // 获取商品列表数据
    async _getCategories() {
      const res = await getCategories(this.queryInfo)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
  },
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
