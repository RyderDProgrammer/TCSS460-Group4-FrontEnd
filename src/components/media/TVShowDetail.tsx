// TV show detail component - displays all TV show information
import { TVShow } from '@/types/tvShow.types';

interface TVShowDetailProps {
  tvShow: TVShow;
}

export default function TVShowDetail({ tvShow }: TVShowDetailProps) {
  return (
    <div>
      <h1>{tvShow.title}</h1>
      {/* Display all TV show information including images */}
      {/* All fields from tvShow object should be displayed */}
    </div>
  );
}
