import styled from "@emotion/styled";
import { Document } from "postler";
import { Container, Row, Spacer } from "../../component/layout";
import { Typography } from "../../component/typography";
import { Button } from "../../component/button";

export let Template = () => {
	return (
		<Document>
			<Typography />
			<Body>
				<Container>
					<Row>
						<h1>Headline 1</h1>
						<h2>Headline 2</h2>
						<h3>Headline 3</h3>
						<h4>Headline 4</h4>
					</Row>
					<Row>
						<p>
							Lorem ipsum <small>dolor sit amet</small>, consectetur adipiscing
							elit. Cras et nisl nec felis placerat{" "}
							<strong>commodo dignissim rutrum orci</strong>. Suspendisse non
							convallis eros. Ut rutrum magna orci, at laoreet magna facilisis
							nec. Curabitur consequat urna id nisi molestie, ut auctor libero
							ullamcorper. Morbi ac gravida ligula. Aenean eget auctor neque,
							varius dictum nibh. Proin mi erat, maximus blandit est in,
							fringilla vulputate nisi. Nulla a erat imperdiet, ornare ante
							eget, tincidunt nunc. Sed ligula tortor, viverra vitae orci vel,
							fringilla tempor mauris. Phasellus laoreet maximus arcu, quis
							finibus lacus bibendum a. Duis nec augue ante. Maecenas dapibus
							mauris nec augue eleifend vestibulum. Donec commodo tortor ut
							ligula ullamcorper lobortis.
						</p>
						<p>
							Pellentesque at tortor dolor. Donec malesuada a lorem at iaculis.{" "}
							<em>Phasellus orci mauris</em>, pulvinar sed ligula et, sagittis
							imperdiet odio. Fusce et risus vitae risus rutrum sollicitudin sit
							amet sed elit. Proin vestibulum urna et mauris interdum, vehicula
							molestie ex feugiat. Aenean mollis, turpis ac tempor ornare, urna
							lectus accumsan velit, vitae fringilla nisl lacus volutpat lacus.
							Vivamus ut elit viverra, aliquet est at, sagittis odio.{" "}
						</p>
					</Row>
					<Row>
						<ul>
							<li>
								First Item
								<ul>
									<li>First Item</li>
									<li>Second Item</li>
									<li>Third Item</li>
									<li>Fourth Item</li>
								</ul>
							</li>
							<li>Second Item</li>
							<li>Third Item</li>
							<li>Fourth Item</li>
						</ul>
					</Row>
					<Row>
						<blockquote>
							<p>
								Proin vestibulum urna et mauris interdum, vehicula molestie ex
								feugiat. Aenean mollis, turpis ac tempor ornare, urna lectus
								accumsan velit, vitae fringilla nisl lacus volutpat lacus.
								Vivamus ut elit viverra, aliquet est at, sagittis odio.
							</p>
						</blockquote>
					</Row>
					<Spacer />
					<Row>
						<Button primary>Primary</Button>
						<Button>Left</Button>
						<Button align="center">Center</Button>
						<Button align="right">Right</Button>
					</Row>
				</Container>
			</Body>
		</Document>
	);
};

let Body = styled.body`
	margin: 0;
	font-family: sans-serif;

	.bold {
		font-weight: bold;
	}
`;
