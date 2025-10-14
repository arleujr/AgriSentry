import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { EnvironmentCard } from '../components/environments/EnvironmentCard';
import { io } from 'socket.io-client';

interface LatestReading {
  id: string;
  value: number;
}
interface SensorWithLatestReading {
  id: string;
  type: string;
  readings: LatestReading[];
}
interface EnvironmentData {
  id: string;
  name: string;
  description: string | null;
  sensors: SensorWithLatestReading[];
  _count: { sensors: number };
}

export function DashboardPage() {
  const { signOut } = useAuth();
  const [environments, setEnvironments] = useState<EnvironmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadDashboardData() {
    try {
      const response = await api.get('/dashboard');
      setEnvironments(response.data);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    loadDashboardData().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:3333');
    socket.on('new_reading', (newReading) => {
      setEnvironments(prevEnvs => {
        return prevEnvs.map(env => {
          const sensorIndex = env.sensors.findIndex(s => s.id === newReading.sensor_id);
          if (sensorIndex !== -1) {
            const newSensors = [...env.sensors];
            newSensors[sensorIndex] = { ...newSensors[sensorIndex], readings: [newReading] };
            return { ...env, sensors: newSensors };
          }
          return env;
        });
      });
    });

    return () => { socket.disconnect(); };
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Painel de Monitoramento</h1>
          <p className="text-gray-400">Resumo dos seus ambientes conectados</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/environments/new"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            + Novo Ambiente
          </Link>
          <button
            onClick={signOut}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sair
          </button>
        </div>
      </header>

      <main>
        {isLoading ? (
          <p>A carregar dashboard...</p>
        ) : environments.length === 0 ? (
          <p>Você ainda não cadastrou nenhum ambiente.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {environments.map(env => (
              <EnvironmentCard key={env.id} environment={env} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
