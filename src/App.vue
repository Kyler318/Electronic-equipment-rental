<template>
  <el-container style="height: 100vh;">
    
    <el-aside width="220px" style="background-color: #304156;">
      <div style="height: 60px; line-height: 60px; text-align: center; color: white; font-size: 18px; font-weight: bold; border-bottom: 1px solid #1f2d3d;">
        💻 設備租借系統
      </div>
      
      <el-menu
        :default-active="currentView"
        class="el-menu-vertical-demo"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        style="border-right: none;"
        @select="handleSelect"
      >
        <el-menu-item index="rental">
          <el-icon><EditPen /></el-icon>
          <span>新增租借</span>
        </el-menu-item>
        
        <el-menu-item index="management">
          <el-icon><List /></el-icon>
          <span>歸還與管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="background-color: white; box-shadow: 0 1px 4px rgba(0,21,41,.08); display: flex; align-items: center;">
        <h2 style="margin: 0; font-size: 20px; color: #303133;">
          {{ currentView === 'rental' ? '新增租借記錄' : '資產管理與歸還' }}
        </h2>
      </el-header>
      
      <el-main style="background-color: #f0f2f5;">
        <RentalForm v-if="currentView === 'rental'" />
        <RecordManagement v-if="currentView === 'management'" />
      </el-main>
    </el-container>

  </el-container>
</template>

<script setup>
import { ref } from 'vue';
import RentalForm from './components/RentalForm.vue';
import RecordManagement from './components/RecordManagement.vue';
// 引入我們需要的兩個圖示
import { EditPen, List } from '@element-plus/icons-vue';

const currentView = ref('rental');

// 處理選單點擊切換頁面
const handleSelect = (index) => {
  currentView.value = index;
};
</script>

<style>
body {
  margin: 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
}
/* 讓捲軸漂亮一點 */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 4px;
}
</style>