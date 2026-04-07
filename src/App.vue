<template>
  <div id="app">
    <el-container style="max-width: 900px; margin: 0 auto; padding-top: 20px;">
      <el-header height="auto" style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #409EFF; margin-bottom: 20px;">部門設備租借系統</h1>
        <el-radio-group v-model="currentView" size="large">
          <el-radio-button label="rental">📝 設備租借</el-radio-button>
          <el-radio-button label="management">🗂️ 歸還與管理</el-radio-button>
        </el-radio-group>
      </el-header>

      <el-main>
        <RentalForm v-if="currentView === 'rental'" />
        <RecordManagement v-if="currentView === 'management'" />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import RentalForm from './components/RentalForm.vue';
import RecordManagement from './components/RecordManagement.vue';

const currentView = ref('rental');
</script>

<style>
body {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微軟雅黑", Arial, sans-serif;
  background-color: #f5f7fa;
  margin: 0;
}
</style>