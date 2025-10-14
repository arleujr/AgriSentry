import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface Sensor {
  id: string;
  name: string;
}

interface Actuator {
  id: string;
  name: string;
}

export function CreateRulePage() {
  const { environmentId } = useParams();
  const navigate = useNavigate();

  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [actuators, setActuators] = useState<Actuator[]>([]);
  
  const [name, setName] = useState('');
  const [triggerSensorId, setTriggerSensorId] = useState('');
  const [triggerCondition, setTriggerCondition] = useState('GREATER_THAN');
  const [triggerValue, setTriggerValue] = useState('');
  const [actionActuatorId, setActionActuatorId] = useState('');
  const [actionType, setActionType] = useState('TURN_ON');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadFormData() {
      if (!environmentId) return;
      try {
        const [sensorsResponse, actuatorsResponse] = await Promise.all([
          api.get(`/environments/${environmentId}/sensors`),
          api.get(`/environments/${environmentId}/actuators`),
        ]);
        setSensors(sensorsResponse.data);
        setActuators(actuatorsResponse.data);
      } catch (error) {
        alert('Falha ao carregar dados para o formulário.');
      }
    }
    loadFormData();
  }, [environmentId]);

  // Função envio do formulário
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const ruleData = {
        name,
        environment_id: environmentId,
        trigger_sensor_id: triggerSensorId,
        trigger_condition: triggerCondition,
        trigger_value: parseFloat(triggerValue),
        action_actuator_id: actionActuatorId,
        action_type: actionType,
      };

      await api.post('/rules', ruleData);

      alert('Regra criada com sucesso!');
      navigate(`/environments/${environmentId}`); 
    } catch (error) {
      alert('Erro ao criar a regra. Verifique os dados.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <Link to={`/environments/${environmentId}`} className="text-green-400 hover:text-green-300 mb-4 block">
        &larr; Voltar para o Ambiente
      </Link>
      <h1 className="text-3xl font-bold mb-8">Criar Nova Regra de Automação</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg space-y-4 max-w-2xl mx-auto">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nome da Regra</label>
          <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-green-500 focus:border-green-500" />
        </div>

        {/* Grupo "SE" */}
        <fieldset className="border border-gray-600 p-4 rounded-md">
          <legend className="px-2 font-semibold">SE (Gatilho)</legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select value={triggerSensorId} onChange={e => setTriggerSensorId(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md p-2">
              <option value="">Selecione um Sensor</option>
              {sensors.map(sensor => <option key={sensor.id} value={sensor.id}>{sensor.name}</option>)}
            </select>
            <select value={triggerCondition} onChange={e => setTriggerCondition(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md p-2">
              <option value="GREATER_THAN">For Maior Que</option>
              <option value="LESS_THAN">For Menor Que</option>
            </select>
            <input type="number" step="0.1" value={triggerValue} onChange={e => setTriggerValue(e.target.value)} required placeholder="Valor" className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" />
          </div>
        </fieldset>

        {/* Grupo "ENTÃO" */}
        <fieldset className="border border-gray-600 p-4 rounded-md">
          <legend className="px-2 font-semibold">ENTÃO (Ação)</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={actionType} onChange={e => setActionType(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md p-2">
              <option value="TURN_ON">Ligar</option>
              <option value="TURN_OFF">Desligar</option>
            </select>
            <select value={actionActuatorId} onChange={e => setActionActuatorId(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-md p-2">
              <option value="">Selecione um Atuador</option>
              {actuators.map(actuator => <option key={actuator.id} value={actuator.id}>{actuator.name}</option>)}
            </select>
          </div>
        </fieldset>
        
        <button type="submit" disabled={isLoading} className="w-full py-2 px-4 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed">
          {isLoading ? 'A Criar...' : 'Criar Regra'}
        </button>
      </form>
    </div>
  );
}