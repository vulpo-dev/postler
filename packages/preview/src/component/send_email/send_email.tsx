import styled from "@emotion/styled";
import { FormEvent, useState } from "react";
import { Button } from "~/src/component/button";
import { Input } from "~/src/component/input";
import { useCurrentTemplate, usePost } from "~src/utils";
import {
	compileTemplate,
	useMarkup,
	usePreviewProps,
} from "~src/utils/template";

import { useHasConfigQuery } from "~src/store/email.slice";

export let SendEmail = () => {
	let template = useCurrentTemplate();
	let props = usePreviewProps(template);
	let markup = useMarkup(template);
	let { data } = useHasConfigQuery();

	let [state, trigger] = usePost("/api/email/send");
	let [email, setEmail] = useState("");

	let handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		let html = compileTemplate(markup, props?.props ?? {});

		let payload = {
			subject: `Test(${template}) ${props?.title}`,
			html,
			to: email,
		};

		trigger(payload);
	};

	let hasConfig = data?.hasConfig ?? false;
	let hasEmail = email !== "";
	let isDisabled = !hasConfig || !hasEmail;

	let buttonLabel = !hasConfig
		? "Invalid email setup"
		: !hasEmail
		? "Enter email"
		: "Send test email";

	return (
		<Form onSubmit={handleSubmit}>
			<section>
				<Input
					type='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</section>
			<Button
				title={buttonLabel}
				raised
				loading={state.state === "loading"}
				disabled={isDisabled}
			>
				Send Email
			</Button>
		</Form>
	);
};

let Form = styled.form`
	display: flex;
	gap: var(--size-2);
`;
