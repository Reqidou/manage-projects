<template>
  <!-- 用户列表组件 -->
  <div>
    <!-- 导航区域 -->
    <breadcrumb name1="用户管理" name2="用户列表" />
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <!-- gutter外间距 -->
      <el-row :gutter="20">
        <!-- span 宽度 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <!-- border 边框 stripe 单双行背景色 -->
      <el-table :data="userList" border stripe>
        <!-- 添加索引 -->
        <el-table-column label="ID" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 这种方法用来获取每行的数据，使用scope.row可获取本行数据 -->
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- 操作栏的带入 -->
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" @close="addDialogClosed" :visible.sync="addDialogVisible" width="50%">
      <!-- 内容主体 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <!-- 点击事件是data传值 -->
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
    <el-dialog title="修改用户" @close="editDialogClosed" :visible.sync="editDialogVisible" width="50%">
      <!-- 内容主体 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <!-- 点击事件是data传值 -->
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" @close="setRoleDialogClosed" :visible.sync="setRoleDialogVisible" width="50%" >
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, putUserInfo, addUser, getUser, editUsersInfo, delUser, getRoles, allotUsersRole } from '@/network/home'
import Breadcrumb from '@/components/common/Breadcrumb'
export default {
  components: { Breadcrumb },
  data() {
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱正则表达式
      // const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        //合法邮箱
        return callback()
      }

      callback(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      //验证手机号的正则表达式
      const regMobile = /^1[234578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号'))
    }
    return {
      // 获取用户列表参数
      queryInfo: {
        query: '',
        pagenum: 1, //当前页码
        pagesize: 2, //当前页面保存多少数据
      },
      userList: [], //存储用户列表
      total: 0, //数据条数
      addDialogVisible: false, //显示隐藏 添加用户的对话框
      addForm: {
        //添加用户的表单数据
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      addFormRules: {
        //添加表单验证规则对象
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3-10个字符之间', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '用户名长度在6-15个字符之间', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      editDialogVisible: false, //控制修改用户对话框的显示及隐藏
      editForm: {}, //查询到的用户对象
      editFormRules: {
        //修改表单验证规则
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      //控制分配角色对话框的显示隐藏
      setRoleDialogVisible: false,
      userInfo: {},//需要被分配权限的用户信息
      rolesList: [], //所有角色数据列表
      selectRoleId: '',//选中的角色id数值
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 监听分配角色对话框的关闭
    setRoleDialogClosed() {
      this.selectRoleId = ''
      this.userList = {}
    },
    //点击按钮分配角色
    async saveRoleInfo() {
      if(!this.selectRoleId) {
        return this.$message.error('请分配新的角色')
      }
      const res = await allotUsersRole(this.userInfo.id, this.selectRoleId)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.setRoleDialogVisible = false
      this.getUserList()

    },
    //展示分配角色对话框
    async setRole(userInfo) {
      this.userInfo = userInfo

      // 获取所有角色列表
      const res = await getRoles()
       if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rolesList = res.data

      //展示对话框
      this.setRoleDialogVisible = true
    },
    // id删除用户信息
    async removeUserById(id) {
      const confirmResult = await this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      // 如果用户确认删除，返回字符串confirm;取消删除，返回cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const res = await delUser(id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      //刷新用户列表
      this.getUserList()
    },
    //修改用户信息
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        // 表单验证预处理
        if (!valid) return
        const res = await editUsersInfo(this.editForm)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        //关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success(res.meta.msg)
      })
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //点击修改用户信息
    async showEditDialog(id) {
      // 显示修改状态栏
      const res = await getUser(id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 点击按钮添加新用户
    addUser() {
      // 动态校验添加用户预验证
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        //添加用户的网络请求
        const res = await addUser(this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)

        //隐藏添加用户对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList(this.editForm)
      })
    },
    // 监听对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //监听switch状态栏的用户状态改变
    async userStateChanged(userInfo) {
      const res = await putUserInfo(userInfo)
      if (res.meta.status !== 200) {
        userInfo.mg_status = !userInfo.mg_status
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    //监听点击页码跳转
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听pagesize（切换一组个数） 改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    async getUserList() {
      const res = await getUsers(this.queryInfo)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
  },
}
</script>

<style lang="less" scoped></style>
