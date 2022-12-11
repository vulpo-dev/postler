import { useProps, If, Else, Document } from 'postler'

import { Button } from '../../component/button'
import {
	Body,
	StyledBody,
	Container,
	Main,
	Content,
	Footer,
	Wrapper,
    ContentBlock
} from '../../component/index'

export type Props = {
	title?: string,
	primary?: boolean,
}

export let Template = () => {
	let props = useProps<Props>()

	return (
		<Document>
			<Body>
				<StyledBody
					role="presentation"
					cellPadding="0"
					cellSpacing="0"
					className='body'
				>
					<tr>
					<td>&nbsp;</td>
					<Container className='container'>
						<Content className='content'>
							<Main role="presentation" className='main'>
								<tr>
									<Wrapper className='wrapper'>
										<table role="presentation" cellPadding="0" cellSpacing="0">
											<tr>
												<td>
													<If condition={props.title}>
														<h1>Title: { props.title }</h1>
													</If>
													<p>Hi there,</p>
													<p>Sometimes you just want to send a simple HTML email with a simple design and clear call to action. This is it.</p>
													<Button align='center' primary={props.primary}>
														<If condition={props.primary}>
															Primary

															<Else>
																Secondary
															</Else>
														</If>
													</Button>
													<p>This is a really simple email template. Its sole purpose is to get the recipient to click the button with no distractions.</p>
													<p>Good luck! Hope it works.</p>
												</td>
											</tr>
										</table>
									</Wrapper>
								</tr>
							</Main>

							<Footer className='footer'>
								<table role="presentation" cellPadding="0" cellSpacing="0">
									<tr>
										<ContentBlock>
											<span className="apple-link">Company Inc, 3 Abbey Road, San Francisco CA 94102</span>
											<br/> Don't like these emails? <a href="http://i.imgur.com/CScmqnj.gif">Unsubscribe</a>.
										</ContentBlock>
									</tr>
									<tr>
										<ContentBlock className="powered-by">
											Powered by <a href="http://htmlemail.io">HTMLemail</a>.
										</ContentBlock>
									</tr>
								</table>
							</Footer>
						</Content>
					</Container>
					<td>&nbsp;</td>
					</tr>
				</StyledBody>
			</Body>
		</Document>
	)
}