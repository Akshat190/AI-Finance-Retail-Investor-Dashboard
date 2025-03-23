import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  trend,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="text-gray-500">{title}</div>
        <div className="text-indigo-600">{icon}</div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-semibold text-gray-800">{value}</div>
        {trend && (
          <div className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? '↑' : '↓'} {trend === 'up' ? '+' : '-'}2.5%
          </div>
        )}
      </div>
    </div>
  );
};