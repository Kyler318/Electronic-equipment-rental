<template>
  <div class="rental-form">
    <h2>新增租借記錄</h2>
    <input v-model="borrowerName" type="text" placeholder="中文姓名" required />
    
    <div v-for="(item, index) in items" :key="index" class="item-row">
      <select v-model="item.type">
        <option value="手提電腦">手提電腦</option>
        <option value="ipad">iPad</option>
        <option value="其他">其他</option>
      </select>
      
      <input v-if="item.type === '其他'" v-model="item.customType" type="text" placeholder="請輸入設備類型" />
      
      <input v-model="item.assetId" type="text" placeholder="設備資產編號" required />
      <button @click="removeItem(index)" v-if="items.length > 1">移除</button>
    </div>
    
    <button @click="addItem">+ 加入更多設備</button>
    <button @click="submitRental" class="submit-btn">確認租借</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // 你的 firebase 初始化文件

const borrowerName = ref('');
const items = ref([{ type: '手提電腦', customType: '', assetId: '', isReturned: false, returnTime: null }]);

const addItem = () => {
  items.value.push({ type: '手提電腦', customType: '', assetId: '', isReturned: false, returnTime: null });
};

const removeItem = (index) => {
  items.value.splice(index, 1);
};

const submitRental = async () => {
  if (!borrowerName.value) return alert('請填寫姓名');
  
  try {
    // 加上唯一 ID 方便後續歸還操作
    const processedItems = items.value.map((item, index) => ({
      ...item,
      id: `${Date.now()}-${index}`
    }));

    await addDoc(collection(db, "rentals"), {
      borrowerName: borrowerName.value,
      borrowTime: new Date(), // 或使用 serverTimestamp()
      items: processedItems
    });
    
    alert('租借成功！');
    borrowerName.value = '';
    items.value = [{ type: '手提電腦', customType: '', assetId: '', isReturned: false, returnTime: null }];
  } catch (error) {
    console.error("寫入錯誤: ", error);
  }
};
</script>