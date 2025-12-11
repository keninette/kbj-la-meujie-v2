"use client";

import { useEffect, useState } from "react";
import { useServices } from "@hooks/services.hook";
import { Adventure } from "@lib/adventure/adventure.entity";

export default function AdventuresList() {
  const { adventureService } = useServices();
  const [loading, setLoading] = useState(true);
  const [adventures, setAdventures] = useState<Adventure[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await adventureService.getAll();
        setAdventures(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [adventureService]); // Only loaded once, so we're safe

  return loading ? (
    <>Loading...</>
  ) : (
    <ul>
      {adventures.map((a) => (
        <li key={a.id}>{a.name}</li>
      ))}
    </ul>
  );
}
