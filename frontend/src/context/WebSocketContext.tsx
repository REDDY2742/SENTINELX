
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (message: any) => void;
  lastMessage: any | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let timeoutId: NodeJS.Timeout;

    const connect = () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        // Use environment variable or default
        const WS_URL = 'ws://13.201.79.48:8000/api/v1/ws';
        socket = new WebSocket(`${WS_URL}?token=${token}`);
        ws.current = socket;

        socket.onopen = () => {
            console.log('✅ WebSocket Connected');
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setLastMessage(data);
                
                if (data.type === 'notification') {
                    toast(data.message, {
                        icon: data.icon || '🔔',
                        duration: 5000,
                        style: {
                            background: '#1e293b',
                            color: '#d1d5db',
                            border: '1px solid #334155',
                        },
                    });
                }
            } catch (e) {
                console.error('Failed to parse WS message', e);
            }
        };

        socket.onclose = () => {
            console.log('❌ WebSocket Disconnected');
            setIsConnected(false);
            
             timeoutId = setTimeout(() => {
                 if (ws.current === socket) { 
                     connect();
                 }
            }, 5000);
        };

        socket.onerror = () => {
            // Suppress verbose error logging to console
            // console.error('WebSocket Error:', error); 
            socket?.close();
        };
    };

    connect();

    return () => {
        if (socket) {
            // socket.onclose = null; // Prevent reconnect loop on unmount
            // socket.close();
        }
        if (ws.current === socket) ws.current = null;
        clearTimeout(timeoutId);
    };
  }, []);

  const sendMessage = (message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected');
    }
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, sendMessage, lastMessage }}>
      {children}
      <Toaster position="top-right" />
    </WebSocketContext.Provider>
  );
};
