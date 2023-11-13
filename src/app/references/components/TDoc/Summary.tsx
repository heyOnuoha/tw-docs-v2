import { FunctionSignature } from "typedoc-better-json";
import { CodeBlock, InlineCode } from "../../../../components/Document/Code";
import { Paragraph } from "../../../../components/Document/Paragraph";
import { DocLink } from "../../../../components/Document/DocLink";
import { Lang } from "shiki";
import { UnorderedList } from "../../../../components/Document/List";
import { Heading } from "../../../../components/Document/Heading";

export function TypedocSummary(props: {
	summary: NonNullable<FunctionSignature["summary"]>;
}) {
	return (
		<>
			{props.summary.map((s) => {
				switch (s.type) {
					case "code": {
						return <CodeBlock lang={s.lang as Lang} code={s.value} />;
					}

					case "html":
					case "inlineCode": {
						return <InlineCode code={s.value} />;
					}

					case "link": {
						const isUrlNum = s.url.match(/^[0-9]+$/);

						// TODO - link to doc
						return (
							<DocLink href={isUrlNum ? "" : s.url}>
								<TypedocSummary summary={s.children} />
							</DocLink>
						);
					}

					case "paragraph": {
						return (
							<Paragraph>
								<TypedocSummary summary={s.children} />
							</Paragraph>
						);
					}

					case "text": {
						return <span> {s.value}</span>;
					}

					case "list": {
						return (
							<UnorderedList>
								<TypedocSummary summary={s.children} />
							</UnorderedList>
						);
					}

					case "listItem": {
						return (
							<li>
								<TypedocSummary summary={s.children} />
							</li>
						);
					}

					case "heading": {
						return (
							<Heading level={s.depth} id="">
								<TypedocSummary summary={s.children} />
							</Heading>
						);
					}

					case "strong":
					case "emphasis": {
						return (
							<em>
								<TypedocSummary summary={s.children} />
							</em>
						);
					}

					case "thematicBreak": {
						return <hr />;
					}

					default: {
						// when this happens, we need to add a new case to the switch
						console.warn(`Unknown summary type: ${s.type}`);
					}
				}
			})}
		</>
	);
}