<template>
  <div class="main">
    <div class="header">
      <el-tabs v-model="queryParams.cuisineId" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane :label="item.label" :name="item.name" v-for="item, index in state.tabList" :key="index" />
      </el-tabs>
    </div>
    <div class="bottom">
        <div v-for="item, index in state.data.list" :key="index" class="card" @click="handleDetail(item)">
          <div><img :src="item.imageUrl" style="width: 100%; aspect-ratio: 1/1 ;" /></div>
          <div style="display: flex;align-items: center;justify-content: center;">
            <span>{{item.name}}</span>
            <!-- <span style="flex: 1;"></span>
            <span v-show="false" style="color: red; margin-right: 20px;">{{item.price}}￥</span> -->
          </div>
        </div>
        <el-pagination class="page" layout="prev, pager, next" :total="state.data.total" :page-size="queryParams.pageSize"
          @change="onPageChange" />
      </div>
  </div>
</template>


<script setup lang="js">
import { reactive, ref } from 'vue';
import axios from '../../axios';
import { useRouter } from 'vue-router';
const router = useRouter()
const state = reactive({
  tabList: [],
  data: {}
})

const handleClick = (tab, event) => {
  console.log(tab, event)
  getRecipesList()
}

const handleDetail=(item)=>{
  router.push('/detail?id='+item.id)
}

const getCuisinesList = () => {

  axios.get('cuisines/list', { params: { pageNum: 1, pageSize: 10000 } }).then(res => {

    state.tabList = res.list.map(item => ({
      label: item.name,
      name: item.id
    }))

    console.log(state.tabList)
    if (state.tabList.length > 0) {
      queryParams.cuisineId = state.tabList[0].name
      getRecipesList()
    }

  })

}

const onPageChange = (page, size) => {
  queryParams.pageNum = page
  getRecipesList()
}

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  cuisineId: '',
  status: '1'
})
const getRecipesList = () => {

  axios.get('recipes/list', { params: queryParams }).then(res => {

    state.data = res

    console.log(state.data)

  })

}

getCuisinesList()



</script>

<style lang="css" scoped>

.bottom{
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
}
.card{
  cursor: pointer;
  width: 20%;
  /* aspect-ratio: 1/1 ; */
  overflow: hidden;
}
.page{
  position: absolute;
  bottom: 0;
}
</style>