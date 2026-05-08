"use client";

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Sidebar } from '@/components/Sidebar';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Check if demo mode is enabled
        const { isDemoModeEnabled } = await import('@/services/fetcher');
        const demoMode = await isDemoModeEnabled();
        
        if (demoMode) {
          // Show mock data in demo mode
          const mockSellerOrders = [
          {
            id: "13",
            buyerId: 19,
            status: "PENDING",
            totalAmount: 89.99,
            createdAt: "2026-05-08T09:18:02.679Z",
            buyer: {
              id: 19,
              username: "buyer_user",
              email: "buyer@example.com"
            },
            items: [
              {
                id: "13",
                saleOrderId: "13",
                productId: "27",
                quantity: 1,
                unitPrice: 89.99,
                subtotal: 89.99,
                product: {
                  id: "27",
                  title: "Wireless Headphones",
                  image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
                }
              }
            ]
          },
          {
            id: "12",
            buyerId: 19,
            status: "PAID",
            totalAmount: 179.98,
            createdAt: "2026-05-08T09:14:04.097Z",
            buyer: {
              id: 19,
              username: "buyer_user",
              email: "buyer@example.com"
            },
            items: [
              {
                id: "12",
                saleOrderId: "12",
                productId: "27",
                quantity: 2,
                unitPrice: 89.99,
                subtotal: 179.98,
                product: {
                  id: "27",
                  title: "Wireless Headphones",
                  image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
                }
              }
            ]
          }
        ];
          setOrders(mockSellerOrders);
        } else {
          // Use real API data in live mode
          const ordersData = await api.getOrders();
          setOrders(ordersData);
        }
      } catch (err) {
        setError('Could not load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <Sidebar />
        <section className="text-center py-12">
          <h1 className="text-2xl font-bold text-slate-900">Loading orders...</h1>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <Sidebar />
        <section className="text-center py-12">
          <h1 className="text-2xl font-bold text-slate-900">Error loading orders</h1>
          <p className="text-slate-600 mt-2">{error}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
      <Sidebar />
      <section className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-600">Manage and fulfill customer orders</p>
        </div>
        <div className="text-sm text-slate-500">
          {orders.length} total orders
        </div>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600">No orders received yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="surface-card p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-slate-900">Order #{order.id}</h3>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'DELIVERED' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Buyer: {order.buyer?.username || 'Unknown'}</span>
                    <span>•</span>
                    <span>{order.buyer?.email || 'No email'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">฿{order.totalAmount}</div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold text-slate-900 mb-3">Items</h4>
                <div className="space-y-3">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                      <div className="w-12 h-12 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.product?.image || '/file.svg'} 
                          alt={item.product?.title || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{item.product?.title || `Product #${item.productId}`}</p>
                        <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-slate-900">฿{item.unitPrice}</div>
                        <div className="text-sm text-slate-600">× {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                <div className="text-sm text-slate-600">
                  Order Total
                </div>
                <div className="font-bold text-slate-900">
                  ฿{order.totalAmount}
                </div>
              </div>
              
              {order.status === 'PAID' && (
                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 bg-[#0a3f82] text-white rounded-lg hover:bg-[#093672] transition-colors">
                    Create Shipping Label
                  </button>
                  <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                    View Details
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      </section>
    </div>
  );
}
