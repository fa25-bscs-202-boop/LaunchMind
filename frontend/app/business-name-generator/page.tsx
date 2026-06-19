import type { Metadata } from "next";
import { ToolLandingPage } from "../components/ToolLandingPage";
import { createMetadata } from "../../lib/seo";
import { toolPages } from "../../lib/seo-content";

const tool = toolPages.find((item) => item.path === "/business-name-generator")!;

export const metadata: Metadata = createMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: tool.path,
  keywords: tool.keywords,
});

export default function BusinessNameGeneratorPage() {
  return <ToolLandingPage tool={tool} />;
}
