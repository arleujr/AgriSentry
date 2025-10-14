import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { User, Zap } from 'lucide-react';

interface Actuator {
  id: string;
  name: string;
  type: string;
  is_on: boolean;
  control_mode: 'MANUAL' | 'AUTOMATIC';
  environment_id: string;
}

interface ActuatorLog {
  id: string;
  action: 'TURNED_ON' | 'TURNED_OFF';
  triggered_by: 'MANUAL' | 'AUTOMATIC';
  created_at: string;
}

export function ActuatorDetailsPage() {
  const { actuatorId } = useParams<{ actuatorId: string }>();
  const [actuator, setActuator] = useState<Actuator | null>(null);
  const [logs, setLogs] = useState<ActuatorLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadActuatorData() {
      if (!actuatorId) return;
      setIsLoading(true);
      try {
        const [actuatorRes, logsRes] = await Promise.all([
          api.get(`/actuators/${actuatorId}`),
          api.get(`/actuators/${actuatorId}/logs`),
        ]);
        setActuator(actuatorRes.data);
        setLogs(logsRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados do atuador:", error);
        setActuator(null); 
      } finally {
        setIsLoading(false);
      }
    }
    loadActuatorData();
  }, [actuatorId]);

  if (isLoading) {
    return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center"><p>A carregar dados do atuador...</p></div>;
  }

  if (!actuator) {
    return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center"><p>Atuador não encontrado ou você não tem permissão.</p></div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <Link to={`/environments/${actuator.environment_id}`} className="text-green-400 hover:text-green-300 mb-4 block">
        &larr; Voltar para o Ambiente
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{actuator.name}</h1>
        <p className={`font-mono text-lg ${actuator.is_on ? 'text-green-400' : 'text-red-400'}`}>
          {actuator.is_on ? 'LIGADO' : 'DESLIGADO'}
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Linha do Tempo de Eventos</h2>
        <div className="space-y-4">
          {logs.length === 0 ? (
            <p className="text-gray-500">Nenhum evento registado para este atuador.</p>
          ) : (
            logs.map(log => (
              <div key={log.id} className="flex items-center bg-gray-800 p-3 rounded-md">
                <div className={`mr-4 p-2 rounded-full ${log.action === 'TURNED_ON' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {log.triggered_by === 'MANUAL' 
                    ? <User size={20} className="text-blue-400" />
                    : <Zap size={20} className="text-yellow-400" />
                  }
                </div>
                <div className="flex-grow">
                  <p className="font-semibold">
                    Atuador foi {log.action === 'TURNED_ON' ? 'LIGADO' : 'DESLIGADO'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Acionado por: {log.triggered_by === 'MANUAL' ? 'Ação Manual' : 'Automação'}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(log.created_at).toLocaleString('pt-BR')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}