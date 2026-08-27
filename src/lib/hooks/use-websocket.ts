'use client';

import { useEffect, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useNotificationStore } from '@/lib/stores/notification-store';

type EventHandler = (data: any) => void;

export function useWebSocket() {
  const token = useAuthStore((state) => state.token);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws', {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('notification:new', (notification) => {
      addNotification(notification);
    });

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [token, addNotification]);

  const subscribe = useCallback((event: string, handler: EventHandler) => {
    const socket = socketRef.current;
    if (!socket) return () => {};
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { socket: socketRef.current, isConnected: !!socketRef.current?.connected, subscribe, emit };
}