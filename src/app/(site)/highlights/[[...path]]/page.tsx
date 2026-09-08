import { SectionPage, sectionStaticParams, sectionMetadata } from "@/lib/plp-route";

export const generateStaticParams = () => sectionStaticParams("highlights");
export const generateMetadata = (props: { params: Promise<{ path?: string[] }> }) =>
  sectionMetadata("highlights", props.params);

export default function Page(props: {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <SectionPage section="highlights" params={props.params} searchParams={props.searchParams} />;
}
