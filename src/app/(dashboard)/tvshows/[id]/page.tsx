import TVShowDetail from 'views/tvshows/tvshow-detail';

export default async function TVShowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TVShowDetail id={id} />;
}
