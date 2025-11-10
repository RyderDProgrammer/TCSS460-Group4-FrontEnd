// TV show card component for list view
import { TVShow } from '@/types/tvShow.types';

interface TVShowCardProps {
  tvShow: TVShow;
  onClick?: (id: string) => void;
}

export default function TVShowCard({ tvShow, onClick }: TVShowCardProps) {
  return (
    <div onClick={() => onClick?.(tvShow.id)}>
      <h3>{tvShow.title}</h3>
      {/* TV show card content will be implemented here */}
      {/* Display some information and images */}
    </div>
  );
}
