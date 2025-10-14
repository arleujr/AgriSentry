import { ArrowRight, Trash2 } from 'lucide-react'; 

interface Rule {
  id: string;
  name: string;
  trigger_condition: string;
  trigger_value: number;
  action_type: string;
  trigger_sensor: { name: string };
  action_actuator: { name: string };
}

interface RuleCardProps {
  rule: Rule;
  onDelete: (id: string) => void; 
}

const translateCondition = (condition: string) => {
  return condition === 'GREATER_THAN' ? '>' : '<';
};
const translateAction = (action: string) => {
  return action === 'TURN_ON' ? 'Ligar' : 'Desligar';
};

export function RuleCard({ rule, onDelete }: RuleCardProps) {
  function handleDeleteClick(event: React.MouseEvent) {
    event.stopPropagation();
    const isConfirmed = window.confirm(
      `Tem a certeza que deseja excluir a regra "${rule.name}"?`
    );
    if (isConfirmed) {
      onDelete(rule.id);
    }
  }

  return (
    <div className="relative bg-gray-800 p-4 rounded-lg shadow-md flex flex-col">
      {}
      <button
        onClick={handleDeleteClick}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors"
        aria-label="Excluir regra"
      >
        <Trash2 size={18} />
      </button>

      <h3 className="font-bold text-white mb-2 pr-6">{rule.name}</h3>

      <div className="flex items-center flex-wrap justify-center gap-x-2 text-center text-sm mt-2 p-2 bg-gray-900/50 rounded-md">
        <span className="text-gray-300">SE {rule.trigger_sensor.name}</span>
        <span className="font-bold text-green-400">
          {translateCondition(rule.trigger_condition)} {rule.trigger_value}
        </span>
        <ArrowRight className="w-4 h-4 text-gray-500" />
        <span className="text-gray-300">
          ENTÃO {translateAction(rule.action_type)}
        </span>
        <span className="text-gray-300">{rule.action_actuator.name}</span>
      </div>
    </div>
  );
}
