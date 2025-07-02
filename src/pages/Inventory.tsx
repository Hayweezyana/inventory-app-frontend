import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import './Inventory.css';

const Inventory: React.FC = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [itemForm, setItemForm] = useState({ name: '', quantity: 0, category_id: 0 });

  const fetchData = async () => {
    try {
    const res = await api.get('/inventory');
    setCategories(res.data.categories || []);
      } catch (err) {
    console.error('Error fetching inventory:', err);
    setCategories([]);
  }

  };

  useEffect(() => { fetchData(); }, []);

  const createCategory = async () => {
    if (!categoryName.trim()) {
    toast.error('Please enter a valid category name.');
    return;
  }
    try {
    await api.post('/inventory/category', { name: categoryName.trim() });
    toast.success('✅ Category created!');
    setCategoryName('');
    fetchData();
    } catch (err: any) {
    toast.error('❌ Failed to create category: ' + (err.response?.data?.message || err.message));
    console.error('Create category error:', err.response?.data || err.message);
  }
  };

  const createItem = async () => {
    if (!itemForm.name.trim() || !itemForm.quantity || !itemForm.category_id) {
    toast.error('Fill in all item details correctly.');
    return;
  }
  try {
    await api.post('/inventory/stock', itemForm);
    toast.success('✅ Item added!');
    setItemForm({ name: '', quantity: 0, category_id: 0 });
    fetchData();
  } catch (err: any) {
    toast.error('❌ Failed to add item');
    console.error(err);
  }
  };

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-2">Stock Inventory</h2>

      <div className="mb-4">
        <input
          placeholder="New Category"
          value={categoryName}
          onChange={e => setCategoryName(e.target.value)}
          className="input"
        />
        <button onClick={createCategory} className="btn ml-2">Add Category</button>
      </div>

      <div className="mb-4">
        <input
          placeholder="Item Name"
          value={itemForm.name}
          onChange={e => setItemForm({ ...itemForm, name: e.target.value })}
          className="input"
        />
        <input
          type="number"
          placeholder="Qty"
          value={itemForm.quantity}
          onChange={e => setItemForm({ ...itemForm, quantity: +e.target.value })}
          className="input ml-2"
        />
        <select
          onChange={e => setItemForm({ ...itemForm, category_id: +e.target.value })}
          className="ml-2"
        >
          <option>Select Category</option>
          {Array.isArray(categories) && categories.length > 0 ? (
  categories.map((cat: any) => (
    <option key={cat.id} value={cat.id}>{cat.name}</option>
  ))
) : (
  <option disabled>No categories available</option>
)}

        </select>
        <button onClick={createItem} className="btn ml-2">Add Item</button>
      </div>
    </div>
  );
};

export default Inventory;
