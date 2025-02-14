import CafeDetails from "@/components/CafeDetails";

const CafeDetailsPage = async ({ params }: { params: { id: string } }) => {
  const resolvedParams = await params; 

  return <CafeDetails cafeId={resolvedParams.id} />;
};

export default CafeDetailsPage;
