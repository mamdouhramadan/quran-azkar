import { HomeRouteClient } from '@/components/home/HomeRouteClient';

// Page keeps the root route server-safe while delegating interactivity to a client component.
export default function Page() {
  return <HomeRouteClient />;
}
