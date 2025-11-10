// Single movie detail page - uses mock data (not connected to API yet)
export default function MovieDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Movie Detail - ID: {params.id}</h1>
      {/* MovieDetail component will be imported here */}
    </div>
  );
}
