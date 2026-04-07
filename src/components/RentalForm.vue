<template>
  <el-card class="box-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span style="font-weight: bold; font-size: 18px;">新增租借記錄</span>
      </div>
    </template>
    
    <el-form label-width="100px" style="max-width: 600px; margin: 0 auto;">
      <el-form-item label="借用人姓名" required>
        <el-input v-model="borrowerName" placeholder="請輸入中文姓名" clearable />
      </el-form-item>

      <div v-for="(item, index) in items" :key="index">
        <el-divider v-if="index > 0"></el-divider>
        
        <el-form-item :label="'設備 ' + (index + 1) + ' 類型'">
          <el-select v-model="item.type" placeholder="請選擇設備" style="width: 100%;">
            <el-option label="手提電腦" value="手提電腦" />
            <el-option label="iPad" value="ipad" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        
        <el-form-item v-if="item.type === '其他'" label="自訂類型">
          <el-input v-model="item.customType" placeholder="請填寫具體設備名稱" clearable />
        </el-form-item>
        
        <el-form-item label="資產編號" required>
          <el-input v-model="item.assetId" placeholder="請輸入設備資產編號" clearable />
        </el-form-item>

        <div style="text-align: right; margin-bottom: 15px;" v-if="items.length > 1">
          <el-button type="danger" plain size="small" @click="removeItem(index)">移除此設備</el-button>
        </div>
      </div>

      <el-form-item>
        <el-button type="primary" plain @click="addItem" style="width: 100%;">+ 借用多項設備</el-button>
      </el-form-item>
      
      <el-form-item style="margin-top: 30px;">
        <el-button type="primary" size="large" @click="submitRental" style="width: 100%;">確認送出租借</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { ElMessage } from 'element-plus'; // 引入漂亮的消息提示

const borrowerName = ref('');
const items = ref([{ type: '手提電腦', customType: '', assetId: '', isReturned: false, returnTime: null }]);

const addItem = () => {
  items.value.push({ type: '手提電腦', customType: '', assetId: '', isReturned: false, returnTime: null });
};

const removeItem = (index) => {
  items.value.splice(index, 1);
};

const submitRental = async () => {
  if (!borrowerName.value) {
    ElMessage.warning('請填寫借用人姓名！');
    return;
  }
  
  // 簡單驗證資產編號是否有填寫
  const hasEmptyId = items.value.some(item => !item.assetId);
  if (hasEmptyId) {
    ElMessage.warning('請確保所有設備的資產編號都已填寫！');
    return;
  }
  
  try {
    const processedItems = items.value.map((item, index) => ({
      ...item,
      id: `${Date.now()}-${index}`
    }));

    await addDoc(collection(db, "rentals"), {
      borrowerName: borrowerName.value,
      borrowTime: new Date(),
      items: processedItems
    });
    
    ElMessage.success('租借記錄已成功新增！');
    borrowerName.value = '';
    items.value = [{ type: '手提電腦', customType: '', assetId: '', isReturned: false, returnTime: null }];
  } catch (error) {
    console.error("寫入錯誤: ", error);
    ElMessage.error('系統發生錯誤，請稍後再試。');
  }
};
</script>