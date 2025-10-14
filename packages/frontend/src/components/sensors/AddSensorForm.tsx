import { useState } from 'react';
import { api } from '../../services/api';

enum SensorType {
  TEMPERATURE = 'TEMPERATURE',
  HUMIDITY = 'HUMIDITY',
  SOIL_MOISTURE = 'SOIL_MOISTURE',
  LUMINOSITY = 'LUMINOSITY',
}

interface AddSensorFormProps {
  environmentId: string;
  onSuccess: () => void;
}

export function AddSensorForm({ environmentId, onSuccess }: AddSensorFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<SensorType>(SensorType.TEMPERATURE); 
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await api.post(`/environments/${environmentId}/sensors`, { name, type });
      alert('Sensor adicionado com sucesso!');
      onSuccess();
    } catch (error) {
      alert('Erro ao adicionar sensor.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="sensor-name" className="block text-sm font-medium text-gray-300">Nome do Sensor</label>
        <input id="sensor-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full mt-1 bg-gray-700 p-2 rounded-md" />
      </div>
      <div>
        <label htmlFor="sensor-type" className="block text-sm font-medium text-gray-300">Tipo de Sensor</label>
        <select id="sensor-type" value={type} onChange={e => setType(e.target.value as SensorType)} required className="w-full mt-1 bg-gray-700 p-2 rounded-md">
          {}
          {Object.values(SensorType).map(sensorType => (
            <option key={sensorType} value={sensorType}>{sensorType}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={isLoading} className="w-full py-2 bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-800">
        {isLoading ? 'A Adicionar...' : 'Adicionar Sensor'}
      </button>
    </form>
  );
}