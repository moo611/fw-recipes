<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup>

</script>

<style >
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
:root {
  --el-color-primary: #1f8a70 !important;
  
}
/* 修改表格整体字体大小 */
.el-table {
  font-size: 16px; /* 设置为你需要的大小 */
}

/* 如果需要单独修改表头字体 */
.el-table .el-table__header th {
  font-size: 18px; /* 表头字体大小 */
}

/* 修改表格内容字体 */
.el-table .el-table__body td {
  font-size: 16px; /* 内容字体大小 */
}
</style>
