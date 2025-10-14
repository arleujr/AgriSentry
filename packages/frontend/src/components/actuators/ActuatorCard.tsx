import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Lightbulb, Fan, Pipette, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Actuator {
  id: string;
  name: string;
  type: string;
  is_on: boolean;
  control_mode: 'MANUAL' | 'AUTOMATIC';
}

interface ActuatorCardProps {
  actuator: Actuator;
  onDelete: (id: string) => void;
}

const actuatorVisuals = {
  WATER_PUMP: { icon: Pipette, color: 'text-blue-400' },
  FAN: { icon: Fan, color: 'text-gray-400' },
  LIGHT: { icon: Lightbulb, color: 'text-yellow-400' },
  DEFAULT: { icon: Pipette, color: 'text-gray-400' },
};

export function ActuatorCard({ actuator, onDelete }: ActuatorCardProps) {
  const [actuatorState, setActuatorState] = useState(actuator);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setActuatorState(actuator);
  }, [actuator]);

  const visual = actuatorVisuals[actuatorState.type as keyof typeof actuatorVisuals] || actuatorVisuals.DEFAULT;
  const Icon = visual.icon;
  const isManualMode = actuatorState.control_mode === 'MANUAL';

  async function handleToggle(event: React.MouseEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.patch(`/actuators/${actuatorState.id}/toggle`);
      setActuatorState(response.data);
    } catch {
      alert("Não foi possível alterar o estado do atuador.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleModeChange(event: React.MouseEvent) {
    event.preventDefault();
    const newMode = isManualMode ? 'AUTOMATIC' : 'MANUAL';
    try {
      const response = await api.patch(`/actuators/${actuatorState.id}/mode`, { mode: newMode });
      setActuatorState(response.data);
    } catch {
      alert('Falha ao alterar o modo de controlo.');
    }
  }

  function handleDeleteClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const isConfirmed = window.confirm(`Tem a certeza que deseja excluir o atuador "${actuator.name}"?`);
    if (isConfirmed) {
      onDelete(actuator.id);
    }
  }

  return (
    <Link to={`/actuators/${actuator.id}`}>
      <div className="bg-gray-800 p-4 rounded-lg flex flex-col justify-between shadow-md h-full hover:bg-gray-700 transition-colors">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-white pr-2">{actuatorState.name}</h3>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Icon className={`w-6 h-6 ${visual.color}`} />
              <button onClick={handleDeleteClick} className="text-gray-500 hover:text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <p className={`text-sm font-mono ${visual.color}`}>{actuatorState.type}</p>
        </div>

        <div className="flex items-center justify-center space-x-2 my-4">
          <span className={isManualMode ? 'text-white font-semibold' : 'text-gray-500'}>Manual</span>
          <button
            onClick={handleModeChange}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${!isManualMode ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${!isManualMode ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
          <span className={!isManualMode ? 'text-white font-semibold' : 'text-gray-500'}>Automático</span>
        </div>

        <button
          onClick={handleToggle}
          disabled={isLoading || !isManualMode}
          className={`w-full py-2 px-4 font-semibold text-white rounded-md transition-colors ${
            actuatorState.is_on ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          } disabled:bg-gray-600 disabled:cursor-not-allowed`}
        >
          {isLoading ? 'Aguarde...' : actuatorState.is_on ? 'Desligar' : 'Ligar'}
        </button>
      </div>
    </Link>
  );
}
