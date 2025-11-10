// Single TV show detail page - uses mock data (not connected to API yet)
export default function TVShowDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>TV Show Detail - ID: {params.id}</h1>
      {/* TVShowDetail component will be imported here */}
    </div>
  );
}
