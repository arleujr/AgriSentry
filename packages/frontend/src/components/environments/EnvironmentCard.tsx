import { Link } from 'react-router-dom';
import { Trash2, Thermometer, Droplets, Leaf } from 'lucide-react';

// Interfaces para os dados ricos que vêm do endpoint /dashboard
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

interface EnvironmentCardProps {
  environment: EnvironmentData;
  onDelete: (id: string) => void;
}

export function EnvironmentCard({ environment, onDelete }: EnvironmentCardProps) {
  // Função para extrair a última leitura de um tipo de sensor
  const getLatestReading = (type: string): string => {
    const sensor = environment.sensors.find(s => s.type === type);
    if (sensor && sensor.readings && sensor.readings.length > 0) {
      const reading = sensor.readings[0];
      if (type === 'TEMPERATURE') return `${reading.value.toFixed(1)}`;
      return `${reading.value.toFixed(0)}`;
    }
    return '--';
  };

  const temp = getLatestReading('TEMPERATURE');
  const humidity = getLatestReading('HUMIDITY');
  const soilMoisture = getLatestReading('SOIL_MOISTURE');

  function handleDeleteClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (window.confirm(`Tem a certeza que deseja excluir o ambiente "${environment.name}"?`)) {
      onDelete(environment.id);
    }
  }
  
  return (
    <Link to={`/environments/${environment.id}`} className="relative block bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors">
      <h2 className="text-xl font-semibold mb-2 text-white">{environment.name}</h2>
      <p className="text-gray-400 text-sm mb-4">{environment._count.sensors} sensores</p>
      
      <div className="space-y-2 text-gray-300">
        <div className="flex items-center text-sm"><Thermometer size={16} className="mr-2 text-red-400" /> Temp. Ar: <span className="font-semibold ml-auto">{temp}°C</span></div>
        <div className="flex items-center text-sm"><Droplets size={16} className="mr-2 text-blue-400" /> Umid. Ar: <span className="font-semibold ml-auto">{humidity}%</span></div>
        <div className="flex items-center text-sm"><Leaf size={16} className="mr-2 text-green-400" /> Umid. Solo: <span className="font-semibold ml-auto">{soilMoisture}%</span></div>
      </div>
      
      <button 
        onClick={handleDeleteClick}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full"
        aria-label="Excluir ambiente"
      >
        <Trash2 size={20} />
      </button>
    </Link>
  );
}