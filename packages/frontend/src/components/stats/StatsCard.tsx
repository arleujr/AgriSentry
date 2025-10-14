import { type LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

// Define os tipos de dados que este componente espera
interface Stats {
  _avg: number | null;
  _max: number | null;
  _min: number | null;
}

interface StatsCardProps {
  title: string;
  stats: Stats;
  unit: string;
  // Aceita um componente de ícone como propriedade
  Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

// Função auxiliar para formatar os números
const formatValue = (value: number | null, unit: string) => {
  if (value === null) return '--';
  return `${value.toFixed(1)} ${unit}`;
};

export function StatsCard({ title, stats, unit, Icon }: StatsCardProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center">
      <div className="mr-4">
        <Icon className="w-10 h-10 text-green-400" />
      </div>
      <div className="flex-grow">
        <h3 className="text-gray-400 font-bold">{title}</h3>
        <div className="flex justify-between items-baseline mt-2">
          <div className="text-center">
            <span className="text-xs text-gray-500">MÍN</span>
            <p className="text-lg font-semibold text-white">{formatValue(stats._min, unit)}</p>
          </div>
          <div className="text-center">
            <span className="text-xs text-gray-500">MÉDIA</span>
            <p className="text-2xl font-bold text-green-400">{formatValue(stats._avg, unit)}</p>
          </div>
          <div className="text-center">
            <span className="text-xs text-gray-500">MÁX</span>
            <p className="text-lg font-semibold text-white">{formatValue(stats._max, unit)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}