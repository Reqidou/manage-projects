<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="@/assets/logo.jpg" alt="" />
      </div>
      <!-- 登陆表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            :show-password="true"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { checkLogin } from '@/network/login.js'
export default {
  data() {
    return {
      loginForm: {
        //登陆表单数据绑定对象
        username: '',
        password: '',
      },
      loginFormRules: {
        //规则对象
        //验证用户名
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },

          { min: 3, max: 10, message: '长度在3-10之间', trigger: 'blur' },
        ],
        // 验证密码
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6-15之间', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 两种写法
    // login() {
    //   this.$refs.loginFormRef.validate((valid) => {
    //     if(!valid) return;
    //     checkLogin(this.loginForm.username, this.loginForm.password).then(res => {
    //       console.log(res);
    //       if(res.meta.status !== 200) return console.log('登陆失败');
    //       console.log('登陆成功');
    //     }).catch(err => {
    //       console.log(err);
    //     })
    //   });
    // }
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const res = await checkLogin(this.loginForm.username, this.loginForm.password)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(`${res.meta.msg}`)
        this.$message.success(`${res.meta.msg}`)
        // 1.登陆后会将token存储到客户端的sessionStorange
        //   1.1项目其他接口只有在登陆后才可以访问
        //   1.2token在打开当前网站期间生效
        window.sessionStorage.setItem('token', res.data.token)
        // 2.通过编程式(this.$router.push)导航跳转到后台，路由地址是'/home'
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  position: absolute;

  left: 50%;
  top: 50%;

  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;

  transform: translate(-50%, -50%);

  .avatar_box {
    position: absolute;

    left: 50%;
    transform: translate(-50%, -50%);

    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end; //横轴位置
}
</style>
