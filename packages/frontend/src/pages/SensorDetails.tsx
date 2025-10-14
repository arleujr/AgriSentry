import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer // Responsivo está ativo
} from 'recharts';

interface Sensor {
  id: string;
  name: string;
  type: string;
  environment_id: string;
  created_at: string;
}

interface SensorReading {
  id: string;
  value: number;
  created_at: string;
}

export function SensorDetailsPage() {
  const { sensorId } = useParams<{ sensorId: string }>();
  const [sensor, setSensor] = useState<Sensor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [readings, setReadings] = useState<SensorReading[]>([]);

  useEffect(() => {
    async function loadSensorData() {
      try {
        const [sensorResponse, readingsResponse] = await Promise.all([
          api.get(`/sensors/${sensorId}`),
          api.get(`/sensors/${sensorId}/readings`)
        ]);
        setSensor(sensorResponse.data);
        setReadings(readingsResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados do sensor:", error);
        alert("Não foi possível carregar os dados deste sensor.");
      } finally {
        setIsLoading(false);
      }
    }

    loadSensorData();
  }, [sensorId]);

  const chartData = readings.map(reading => ({
    name: new Date(reading.created_at).toLocaleTimeString('pt-BR'),
    valor: reading.value
  }));

  if (isLoading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p>Carregando dados do sensor...</p>
      </div>
    );
  }

  if (!sensor) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p>Sensor não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <Link
        to={`/environments/${sensor.environment_id}`}
        className="text-green-400 hover:text-green-300 mb-4 block"
      >
        &larr; Voltar para o Ambiente
      </Link>

      <h1 className="text-3xl font-bold mb-2">{sensor.name}</h1>
      <p className="text-gray-400 uppercase mb-8">{sensor.type}</p>

      <div style={{ height: '384px', width: '100%' }}>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Nenhuma leitura registrada ainda.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="name" stroke="#A0AEC0" />
              <YAxis stroke="#A0AEC0" />
              <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: 'none' }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#48BB78"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
