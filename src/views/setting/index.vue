<template>
  <div style="display: flex; align-items: center;  width: 100%; flex-direction: column;">



    <el-form class="form" :model="form" label-width="auto" style="width: 400px">

      <el-form-item label='用户名'>
        <el-input v-model="form.username" />
      </el-form-item>

      <el-form-item label="昵称">
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="form.role" placeholder="请选择" :disabled="true">
          <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-button type="primary" text @click="changePwd">修改密码</el-button>

    </el-form>
    <el-button type="primary" style="width: 200px;" @click="handleEdit">修改</el-button>

    <el-dialog v-model="dialogVisible1" width="500" @close="clearData">
      <el-form class="form" :model="pwdForm" label-width="auto" style="max-width: 600px">
        <el-form-item label='旧密码'>
          <el-input v-model="pwdForm.oldPwd" />
        </el-form-item>
        <el-form-item label='新密码'>
          <el-input v-model="pwdForm.newPwd" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="savePwd">
            确定
          </el-button>
        </div>
      </template>


    </el-dialog>
  </div>

</template>

<script setup lang="js">

import { reactive, ref } from 'vue';
import axios from '../../axios';
import { setUser, getUser } from '../../utils/auth';
import { ElMessage } from 'element-plus';

const dialogVisible1 = ref(false)
const changePwd = () => {
  dialogVisible1.value = true
}

const pwdForm = reactive({
  oldPwd: '',
  newPwd: ''
})

const savePwd = () => {
  axios.put('user/pwd', pwdForm).then(res => {
    ElMessage.success('保存成功')
    dialogVisible1.value = false

  })
}

const clearData = () => {
  pwdForm.newPwd = ''
  pwdForm.oldPwd = ''
}
const handleEdit = () => {

  axios.put('user', form).then(res => {

    ElMessage.success("修改成功")
    getInfo()
  })

}
const roleOptions = [{ value: '0', label: '管理员' }, { value: '1', label: '用户' }]
const form = reactive({
  id: null,
  username: '',
  password: '',
  nickname: '',
  role: ''
})

const getInfo = () => {
  axios.get('user/info').then(res => {


    copyValue(res, form)
    setUser(res)

  })
}

const copyValue = (src, target) => {
  // 遍历 target 中的 key，并将 src 对应属性赋值给 target
  Object.keys(target).forEach((key) => {
    if (src[key] !== undefined) {
      target[key] = src[key] // 仅赋值存在于 src 中的属性
    }
  })
}
getInfo()

</script>

<style lang="css" scoped></style>