<template>
  <div>
    <!-- 面包屑组件 -->
    <breadcrumb name1="商品管理" name2="参数列表"></breadcrumb>
    <!-- card组件 -->
    <el-card>
      <!-- 警告框 -->
      <el-alert class="el-icon-warning" title="注意：只允许为三级分类设置相关参数！" type="warning" :closable="false"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>请选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="{ expandTrigger: 'hover', ...cateProps }"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab标签区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column label="#" type="expand">
              <template v-slot="scope">
                <el-tag @close="handleClose(index, scope.row)"  closable v-for="(item, index) in scope.row.attr_vals" :key="index">
                  {{item}}
                </el-tag>
                <!-- new-tag标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button @click="showEditDialog(scope.row.attr_id)" type="primary" class="el-icon-edit" size="mini">编辑</el-button>
                <el-button @click="_removeParams(scope.row.attr_id)" type="danger" class="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
             <!-- 展开行 -->
            <el-table-column label="#" type="expand">
              <template v-slot="scope">
                <el-tag @close="handleClose(index, scope.row)"  closable v-for="(item, index) in scope.row.attr_vals" :key="index">
                  {{item}}
                </el-tag>
                <!-- new-tag标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button @click="showEditDialog(scope.row.attr_id)" type="primary" class="el-icon-edit" size="mini">编辑</el-button>
                <el-button @click="_removeParams(scope.row.attr_id)" type="danger" class="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + this.titleText"
      :visible.sync="addDialogVisible"
      @close="addDialogClose"
      width="50%">
      <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="_addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + this.titleText"
      :visible.sync="editDialogVisible"
      @close="editDialogClose"
      width="50%">
      <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="_editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import { getCateList, getCategoriedList, addParams, getCateById, editCateById, removeParams, editPostParams } from '@/network/goods'
export default {
  components: { Breadcrumb },
  data() {
    return {
      //级联选择框
      cateList: [],//商品分类
      cateProps: {//级联选择框
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],//级联选择框双向绑定的数组,
      //tab标签
      activeName: 'many', //被激活的页签名称
      manyTableData: [], //动态参数定义
      onlyTableData: [], //静态属性定义
      // 添加对话框
      addDialogVisible: false, //对话框显示状态
      addForm: {//添加函数表单数据对象
        attr_name:''
      },
      addFormRules: {
        attr_name: [{required: true, message: '请输入参数名称', trigger: 'blur'}],
      },
      // 修改对话框
      editDialogVisible:false, //对话框显示状态
      editForm: {//表格
        
      },
      editFormRules: { //验证规则
        attr_name: [{required: true, message: '请输入参数名称', trigger: 'blur'}], 
      },
    }

  },
  created() {
    this._getcateList()
  },
  
  methods: {
    // 删除tag标签
    handleClose(index, row){
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    },
    //需要发起请求，在文本框失去焦点及删除tag标签使用
    async saveAttrVals(row) {
      const res = await editPostParams(this.cateId, row)
      if(res.meta.status !== 200) {
        return this.$message.error('添加失败')
      }
      this.$message.success(res.meta.msg)
    },

    //修改input显示
    showInput(row) {
      row.inputVisible = true
      // 生命周期，更新后执行这个函数
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 文本框失去焦点或者enter键盘
    async handleInputConfirm(row) {
      if(row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      this.saveAttrVals(row)
     

      row.inputValue = ''
      row.inputVisible = false

    },
    //是否显示tag标签
    showOrNot(scope) {
      return scope.row.attr_vals.length === 1 ? false : true
    },
    //根据id删除指定参数
    async _removeParams(attr_id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err); 
      if(confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const res = await removeParams(this.cateId, attr_id)
      if(res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success(res.meta.msg)
      this.getParamsData()
    },
    //修改参数名称
    _editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if(!valid)  return
        const res = await editCateById(this.cateId, this.editForm)
        if(res.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        this.getParamsData()
      })
    },
    // 关闭对话框，清空参数
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    //点击修改按钮， 打开编辑对话框
    async showEditDialog(attr_id) {
      this.editDialogVisible = true
      const res = await getCateById(this.cateId, attr_id)
      if(res.meta.status !== 200) {
        return this.$message.error('获取数据错误')
      }
      this.editForm = res.data
    },
    //点击添加参数
    _addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return
        const res = await addParams(this.cateId, this.addForm.attr_name, this.activeName)
        if(res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    //对话框关闭清除数据
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    //获取参数列表数据
    async getParamsData() {
      if(this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      //  根据所选分类id和当前所处的activename发送请求
      const res = await getCategoriedList(this.cateId, this.activeName)
      if(res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }
      // 字符串删除，形成数组
      res.data.forEach(item => {
        //数组长度
        item.attr_vals = item.attr_vals ? item.attr_vals = item.attr_vals.split(',') : []
        //控制文本框显示隐藏效果
        this.$set(item, "inputVisible", false)//动态绑定方法
        // item.inputVisible = false
        // 文本框输入的数值
        this.$set(item, "inputValue", '')//动态绑定方法
        // item.inputValue = ''
      })
      //判断数据是属于many还是only,存储在不同数组
      this.activeName === 'many' ? this.manyTableData = res.data : this.onlyTableData = res.data
      console.log(this.manyTableData, this.onlyTableData);
    },
    // tab标签点击事件的处理函数
    handleTabClick() {
      this.getParamsData()
    },
    // 级联选择器发生变化,触发函数
    handleChange() {
      this.getParamsData()
    
    },
    // 获取数组
    async _getcateList() {
      const res = await getCateList()
      if(res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.cateList = res.data
    }
  },
  computed: {
    
    //动态计算标题的文本
    titleText() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    },
    //取三级分类
    cateId() {
      return this.selectedCateKeys.length === 3 ? this.selectedCateKeys[2] : null
    },
    // 按钮在级联选择器有值后启用
    isBtnDisabled() {
      return this.selectedCateKeys.length === 3 ? false : true
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
