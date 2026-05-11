import { LucideIcon } from 'lucide-react';

interface InsightCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
}

export function InsightCard({ title, value, icon: Icon, colorClass }: InsightCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors backdrop-blur-md">
      <div className={`p-4 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
