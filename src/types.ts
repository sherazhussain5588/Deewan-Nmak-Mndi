/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'BBQ' | 'Karahi' | 'Roti' | 'Drinks' | 'Rice' | 'Raita & Salad';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  type: 'home' | 'table';
  tableNumber?: string;
  status: 'pending' | 'preparing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Booking {
  id: string;
  userId?: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}
