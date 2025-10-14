import { Link } from 'react-router-dom';
import { Thermometer, Droplets, Leaf, Sun, Trash2 } from 'lucide-react';

// Interfaces
interface Sensor {
  id: string;
  name: string;
  type: string;
  status: 'ACTIVE' | 'INACTIVE' | 'NO_DATA'; 
}
interface Reading {
  value: number;
}
interface SensorCardProps {
  sensor: Sensor;
  latestReading: Reading | null;
  onDelete: (id: string) => void;
}

// Mapeamento visual
const sensorVisuals = {
  TEMPERATURE: { icon: Thermometer, color: 'text-red-400' },
  HUMIDITY: { icon: Droplets, color: 'text-blue-400' },
  SOIL_MOISTURE: { icon: Leaf, color: 'text-green-400' },
  LUMINOSITY: { icon: Sun, color: 'text-yellow-400' },
  DEFAULT: { icon: Leaf, color: 'text-gray-400' },
};

export function SensorCard({ sensor, latestReading, onDelete }: SensorCardProps) {
  const visual = sensorVisuals[sensor.type as keyof typeof sensorVisuals] || sensorVisuals.DEFAULT;
  const Icon = visual.icon;

  function handleDeleteClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (window.confirm(`Tem a certeza que deseja excluir o sensor "${sensor.name}"?`)) {
      onDelete(sensor.id);
    }
  }

  const formattedValue = () => {
    if (latestReading === null) return '--';
    switch (sensor.type) {
      case 'TEMPERATURE': return `${latestReading.value.toFixed(1)} °C`;
      case 'HUMIDITY':
      case 'SOIL_MOISTURE': return `${latestReading.value.toFixed(0)} %`;
      case 'LUMINOSITY': return `${latestReading.value.toFixed(0)} lux`;
      default: return latestReading.value;
    }
  };

  const getStatusVisuals = () => {
    switch (sensor.status) {
      case 'ACTIVE':
        return { color: 'bg-green-500', text: 'Ativo', pulse: 'animate-pulse' };
      case 'INACTIVE':
        return { color: 'bg-yellow-500', text: 'Inativo', pulse: '' };
      default:
        return { color: 'bg-gray-500', text: 'Sem Dados', pulse: '' };
    }
  };
  const statusVisuals = getStatusVisuals();

  return (
    <Link to={`/sensors/${sensor.id}`} className="bg-gray-800 p-4 rounded-lg flex flex-col justify-between hover:bg-gray-700 transition-colors shadow-md">
      <div>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-white pr-2">{sensor.name}</h3>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 ${statusVisuals.color} rounded-full ${statusVisuals.pulse}`}></div>
              <span className="text-xs text-gray-400">{statusVisuals.text}</span>
            </div>
            <button onClick={handleDeleteClick} className="text-gray-500 hover:text-red-500"><Trash2 size={18} /></button>
          </div>
        </div>
        <p className={`text-sm ${visual.color}`}>{sensor.type}</p>
      </div>
      <div className="flex items-end justify-between mt-4">
        <span className="text-3xl font-light text-white">{formattedValue()}</span>
        <Icon className={`w-8 h-8 ${visual.color}`} />
      </div>
    </Link>
  );
}