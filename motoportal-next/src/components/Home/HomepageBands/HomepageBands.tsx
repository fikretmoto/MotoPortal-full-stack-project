import { getHomepageBands } from "@/services/catalog";
import HomepageBand from "./HomepageBand";

export default async function HomepageBands() {
  const bands = await getHomepageBands();

  return (
    <>
      {bands.map((band) => (
        <HomepageBand key={band.id} band={band} />
      ))}
    </>
  );
}