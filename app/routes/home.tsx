import type { Route } from "./+types/home";
import { OutboundMap } from "../components/OutboundMap";
import { Main } from "../components/Main"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Interactive Outbound Map" },
    { name: "description", content: "Interactive map of Outbound game locations and items" },
  ];
}

export default function Home() {
  return <Main />;
}
