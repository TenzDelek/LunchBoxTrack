'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { orderSchema } from '@/utils/Validation';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/',
});

type Order = z.infer<typeof orderSchema>;

type PastOrder = Order & { id: string };

export default function Forms() {
  const [order, setOrder] = useState<Order>({
    customerName: '',
    dishName: '',
    quantity: 1
  });
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);
  const [errors, setErrors] = useState<Partial<Order>>({});


  const fetchPastOrders = async () => {
    try {
      const response = await api.get<PastOrder[]>('/get-orders');
      setPastOrders(response.data);
    } catch (error) {
      console.error('Error fetching past orders:', error);
      alert('Error fetching past orders');
    }
  };

  const validateForm = (): boolean => {
    try {
      orderSchema.parse(order);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Order> = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0] as keyof Order] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await api.post('/submit-order', order);
        alert('Order submitted successfully!');
        setOrder({ customerName: '', dishName: '', quantity: 1 });
        fetchPastOrders();
      } catch (error) {
        console.error('Error submitting order:', error);
        alert('Error submitting order');
      }
    }
  };

  return (
    <div>
      <h1>Restaurant Order Form</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={order.customerName}
          onChange={(e) => setOrder({...order, customerName: e.target.value})}
          placeholder="Customer Name"
        />
        {errors.customerName && <p>{errors.customerName}</p>}
        <input
          type="text"
          value={order.dishName}
          onChange={(e) => setOrder({...order, dishName: e.target.value})}
          placeholder="Dish Name"
        />
        {errors.dishName && <p>{errors.dishName}</p>}
        <input
          type="number"
          value={order.quantity}
          onChange={(e) => setOrder({...order, quantity: parseInt(e.target.value) || 1})}
          min="1"
        />
        {errors.quantity && <p>{errors.quantity}</p>}
        <button type="submit">Submit Order</button>
      </form>
        <button onClick={fetchPastOrders}>View Past Orders</button>
      <h2>Past Orders</h2>
      <ul>
        {pastOrders.map(order => (
          <li key={order.id}>
            {order.customerName} ordered {order.quantity} {order.dishName}
          </li>
        ))}
      </ul>
    </div>
  );
}