<template>
  <div>
    <div class="header">
      <el-select v-show="getUser().role == '0'" @change="getRecipesList" style="width: 200px; margin-right: 20px;"
        v-model="queryParams.status" placeholder="状态">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>

      <el-button @click="handleAdd" type="primary" class="btn-add">{{ getName()}}</el-button>
    </div>
    <el-table class="my-table" :data="state.data.list">
      <!-- 图片列 -->
      <el-table-column label="图片">
        <template v-slot="scope">
          <!-- 使用 img 标签来展示图片 -->
          <img :src="scope.row.imageUrl" alt="图片" style="width: 100px; height: 80px;" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="菜名" />
      <el-table-column prop="cuisineName" label="菜系名" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="status" label="状态" :formatter="statusFormatter" />
      <el-table-column prop="createTime" label="创建时间" />


      <el-table-column label="操作">
        <template #default="scope">
          <div v-if="getUser().role == '0'">
            <el-button type="primary" @click="handleStatus(scope.row, '1')" :disabled="queryParams.status !== '0'">
              通过
            </el-button>
            <el-button type="danger" @click="handleStatus(scope.row, '2')" :disabled="queryParams.status !== '0'">
              驳回
            </el-button>
            <el-button type="warning" @click="handleDel(scope.$index, scope.row)"
              :disabled="queryParams.status !== '0'">
              删除
            </el-button>
          </div>
          <div v-else>
            <el-button type="primary" @click="handleRating(scope.row)">
              评分
            </el-button>
          </div>


        </template>
      </el-table-column>


    </el-table>
    <el-pagination layout="prev, pager, next" :total="state.data.total" :page-size="queryParams.pageSize"
      @change="onPageChange" />

    <el-dialog v-model="dialogVisible1" width="500" @close="clearData">

      <el-form class="form" :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="菜名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price" type="number"/>
        </el-form-item>
        <el-form-item label="菜系">
          <el-select v-model="form.cuisineId" placeholder="请选择">
            <el-option v-for="item in state.cuisinesList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload ref="uploadRef" class="avatar-uploader" action="http://8.155.12.207:8888/upload/avatar"
            :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>

          </el-upload>
        </el-form-item>


      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="saveOrUpdate">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible2" width="500" @close="clearData2">
      <el-rate v-model="ratingValue" />
      <template #footer>

        <div class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取消</el-button>
          <el-button type="primary" @click="saveRating">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="js" setup>
import { getUser } from '../../utils/auth.js'
import { Plus } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue';
import axios from '../../axios';
import { ElMessage } from 'element-plus';
let mode = '0'
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  status: '1'
})
const ratingValue = ref(0)
let statusOptions = []
if (getUser().role == '0') {
  statusOptions = [{ value: '0', label: '待审核' }, { value: '1', label: '已审核' }, { value: '2', label: '已拒绝' }]
} else {
  statusOptions = [{ value: '1', label: '已审核' }]
}
const getName=()=>{
  if(getUser().role == '0'){
    return '上传'
  }
  return '分享'
}
const state = reactive({
  data: {},
  cuisinesList: [],
  rowId: '',
})
const handleInput = (value) => {
  console.log('输入的值:', value);
  // 你可以在这里处理输入的内容

  form.password = "a" + value
}
const form = reactive({
  name: '',
  description: '',
  imageUrl: '',
  id: '',
  cuisineId: ''
})
const dialogVisible1 = ref(false)

const clearData = () => {
  form.name = ''
  form.imageUrl = ''
  form.description = ''
  form.id = ''
  form.cuisineId = ''
  mode = '0'
}

const clearData2 = () => {
  ratingValue.value = 0
  state.rowId = ''
}

const handleStatus = (row, status) => {
  row.status = status
  axios.put('recipes', row).then(res => {
    ElMessage.success('更新成功')
    getRecipesList()
  })
}

const getRecipesList = () => {

  axios.get('recipes/list', { params: queryParams }).then(res => {

    state.data = res

    console.log(state.data)

  })

}

const handleAvatarSuccess = (response, uploadFile) => {
  console.log(response)
  form.imageUrl = response.data
};

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('图片不能超过 5MB!');
    return false;
  }

  return true;
};


const saveOrUpdate = () => {
  if (mode == '0') {


    axios.post('recipes', form).then(res => {

      dialogVisible1.value = false
      ElMessage.success('新增成功')
      getRecipesList()

    })
  } else {
    axios.put('recipes', form).then(res => {

      dialogVisible1.value = false
      ElMessage.success('修改成功')
      getRecipesList()

    })
  }


}

const copyValue = (src, target) => {
  // 遍历 target 中的 key，并将 src 对应属性赋值给 target
  Object.keys(target).forEach((key) => {
    if (src[key] !== undefined) {
      target[key] = src[key] // 仅赋值存在于 src 中的属性
    }
  })
}

const handleAdd = () => {
  mode = '0'
  dialogVisible1.value = true
}

const handleEdit = (index, row) => {
  mode = '1'
  copyValue(row, form)
  dialogVisible1.value = true
}
const handleDel = (index, row) => {
  axios.delete('recipes/' + row.id).then(res => {
    ElMessage.success("删除成功")
    getRecipesList()
  })
}

const dialogVisible2 = ref(false)
const handleRating = (row) => {
  dialogVisible2.value = true
  state.rowId = row.id
}

const saveRating = () => {
  axios.post('rating', { foodId: state.rowId, username: getUser().username, rating: ratingValue.value }).then(res => {
    ElMessage.success('评分成功')
    dialogVisible2.value = false
  })
}

const statusFormatter = (row, col, value) => {

  if (value == '0') {
    return '待审核'
  }
  if (value == '1') {
    return '已审核'
  }

  return '已拒绝'
}

const onPageChange = (page, size) => {
  queryParams.pageNum = page
  getRecipesList()
}

const getCuisinesList = () => {

  axios.get('cuisines/list', { params: { pageNum: 1, pageSize: 10000 } }).then(res => {

    state.cuisinesList = res.list.map(item => ({
      value: item.id,
      label: item.name
    }))

    console.log(state.cuisinesList)

  })

}

getRecipesList()
getCuisinesList()
</script>

<style lang="css" scoped>
.header {
  height: 50px;
  position: relative;
  display: flex;
  align-items: center;
  /* margin-bottom: 30px; */

}

.btn-add {
  position: absolute;
  right: 20px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>