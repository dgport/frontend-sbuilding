"use client";

import { useParams } from "next/navigation";
import ApartmentsList from "./_components/ApartList";

export default function Page() {
  const params = useParams();
  const buildingId = params.buildingID as string;
  const floorId = params.floorID as string;

  return <ApartmentsList buildingId={buildingId} floorId={floorId} />;
}
