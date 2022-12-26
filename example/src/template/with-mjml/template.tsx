import {
	Mjml,
	MjmlHead,
	MjmlTitle,
	MjmlPreview,
	MjmlBody,
	MjmlSection,
	MjmlColumn,
	MjmlButton,
	MjmlImage,
	MjmlRaw,
} from "@faire/mjml-react";
import { Each, createProps } from "postler";

export type TemplateProps = {
	label: string;
	img: string;
	items: Array<{ title: string }>;
};

let props = createProps<TemplateProps>();

export let Template = () => {
	return (
		<Mjml>
			<MjmlHead>
				<MjmlTitle>Last Minute Offer</MjmlTitle>
				<MjmlPreview>Last Minute Offer...</MjmlPreview>
			</MjmlHead>
			<MjmlBody width={500}>
				<MjmlSection fullWidth backgroundColor='#efefef'>
					<MjmlColumn>
						<MjmlImage src={`${props.img}`} />
					</MjmlColumn>
				</MjmlSection>
				<MjmlSection>
					<MjmlColumn>
						<MjmlButton
							padding='20px'
							backgroundColor='#346DB7'
							href='https://github.com/vulpo-dev/postler'
						>
							{props.label}
						</MjmlButton>
					</MjmlColumn>
				</MjmlSection>
				<MjmlRaw>
					<ul>
						<Each
							items={props.items}
							render={(item: { title: string }) => {
								return (
									<li>
										<p>{item.title}</p>
									</li>
								);
							}}
						/>
					</ul>
				</MjmlRaw>
			</MjmlBody>
		</Mjml>
	);
};
