import MovieDetail from 'views/movies/movie-detail';

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MovieDetail id={id} />;
}
