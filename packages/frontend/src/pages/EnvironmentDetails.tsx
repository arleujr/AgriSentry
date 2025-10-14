import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { SensorCard } from '../components/sensors/SensorCard';
import { ActuatorCard } from '../components/actuators/ActuatorCard';
import { RuleCard } from '../components/rules/RuleCard';
import { io } from 'socket.io-client';
import { Modal } from '../components/shared/Modal';
import { AddSensorForm } from '../components/sensors/AddSensorForm';
import { AddActuatorForm } from '../components/actuators/AddActuatorForm';
import { StatsCard } from '../components/stats/StatsCard';
import { Thermometer, Leaf, Droplets } from 'lucide-react'; 

// --- Interfaces ---
interface Environment {
  id: string;
  name: string;
  description: string | null;
}
interface Sensor {
  id: string;
  name: string;
  type: string;
  status: 'ACTIVE' | 'INACTIVE' | 'NO_DATA';
}
interface Actuator {
  id: string;
  name: string;
  type: string;
  is_on: boolean;
  control_mode: 'MANUAL' | 'AUTOMATIC';
}
interface Reading {
  id: string;
  value: number;
  sensor_id: string;
}
interface Rule {
  id: string;
  name: string;
  trigger_condition: string;
  trigger_value: number;
  action_type: string;
  trigger_sensor: { name: string };
  action_actuator: { name: string };
}
interface StatsData {
  temperature: { _avg: number | null; _max: number | null; _min: number | null; };
  humidity: { _avg: number | null; _max: number | null; _min: number | null; };
  soil_moisture: { _avg: number | null; _max: number | null; _min: number | null; };
}
// --------------------

export function EnvironmentDetailsPage() {
  const { environmentId } = useParams<{ environmentId: string }>();
  const [environment, setEnvironment] = useState<Environment | null>(null);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [actuators, setActuators] = useState<Actuator[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [readings, setReadings] = useState<Record<string, Reading>>({});
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddSensorModalOpen, setIsAddSensorModalOpen] = useState(false);
  const [isAddActuatorModalOpen, setIsAddActuatorModalOpen] = useState(false);

  async function loadData() {
    try {
      if (!environmentId) return;
      const [envRes, sensorsRes, actuatorsRes, rulesRes, statsRes] = await Promise.all([
        api.get(`/environments/${environmentId}`),
        api.get(`/environments/${environmentId}/sensors`),
        api.get(`/environments/${environmentId}/actuators`),
        api.get(`/environments/${environmentId}/rules`),
        api.get(`/environments/${environmentId}/stats`),
      ]);
      
      setEnvironment(envRes.data);
      setSensors(sensorsRes.data);
      setActuators(actuatorsRes.data);
      setRules(rulesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      alert("Não foi possível carregar os dados.");
    }
  }

  useEffect(() => {
    setIsLoading(true);
    loadData().finally(() => setIsLoading(false));
  }, [environmentId]);

  useEffect(() => {
    const socket = io('http://localhost:3333');
    socket.on('new_reading', (newReading: Reading) => {
      setReadings(prev => ({ ...prev, [newReading.sensor_id]: newReading }));
    });
    socket.on('actuator_toggled', (updatedActuator: Actuator) => {
      setActuators(prev => prev.map(actuator => actuator.id === updatedActuator.id ? updatedActuator : actuator));
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  function handleSensorAdded() {
    setIsAddSensorModalOpen(false);
    loadData();
  }
  function handleActuatorAdded() {
    setIsAddActuatorModalOpen(false);
    loadData();
  }
  async function handleDeleteSensor(id: string) {
    await api.delete(`/sensors/${id}`);
    loadData();
  }
  async function handleDeleteActuator(id: string) {
    await api.delete(`/actuators/${id}`);
    loadData();
  }
  async function handleDeleteRule(id: string) {
    await api.delete(`/rules/${id}`);
    loadData();
  }

  if (isLoading) {
    return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center"><p>Carregando...</p></div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8 space-y-8">
      <div>
        <Link to="/dashboard" className="text-green-400 hover:text-green-300 mb-4 block">&larr; Voltar para o Dashboard</Link>
        <h1 className="text-3xl font-bold">{environment?.name || 'Carregando nome...'}</h1>
        <p className="text-gray-400">{environment?.description || 'Sem descrição.'}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Estatísticas (Últimas 24h)</h2>
        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatsCard title="Temperatura" stats={stats.temperature} unit="°C" Icon={Thermometer} />
            <StatsCard title="Humidade do Ar" stats={stats.humidity} unit="%" Icon={Droplets} />
            <StatsCard title="Humidade do Solo" stats={stats.soil_moisture} unit="%" Icon={Leaf} />
          </div>
        ) : (
          <p className="text-gray-500">A carregar estatísticas...</p>
        )}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Sensores</h2>
          <button onClick={() => setIsAddSensorModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">+ Adicionar Sensor</button>
        </div>
        {sensors.length === 0 ? <p className="text-gray-500">Nenhum sensor cadastrado.</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sensors.map(sensor => <SensorCard key={sensor.id} sensor={sensor} latestReading={readings[sensor.id] || null} onDelete={handleDeleteSensor} />)}
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Atuadores</h2>
          <button onClick={() => setIsAddActuatorModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">+ Adicionar Atuador</button>
        </div>
        {actuators.length === 0 ? <p className="text-gray-500">Nenhum atuador cadastrado.</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {actuators.map(actuator => <ActuatorCard key={actuator.id} actuator={actuator} onDelete={handleDeleteActuator} />)}
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Regras de Automação</h2>
          <Link to={`/environments/${environmentId}/rules/new`} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">+ Nova Regra</Link>
        </div>
        {rules.length === 0 ? <p className="text-gray-500">Nenhuma regra cadastrada.</p> : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {rules.map(rule => <RuleCard key={rule.id} rule={rule} onDelete={handleDeleteRule} />)}
          </div>
        )}
      </div>

      <Modal isOpen={isAddSensorModalOpen} onClose={() => setIsAddSensorModalOpen(false)} title="Adicionar Novo Sensor">
        <AddSensorForm environmentId={environmentId!} onSuccess={handleSensorAdded} />
      </Modal>
      <Modal isOpen={isAddActuatorModalOpen} onClose={() => setIsAddActuatorModalOpen(false)} title="Adicionar Novo Atuador">
        <AddActuatorForm environmentId={environmentId!} onSuccess={handleActuatorAdded} />
      </Modal>
    </div>
  );
}