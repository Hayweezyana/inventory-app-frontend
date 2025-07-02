import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Request.css';

interface Category {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  category_id: number;
  quantity: number;
}

const Request: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<{ item_id: number; quantity_requested: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  (async () => {
    try {
      const { data } = await api.get('/inventory');
      console.log('[Fetched Request Data]', data);

      const cats = data.categories.map((cat: any) => ({
  id: cat.id,
  name: cat.name,
}));

const allItems = data.categories.flatMap((cat: any) =>
  cat.items.map((item: any) => ({
    ...item,
    category_id: cat.id
  }))
);

setCategories(cats);
setItems(allItems);
      setLoading(false);
    } catch (err) {
      console.error('[Error fetching /requests/request]', err);
      setLoading(false);
    }
  })();
}, []);


if (loading) return <p>Loading...</p>;

  const handleAdd = (item_id: number) => {
    if (!selected.some(s => s.item_id === item_id)) {
      setSelected([...selected, { item_id, quantity_requested: 1 }]);
    }
  };

  const updateQty = (item_id: number, qty: number) => {
    const item = items.find(i => i.id === item_id);
  if (!item) return;

  const safeQty = Math.min(qty, item.quantity);
    setSelected(prev => prev.map(s => s.item_id === item_id ? { ...s, quantity_requested: safeQty } : s));
  };

  const handleSubmit = async () => {
    try {
    await api.post('/requests', { items: selected });
    alert('Request submitted');
    setSelected([]);
    } catch (err: any) {
    console.error('Submit request error:', err);
    alert('❌ ' + (err.response?.data?.error || 'Failed to submit request'));
  }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Make Request</h2>
      {categories.map((category) => (
        <div key={category.id} className="mb-4">
          <h4 className="font-bold">{category.name}</h4>
          {items.filter(i => i.category_id === category.id).map(item => (
            <div key={item.id} className="border p-2">
              {categories.length === 0 && <p>No inventory found. Please add items.</p>}
              <strong>{item.name}</strong> <span className="text-xs">({item.quantity} in stock)</span>
              <button className="block mt-1 text-sm text-blue-500" onClick={() => handleAdd(item.id)}
                disabled={selected.some(s => s.item_id === item.id) || item.quantity === 0}>
                Add
              </button>
            </div>
          ))}
        </div>
      ))}

      {selected.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Selected Items</h3>
          {selected.map(({ item_id, quantity_requested }) => {
            const item = items.find(i => i.id === item_id);
            const maxQty = item?.quantity || 0;
            return (
              <div key={item_id} className="mb-1">
                {item?.name || `ID ${item_id}`}:
                <input
                  type="number"
                  min={1}
                  value={quantity_requested}
                  onChange={e => updateQty(item_id, +e.target.value)}
                  className="ml-2 border px-2 w-16"
                />
                {quantity_requested >= maxQty && (
                  <span className="text-red-500 text-xs ml-2">Max reached</span>
                )}
              </div>
            );
          })}
          <button onClick={handleSubmit} className="mt-4 bg-blue-600 text-white px-4 py-1 rounded">
            Submit Request
          </button>
        </div>
      )}
    </div>
  );
};

export default Request;
