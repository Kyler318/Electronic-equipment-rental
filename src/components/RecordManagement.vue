<template>
  <div class="management-page">
    <h2>資產管理與歸還</h2>
    
    <div class="summary-board">
      <h3>未還設備概覽</h3>
      <ul>
        <li v-for="(summary, name) in unreturnedSummary" :key="name">
          <strong>{{ name }}</strong>: 剩餘 {{ summary.count }} 部 
          (類型: {{ summary.types.join(', ') }})
        </li>
      </ul>
    </div>

    <div class="filters">
      <input type="month" v-model="selectedMonth" @change="fetchRecords" />
    </div>

    <div class="records-list">
      <div 
        v-for="record in records" 
        :key="record.id" 
        class="record-card"
        :class="{ 'highlight': activeRecordId === record.id }"
        @click="activeRecordId = record.id"
      >
        <p><strong>{{ record.borrowerName }}</strong> - {{ formatDate(record.borrowTime) }}</p>
        
        <ul>
          <li v-for="item in record.items" :key="item.id">
            <span :class="{ 'returned-text': item.isReturned }">
              {{ item.type === '其他' ? item.customType : item.type }} ({{ item.assetId }})
            </span>
            <span v-if="item.isReturned"> - 已歸還於 {{ formatDate(item.returnTime) }}</span>
            
            <input 
              v-else 
              type="checkbox" 
              :value="item.id" 
              v-model="returnSelection[record.id]" 
            />
          </li>
        </ul>
        
        <button 
          v-if="returnSelection[record.id]?.length > 0" 
          @click="submitReturn(record.id)"
        >
          確認歸還勾選設備
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const records = ref([]);
const selectedMonth = ref(new Date().toISOString().slice(0, 7)); // 預設當月 YYYY-MM
const returnSelection = ref({}); // 追蹤每個記錄中被勾選準備歸還的設備 ID
const activeRecordId = ref(null); // 用於高亮點選的記錄

// 計算屬性：自動整理頂部的未還清單
const unreturnedSummary = computed(() => {
  const summary = {};
  records.value.forEach(record => {
    record.items.forEach(item => {
      if (!item.isReturned) {
        if (!summary[record.borrowerName]) {
          summary[record.borrowerName] = { count: 0, types: new Set() };
        }
        summary[record.borrowerName].count++;
        const displayType = item.type === '其他' ? item.customType : item.type;
        summary[record.borrowerName].types.add(displayType);
      }
    });
  });
  
  // 將 Set 轉為 Array 方便顯示
  for (let name in summary) {
    summary[name].types = Array.from(summary[name].types);
  }
  return summary;
});

// 讀取資料邏輯 (包含月份篩選)
const fetchRecords = async () => {
  const startDate = new Date(`${selectedMonth.value}-01T00:00:00`);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);

  const q = query(
    collection(db, "rentals"),
    where("borrowTime", ">=", startDate),
    where("borrowTime", "<=", endDate)
  );

  const querySnapshot = await getDocs(q);
  records.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // 初始化 Checkbox 狀態物件
  records.value.forEach(r => {
    if (!returnSelection.value[r.id]) returnSelection.value[r.id] = [];
  });
};

// 提交部分歸還
const submitReturn = async (recordId) => {
  const selectedItemIds = returnSelection.value[recordId];
  const recordIndex = records.value.findIndex(r => r.id === recordId);
  const currentRecord = records.value[recordIndex];

  // 更新本地陣列與加上歸還時間
  const updatedItems = currentRecord.items.map(item => {
    if (selectedItemIds.includes(item.id)) {
      return { ...item, isReturned: true, returnTime: new Date() };
    }
    return item;
  });

  // 更新 Firebase
  const recordRef = doc(db, "rentals", recordId);
  await updateDoc(recordRef, { items: updatedItems });

  // 更新 UI 狀態
  records.value[recordIndex].items = updatedItems;
  returnSelection.value[recordId] = []; // 清空該記錄的勾選
  alert('歸還紀錄已更新！');
};

const formatDate = (dateInput) => {
  if (!dateInput) return '';
  // 處理 Firebase Timestamp 或 JS Date
  const d = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
  return d.toLocaleString('zh-HK');
};

onMounted(() => {
  fetchRecords();
});
</script>

<style>
/* 高亮與樣式 */
.highlight {
  border: 2px solid #42b983;
  background-color: #f0f9f4;
}
.returned-text {
  text-decoration: line-through;
  color: #888;
}
.summary-board {
  background: #f8f9fa;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
}
</style>