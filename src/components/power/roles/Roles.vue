<template>
  <div>
    <!-- 面包屑视图 -->
    <Breadcrumb name1="权限管理" name2="角色列表" />
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <!-- 每行 -->
      <el-row>
        <!-- 每列 -->
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column label="展开列" type="expand">
          <template v-slot="scope">
            <el-row :class="['bdbottom', 'vcenter', index1 === 0 ? 'bdtop' : '']"   v-for="(item1, index1) in scope.row.children" :key="item1.id">
              <!-- 渲染以及权限 占5列 -->
              <el-col :span="5">
                <el-tag  closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级 三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环渲染二级权限 -->
                <el-row :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag closable @close="removeRightById(scope.row, item2.id)" type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable @close="removeRightById(scope.row, item3.id)" type="warning" v-for="(item3, index3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button  type="primary" @click="showEditRoles(scope.row.id)" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" @click="removeRoleById(scope.row.id)" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" @click="showSetRightDialog(scope.row)" size="mini" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" @close="addDialogClosed" :visible.sync="addDialogVisible" width="50%">
      <!-- 页面主体 -->
      <el-form ref="editFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="addForm.rolename"></el-input>
        </el-form-item>
        <el-form-item  prop="roledesc" label="角色描述">
          <el-input v-model="addForm.roledesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色对话框 -->
    <el-dialog title="编辑角色" @close="editDialogClosed" :visible.sync="editDialogVisible" width="50%">
      <!-- 页面主体 -->
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="角色Id">
          <el-input v-model="editForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogCloses">
      <el-tree :data="rightsList" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" :props="treeProps" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '@/components/common/Breadcrumb'
import { getRoles, addRoles, getRolesId, editRolesInfo, delRole, delRolesRight, getAllRights, allotRIghtsByRoleId  } from '@/network/rights'
export default {
  components: { Breadcrumb },
  data() {
    return {
      rolesList: [], //获取所有角色数据
      addDialogVisible: false, //添加用户的显示隐藏
      addForm: {//添加角色的表单数据
        rolename: '',
        roledesc: '',
      },
      addFormRules: {//添加表单验证规则
        rolename: [
          {required: true, message: '请输入角色名称', trigger: 'blur'},
          {min: 1, max: 15, message: '角色名称在1-15个字符间', trigger: 'blur'},
        ],
        roledesc: [
          {required: true, message: '请输入角色描述', trigger: 'blur'},
          {min: 1, max: 15, message: '角色描述在1-15个字符间', trigger: 'blur'},
        ]
      },
      editDialogVisible: false, //编辑用户的显示隐藏
      editForm: {},//编辑用户的表单数据 查询当前行的数据
      editFormRules: {//编辑表单验证规则
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'},
          {min: 1, max: 15, message: '角色名称在1-15个字符间', trigger: 'blur'},
        ],
        roleDesc: [
          {required: true, message: '请输入角色描述', trigger: 'blur'},
          {min: 1, max: 15, message: '角色描述在1-15个字符间', trigger: 'blur'},
        ]
      },
      setRightDialogVisible: false,//控制分配对话框的显示隐藏
      rightsList: [],//所有权限数据
      treeProps: {//树形控件的属性绑定对象
        label: 'authName', // 展示的数据
        children: 'children' // 以什么划分
      },
      defKeys: [], //默认选中的节点Id值
      //获取分配权限的id
      roleId: '',
    }
  },
  created() {
    this.getRolesList() 
  },
  methods: {
    //分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      //数组转换为字符串
      const idStr = keys.join(',')

      const res = await allotRIghtsByRoleId(this.roleId, idStr)
      if(res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)

      this.getRolesList()
      this.setRightDialogVisible = false
    },
    //关闭对话框，自动清空数据
    setRightDialogCloses() {
      this.defKeys = []
    },
    // 递归方式获取所有三级权限的id，保存到defKeys中
    getLeafKeys(node, arr) {
      // 当前节点不包含children，则为三级节点
      if(!node.children) {
        return arr.push(node.id)
      }
      
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
      
    },
    // 展示分配权限对话框
    async showSetRightDialog(role) {
      //获取权限列表
      const res = await getAllRights('tree')
      if(res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      //获取的数据保存到data中
      this.rightsList = res.data
      this.roleId = role.id

      // 每次传递前默认清空数组 或者新建函数，关闭对话框进行清理
      // this.defKeys = []

      //递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 根据id删除对应权限
    async removeRightById(role, rightId) {
      //弹框提示是否删除
      const confirmResult = await this.$confirm('是否删除该角色?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除操作')
      }
      const res = await delRolesRight(role.id, rightId)

      if(res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)

      //刷新列表
      // this.getRolesList()
      // 重新获取权限
      role.children = res.data
    },
    //删除用户的布局渲染及交互方法
    async removeRoleById(id){
      const confirmResult = await this.$confirm('是否删除该角色?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      //永辉确认删除,返回confirm,取消则返回cancel
      if(confirmResult !== 'confirm') {
        return this.$message.info('已取消操作')
      }
      const res = await delRole(id) 
      if(res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } 
      this.$message.success(res.meta.msg)
      //刷新用户列表
      this.getRolesList()
    },
    //提交表单的验证方法
    editRole() {
      this.$refs.editFormRef.validate(async valid => {
        // 表单验证预处理
        if(!valid)  return
        const res = await editRolesInfo(this.editForm)
        if(res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        //关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getRolesList()
        // 提示修改成功
        this.$message.success('修改成功')
      })
    },
    //获取编辑事件id信息的方法
    async showEditRoles(id) {
      //显示对话框
      this.editDialogVisible = true
      //获取id当前的数据
      const res = await getRolesId(id)
      if(res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
    },
    // 监听对话框关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 添加角色
    async addRole() {
      const res = await addRoles(this.addForm)
      if(res.meta.status !== 201) {
        return this.$message.error(res.meta.msg)
      }

      this.$message.success(res.meta.msg)
      //获取列表
      this.getRolesList()
      //关闭对话框
      this.addDialogVisible = false
    },
    // 监听对话框关闭事件
    addDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 获取角色列表
    async getRolesList() {
      const res = await getRoles()
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      this.rolesList = res.data
    },
  },
}
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
