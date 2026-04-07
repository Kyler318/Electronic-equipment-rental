<template>
  <div id="app">
    <header>
      <h1>部門設備租借系統</h1>
      <nav>
        <button :class="{ active: currentView === 'rental' }" @click="currentView = 'rental'">📝 設備租借</button>
        <button :class="{ active: currentView === 'management' }" @click="currentView = 'management'">🗂️ 歸還與管理</button>
      </nav>
    </header>

    <main>
      <RentalForm v-if="currentView === 'rental'" />
      <RecordManagement v-if="currentView === 'management'" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// 確保路徑正確，如果你的檔案放在 components 資料夾內請保留以下路徑
import RentalForm from './components/RentalForm.vue';
import RecordManagement from './components/RecordManagement.vue';

// 預設顯示租借頁面
const currentView = ref('rental');
</script>

<style>
/* 簡單的全局排版 */
#app {
  max-width: 800px;
  margin: 0 auto;
  font-family: sans-serif;
  padding: 20px;
}
nav {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
button {
  padding: 10px 15px;
  cursor: pointer;
  border: 1px solid #ccc;
  background: #f8f9fa;
  border-radius: 4px;
}
button.active {
  background: #42b983;
  color: white;
  border-color: #42b983;
}
</style>