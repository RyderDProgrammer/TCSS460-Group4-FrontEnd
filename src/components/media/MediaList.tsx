// Shared media list component
import { ReactNode } from 'react';

interface MediaListProps {
  children: ReactNode;
  title?: string;
}

export default function MediaList({ children, title }: MediaListProps) {
  return (
    <div>
      {title && <h2>{title}</h2>}
      <div className="media-grid">
        {children}
      </div>
    </div>
  );
}
