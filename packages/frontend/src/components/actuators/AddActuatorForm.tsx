import { useState } from 'react';
import { api } from '../../services/api';

enum ActuatorType {
  WATER_PUMP = 'WATER_PUMP',
  FAN = 'FAN',
  LIGHT = 'LIGHT',
}

interface AddActuatorFormProps {
  environmentId: string;
  onSuccess: () => void; 
}

export function AddActuatorForm({ environmentId, onSuccess }: AddActuatorFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<ActuatorType>(ActuatorType.WATER_PUMP);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await api.post(`/environments/${environmentId}/actuators`, { name, type });
      alert('Atuador adicionado com sucesso!');
      onSuccess(); 
    } catch (error) {
      alert('Erro ao adicionar atuador.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="actuator-name" className="block text-sm font-medium text-gray-300">Nome do Atuador</label>
        <input id="actuator-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full mt-1 bg-gray-700 p-2 rounded-md" />
      </div>
      <div>
        <label htmlFor="actuator-type" className="block text-sm font-medium text-gray-300">Tipo de Atuador</label>
        <select id="actuator-type" value={type} onChange={e => setType(e.target.value as ActuatorType)} required className="w-full mt-1 bg-gray-700 p-2 rounded-md">
          {Object.values(ActuatorType).map(actuatorType => (
            <option key={actuatorType} value={actuatorType}>{actuatorType}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={isLoading} className="w-full py-2 bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-800">
        {isLoading ? 'A Adicionar...' : 'Adicionar Atuador'}
      </button>
    </form>
  );
}