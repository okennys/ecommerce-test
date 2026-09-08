import { SectionPage, sectionStaticParams, sectionMetadata } from "@/lib/plp-route";

export const generateStaticParams = () => sectionStaticParams("mulher");
export const generateMetadata = (props: { params: Promise<{ path?: string[] }> }) =>
  sectionMetadata("mulher", props.params);

export default function Page(props: {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <SectionPage section="mulher" params={props.params} searchParams={props.searchParams} />;
}
