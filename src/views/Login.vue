<template>
  <div class="main">
    <div>
      <h1>食谱推荐系统</h1>
    </div>
    <div>
      <img style="width: 100px;height: 100px;" src="../assets/logo.png" />
    </div>
    <el-card class="form">
      <el-form style="width: 100%; height: 100%;" :model="form" label-width="auto" size="large">
        <el-form-item label="用户名" size="large">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码" size="large">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
      </el-form>
      <div style="width: 100%; display: flex; align-items: center;justify-content: center;">
        <el-button type="primary" @click="login" class="button">登录</el-button>
        <el-button @click="goSign" class="button">注册</el-button>
      </div>
    </el-card>



  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ref } from "vue";
import { useRouter } from "vue-router";
import { setToken } from "../utils/auth";
import axios from "../axios2";
import { ElMessage } from 'element-plus'
const form = reactive({
  username: "",
  password: "",
});

const router = useRouter();
function login() {
  if (form.username && form.password) {

    axios.post('user/login', {
      username: form.username,
      password: form.password,
    })
      .then(response => {
        console.log(response)
        setToken(response); // 缓存token
        router.replace('/dashboard');   // 登录成功后重定向到受保护页面

      })


  } else {
    ElMessage.error('请输入完整')
  }
}

function goSign() {
  router.push("/signup")
}


</script>
<style lang="css" scoped>
.main {
  flex-direction: column;
  /* 子元素垂直排列 */
  height: 100vh;
  /* 高度占满整个屏幕 */
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
}

.form {
  width: 400px;
  margin: 40px auto;
}
</style>