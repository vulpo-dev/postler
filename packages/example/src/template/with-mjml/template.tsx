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
	MjmlText,
} from "@faire/mjml-react";
import { Each, createProps } from "postler";

export default {
	mjml: true,
};

export type Props = {
	label: string;
	img: string;
	items: Array<{ title: string }>;
};

export let Template = () => {
	let props = createProps<Props>();

	return (
		<Mjml>
			<MjmlHead>
				<MjmlTitle>Last Minute Offer</MjmlTitle>
				<MjmlPreview>Last Minute Offer...</MjmlPreview>
			</MjmlHead>
			<MjmlBody width={500}>
				<MjmlSection
					fullWidth
					backgroundColor='#efefef'
				>
					<MjmlColumn>
						<MjmlImage src={`${props.img}`} />
					</MjmlColumn>
				</MjmlSection>
				<MjmlSection>
					<MjmlColumn>
						<MjmlButton
							padding='20px'
							backgroundColor='#346DB7'
							href='https://www.wix.com/'
						>
							{props.label}
						</MjmlButton>
					</MjmlColumn>
				</MjmlSection>
				<MjmlSection>
					<Each
						items={props.items}
						render={(item: { title: string }) => {
							return (
								<MjmlColumn>
									<MjmlText>{item.title}</MjmlText>
								</MjmlColumn>
							);
						}}
					/>
				</MjmlSection>
			</MjmlBody>
		</Mjml>
	);
};
