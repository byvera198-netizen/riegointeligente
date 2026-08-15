import Dashboard from "./Dashboard";
import { requireChatGPTUser } from "./chatgpt-auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  await requireChatGPTUser("/");
  return <Dashboard />;
}
