import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const useMetricsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const t0 = performance.now();

    return () => {
      const t1 = performance.now();
      const metrics = {
        path: location.pathname,
        renderTimeMs: (t1 - t0).toFixed(2),
        timestamp: new Date().toISOString(),
      };

      const sendMetrics = async () => {
        try {
          await axios.post(`${import.meta.env.VITE_BASE_URL}/frontend-metrics`, metrics);
        } catch (err) {
          console.error('Failed to send frontend metrics:', err.message);
        }
      };

      sendMetrics();
    };
  }, [location.pathname]);
};

export default useMetricsTracker;
