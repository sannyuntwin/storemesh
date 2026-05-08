"use client";

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }
      
      try {
        // Check if demo mode is enabled
        const { isDemoModeEnabled } = await import('@/services/fetcher');
        const demoMode = await isDemoModeEnabled();
        
        if (demoMode) {
          // Show mock data in demo mode
          const mockOrders = [
            {
              id: "DEMO-001",
              buyerId: 19,
              status: "PENDING",
              totalAmount: 89.99,
              createdAt: "2026-05-08T09:18:02.679Z",
              items: [
                {
                  id: "DEMO-001-1",
                  saleOrderId: "DEMO-001",
                  productId: "27",
                  quantity: 1,
                  unitPrice: 89.99,
                  subtotal: 89.99
                }
              ]
            },
            {
              id: "DEMO-002",
              buyerId: 19,
              status: "PAID",
              totalAmount: 179.98,
              createdAt: "2026-05-08T09:14:04.097Z",
              items: [
                {
                  id: "DEMO-002-1",
                  saleOrderId: "DEMO-002",
                  productId: "27",
                  quantity: 2,
                  unitPrice: 89.99,
                  subtotal: 179.98
                }
              ]
            }
          ];
          setOrders(mockOrders);
        } else {
          // Use real API data in live mode
          const { api } = await import('@/services/api');
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
  }, [session]);

  if (!session?.user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-900">Please sign in to view your orders</h1>
        <p className="text-slate-600 mt-2">You need to be logged in to see your order history.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-900">Loading orders...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-900">Error loading orders</h1>
        <p className="text-slate-600 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
      <p className="text-slate-600">View your order history and status</p>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="surface-card p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-900">Order #{order.id}</h3>
                  <p className="text-sm text-slate-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
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
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold text-slate-900">Items</h4>
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center py-2">
                    <div className="flex-1">
                      <p className="text-sm text-slate-600">
                        {item.quantity} × Product #{item.productId}
                      </p>
                    </div>
                    <div className="text-right text-sm font-medium text-slate-900">
                      ฿{item.unitPrice} × {item.quantity} = ฿{item.subtotal}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-bold text-slate-900">฿{order.totalAmount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
