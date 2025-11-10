// Sidebar component
import { ReactNode } from 'react';

interface SidebarProps {
  children?: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  return (
    <aside>
      {children}
    </aside>
  );
}
