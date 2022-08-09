<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb name1="商品管理" name2="添加商品"></breadcrumb>
    <!-- card组件 -->
    <el-card>
      <!-- 消息提示 -->
      <el-alert show-icon title="添加商品信息" center type="info" :closable="false"> </el-alert>
      <!-- 步骤条 -->
      <el-steps class="add_mtop" :space="200" :active="parseInt(activeIndex)" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- form表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRules" label-width="100px" label-position="top">
        <!-- tabs标签 -->
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{ expandTrigger: 'hover', ...cateProps }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- checkbox多选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item" v-for="(item, index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 渲染表单item项 -->
            <el-form-item v-for="(item, index) in onlyTableData" :key="index" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action图片上传的地址 -->
              <!-- on-preview图片预览 on-remove 移除图片 list-type 预览样式 -->
              <!-- :headers 请求头token  on-success 上传事件-->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- //富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button class="add_mtop" type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <img class="preview-img" :src="previewPath" alt="">
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/common/Breadcrumb'
import { getCateList, getCategoriedList, postGoods } from '@/network/goods'
import _ from 'lodash'
export default {
  components: { Breadcrumb },
  data() {
    return {
      // 步骤条
      activeIndex: '0', //当前的活跃步骤条
      //form表单
      addForm: {
        //添加商品表单数据
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],//商品所属的分类
        pics: [], //图片空数组 上传图片
        goods_introduce: '', //商品的详情描述 富文本编辑
        attrs: [],//商品参数数组
      },
      addFormRules: {
        //添加表单规则验证
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
      },
      //商品分类列表
      cateList: [],
      //级联选择器props
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      //存储动态参数列表
      manyTableData: [],
      // 存储静态参数
      onlyTableData: [],
      // 上传图片url地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      //图片上传组件的headers请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览
      previewPath: '',
      previewVisible: false, //对话框是否显示

    }
  },
  methods: {
    //添加商品按钮
    add() {
      this.$refs.addFormRules.validate(async valid => {
        if(!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 执行添加业务逻辑
        // js深拷贝
        // const newAddForm = JSON.parse(JSON.stringify(this.addForm))
        const newAddForm = _.cloneDeep(this.addForm)
        // 数组转字符串
        newAddForm.goods_cat = newAddForm.goods_cat.join(',')
        
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals.join(',')}
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals}
          this.addForm.attrs.push(newInfo)
        })

        newAddForm.attrs = this.addForm.attrs
        console.log(newAddForm);

        // 发起请求添加
        const res = await postGoods(newAddForm)
        if(res.meta.status !== 201) {
          return this.$message.error('添加商品失败!')
        }
        this.$message.success(res.meta.msg)
        //跳转到商品列表
        this.$router.push('/home/goods')

      })
    },
    //监听图片上传成功的事件
    handleSuccess(response) {
      // 1.拼接完整路径
      const picInfo = {pic: response.data.tmp_path}
      // 2.将图片信息对象push到pics数组
      this.addForm.pics.push(picInfo)
      console.log(this.addForm.pics);
    },
    //处理移除图片
    handleRemove(file) {
      console.log(file);
      // 1.获取删除图片的临时路径
      const filePath= file.response.data.tmp_path
      // 2.从pics数组中，找到对象的索引
      const index = this.addForm.pics.findIndex(item => {
        item.pic === filePath
      })
      // 3. 调用数组的splice方法，把图片信息对象从pics移除
      this.addForm.pics.splice(index, 1)
      console.log(this.addForm);
    },
    // 处理图片预览
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    //tab点击事件切换
    async tabClicked() {
      //动态参数面板
      if(this.activeIndex === '1') {
        const res = await getCategoriedList(this.cateId, 'many')
        if(res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        this.manyTableData = res.data
      } else if(this.activeIndex === '2') {
         const res = await getCategoriedList(this.cateId, 'only')
        if(res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals
        })
        this.onlyTableData = res.data
      }
    },
    //tags标签防止跳转
    beforeTabLeave(activeName, oldActiveName) {
      // console.log('即将离开的标签页是：' + oldActiveName,'即将进入的标签页是：' + activeName );
      // return false
      if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    //级联选择器选中变化触发
    handleChange() {
      if(this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }

    },
    //获取商品分类
    async _getCateList() {
      const res = await getCateList()
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.cateList = res.data
    },
  },
  created() {
    this._getCateList()
  },
  computed: {
    cateId() {
      return this.addForm.goods_cat.length === 3 ? this.addForm.goods_cat[2] : null
    }
  }
}
</script>

<style lang="less" scoped>
.add_mtop {
  margin-top: 15px;
}
// >>>只能作用于css，在less、sass、scss中无法识别需要用/deep/
/deep/.el-step__title {
  font-size: 13px;
}
.el-checkbox {
  margin: 0 10px 0 0;
}
.preview-img {
  width: 100%;
}
/deep/.ql-editor {
  min-height: 300px;
}
</style>
