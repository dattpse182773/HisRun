import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

export default function BackendStatus() {
  const [status, setStatus] = useState('Đang kiểm tra API');
  useEffect(() => {
    const controller = new AbortController();
    api.health(controller.signal).then(data => setStatus(data.database === 'connected' ? 'API & MongoDB đã kết nối' : 'API online · MongoDB chưa kết nối')).catch(error => {
      if (!controller.signal.aborted) setStatus(error.data?.database === 'disconnected' ? 'API online · MongoDB chưa kết nối' : 'API offline · vẫn xem được bản thử');
    });
    return () => controller.abort();
  }, []);
  return <span className="backend-status" role="status"><span className="status-dot" />{status}</span>;
}
