// UploadInventory.tsx
import React from 'react';
import * as XLSX from 'xlsx';
import api from '../services/api';
import './UploadInventory.css';

const UploadInventory: React.FC = () => {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(worksheet);

    try {
      await api.post('/inventory/bulk-upload', { items: json });
      alert('Inventory uploaded successfully');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Bulk Stock Inventory</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
    </div>
  );
};

export default UploadInventory;
