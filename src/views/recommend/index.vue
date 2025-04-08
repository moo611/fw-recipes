<template>
  <div>
    <div class="header">
      <el-select style="width: 200px;" v-model="queryParams.cuisineId" placeholder="请选择" @change="getRecipesList">
        <el-option v-for="item in state.cuisines" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <el-table class="my-table" :data="state.data">
      <!-- 图片列 -->
      <el-table-column label="图片" width="120">
        <template v-slot="scope">
          <!-- 使用 img 标签来展示图片 -->
          <img :src="scope.row.imageUrl" alt="图片" style="width: 100px; height: 80px;" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="菜名" />
      <!-- <el-table-column prop="cuisineName" label="菜系名" /> -->
      <!-- <el-table-column prop="status" label="状态" :formatter="statusFormatter" />
      <el-table-column prop="createTime" label="创建时间" /> -->


    </el-table>
    <el-pagination layout="prev, pager, next" :total="state.data.total" :page-size="queryParams.pageSize"
      @change="onPageChange" />

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
  status: '1',
  topk:3,
  cuisineId: null
})


const state = reactive({
  data: [],
  cuisines: []
})



const getRecipesList = () => {

  let params = { ...queryParams }
  if (queryParams.cuisineId == 'all') {
    params.cuisineId = null
  }

  axios.get('recipes/recommend2', { params: params }).then(res => {

    state.data = res

    console.log(state.data)

  })

}


const onPageChange = (page, size) => {
  queryParams.pageNum = page
  getRecipesList()
}

const getCuisinesList = () => {

  axios.get('cuisines/list', { params: { pageNum: 1, pageSize: 10000 } }).then(res => {

    state.cuisines = res.list.map(item => ({ label: item.name, value: item.id }))
    if (state.cuisines.length > 0) {
      queryParams.cuisineId = state.cuisines[0].value
      getRecipesList()
    }
    console.log(state.data)

  })

}
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