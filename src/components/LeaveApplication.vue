<template>
  <div class="leave-app-page">
    <el-tabs type="border-card">
      <el-tab-pane label="📄 M15 假期申請">
        <el-form :model="m15Form" label-width="120px" style="max-width: 800px; margin: 20px auto;">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="姓名">
                <el-input v-model="m15Form.name" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="職位">
                <el-input v-model="m15Form.position" placeholder="例如：教師" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="休假期間">
            <el-date-picker
              v-model="m15Form.dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
              style="width: 100%;"
            />
          </el-form-item>

          <el-form-item label="休假類別">
            <el-radio-group v-model="m15Form.leaveType">
              <el-radio label="年假">年假</el-radio>
              <el-radio label="病假">病假</el-radio>
              <el-radio label="補假">補假</el-radio>
              <el-radio label="無薪假">無薪假</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="休假原因">
            <el-input v-model="m15Form.reason" type="textarea" :rows="3" />
          </el-form-item>

          <el-button type="primary" @click="exportM15" style="width: 100%;">匯出 M15 Excel 檔</el-button>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="🔄 M15A 時間調動">
        <el-form :model="m15aForm" label-width="120px" style="max-width: 800px; margin: 20px auto;">
          <el-form-item label="原因">
            <el-input v-model="m15aForm.reason" placeholder="例如：校本培訓" />
          </el-form-item>
          
          <el-divider>時間調動明細</el-divider>
          <el-row :gutter="10">
            <el-col :span="11"><strong>原定上班時間</strong></el-col>
            <el-col :span="11"><strong>調動後上班時間</strong></el-col>
          </el-row>
          <el-row :gutter="10" style="margin-top: 10px;">
            <el-col :span="11">
              <el-date-picker v-model="m15aForm.original" type="datetime" style="width: 100%;" />
            </el-col>
            <el-col :span="11">
              <el-date-picker v-model="m15aForm.adjusted" type="datetime" style="width: 100%;" />
            </el-col>
          </el-row>

          <el-button type="success" @click="exportM15A" style="width: 100%; margin-top: 30px;">匯出 M15A Excel 檔</el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth } from '../firebaseConfig';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const m15Form = ref({
  name: '',
  position: '',
  dateRange: [],
  leaveType: '年假',
  reason: ''
});

const m15aForm = ref({
  reason: '',
  original: '',
  adjusted: ''
});

onMounted(() => {
  m15Form.value.name = auth.currentUser?.displayName || auth.currentUser?.email || '';
});

const exportM15 = async () => {
  const response = await fetch('/M15_Template.xlsx');
  const arrayBuffer = await response.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);
  
  const worksheet = workbook.getWorksheet('M15假期申請表'); // 需與 Excel 分頁名稱一致
  if (worksheet) {
    worksheet.getCell('C4').value = m15Form.value.name;
    worksheet.getCell('G5').value = m15Form.value.position;
    worksheet.getCell('C9').value = m15Form.value.reason;
    // 這裡根據範本位置填入更多欄位...
  }

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `M15_申請表_${m15Form.value.name}.xlsx`);
};

const exportM15A = async () => {
  const response = await fetch('/M15_Template.xlsx');
  const arrayBuffer = await response.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);
  
  const worksheet = workbook.getWorksheet('M15A上班時間調動表');
  if (worksheet) {
    worksheet.getCell('B4').value = m15Form.value.name;
    worksheet.getCell('C6').value = m15aForm.value.reason;
    // 填入調動時間...
  }

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `M15A_調動表_${m15Form.value.name}.xlsx`);
};
</script>