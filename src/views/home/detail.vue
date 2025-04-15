<template>
  <div style="display: flex;align-items: center;justify-content: center;">
    <h2 style="margin: 20px;">美食资讯</h2>
  </div>
  
  <el-card style="width: 1000px; height: 400px; margin: 20px auto;">
    <div class="main">
      <img :src="state.data.imageUrl" class="img" />
      <div class="right">
        <div style="margin-top: 20px;">
          <span style="font-size: 25px;">菜名：{{ state.data.name }}</span>
        </div>
        <div style="margin-top: 20px;">
          <span style="font-size: 16px;">价格：{{ state.data.price }}￥</span>
        </div>
        <div style="margin-top: 20px;">
          <span style="font-size: 16px;">介绍：{{ state.data.description }}</span>
        </div>

        <el-button style="position: absolute;bottom: 0; width: 60%; height: 50px; margin: 20px auto;" type="primary" @click="handleBuy">返回</el-button>
      
      </div>
    </div>

  </el-card>


</template>
<script setup lang="js">
import { ElMessage } from 'element-plus';
import axios from '../../axios';
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()
const state = reactive({
  data: {},
  recommendRecipess: [],
  type: '0'
})


const getRecipesDetails = (id) => {

  axios.get('recipes/' + id).then(res => {
    state.data = res
  })

}
const handleBuy = ()=>{
  //ElMessage.success('购买成功')
  router.go(-1)
}

onMounted(() => {

  getRecipesDetails(route.query.id)

})

</script>
<style lang="css" scoped>
.main {

  width: 100%;

  height: 100%;
  display: flex;
}

.img {
  width: 300px;
  height: 300px;
  object-fit: cover;
}

.right {
  position: relative;
  margin-left: 30px;
  width: 100%;
  height: 350px;
}

.bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 80px;
  display: flex;
  /* justify-content: center; */
  align-items: center;
}
</style>