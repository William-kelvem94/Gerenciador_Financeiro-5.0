import React from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Menu,
  Search,
  Bell,
  User,
  Home,
  Wallet,
  Layers,
  BarChart2,
  Settings,
  LogOut,
} from 'lucide-react';

type IconName =
  | 'DollarSign'
  | 'TrendingUp'
  | 'TrendingDown'
  | 'FileText'
  | 'Menu'
  | 'Search'
  | 'Bell'
  | 'User'
  | 'Home'
  | 'Wallet'
  | 'Layers'
  | 'BarChart2'
  | 'Settings'
  | 'LogOut';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number }>;

const map: Record<IconName, IconComponent> = {
  DollarSign: DollarSign,
  TrendingUp: TrendingUp,
  TrendingDown: TrendingDown,
  FileText: FileText,
  Menu: Menu,
  Search: Search,
  Bell: Bell,
  User: User,
  Home: Home,
  Wallet: Wallet,
  Layers: Layers,
  BarChart2: BarChart2,
  Settings: Settings,
  LogOut: LogOut,
};

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 18, className, ...rest }) => {
  const Comp = map[name];
  return <Comp size={size} className={className} {...(rest as React.SVGProps<SVGSVGElement>)} />;
};

export type { IconName };

export default Icon;
