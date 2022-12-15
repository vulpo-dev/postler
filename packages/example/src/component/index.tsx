import styled from "@emotion/styled";

export let Body = styled.body`
	background-color: #f6f6f6;
	font-family: sans-serif;
	-webkit-font-smoothing: antialiased;
	font-size: 14px;
	line-height: 1.4;
	margin: 0;
	padding: 0;
	-ms-text-size-adjust: 100%;
	-webkit-text-size-adjust: 100%;

	@media (prefers-color-scheme: dark) {
		background-color: #111;
	}

	table {
		border-collapse: separate;
		mso-table-lspace: 0pt;
		mso-table-rspace: 0pt;
		width: 100%;
	}

	table td {
		font-family: sans-serif;
		font-size: 14px;
		vertical-align: top;
	}

	img {
		border: none;
		-ms-interpolation-mode: bicubic;
		max-width: 100%;
	}

	h1,
	h2,
	h3,
	h4 {
		color: #000000;
		font-family: sans-serif;
		font-weight: 400;
		line-height: 1.4;
		margin: 0;
		margin-bottom: 30px;
	}

	h1 {
		font-size: 35px;
		font-weight: 300;
		text-align: center;
		text-transform: capitalize;
	}

	p,
	ul,
	ol {
		font-family: sans-serif;
		font-size: 14px;
		font-weight: normal;
		margin: 0;
		margin-bottom: 15px;
	}
	p li,
	ul li,
	ol li {
		list-style-position: inside;
		margin-left: 5px;
	}

	a {
		color: #3498db;
		text-decoration: underline;
	}

	@media (prefers-color-scheme: dark) {
		h1,
		h2,
		h3,
		h4 {
			color: #eee;
		}
	}
`;

export let StyledBody = styled.table`
	width: 100%;
	border: 0;

	@media (prefers-color-scheme: dark) {
		background-color: #111;
	}
`;

export let Img = styled.img`
	border: none;
	-ms-interpolation-mode: bicubic;
	max-width: 100%;
`;

export let Container = styled.td`
	display: block;
	margin: 0 auto !important;
	padding-top: 80px;
	padding-bottom: 130px;
	width: 98%;
	max-width: 480px;
`;

export let Content = styled.div`
	box-sizing: border-box;
	display: block;
	margin: 0 auto;
	max-width: 480px;
	padding: 8px;
`;

export let Main = styled.table`
	background: #fff;
	border-radius: 8px;
	width: 100%;
	box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
	text-align: center;

	@media (prefers-color-scheme: dark) {
		background-color: #222;
	}
`;

export let Wrapper = styled.td`
	box-sizing: border-box;
	padding: 24px;
`;

export let ContentBlock = styled.td`
	padding-bottom: 8px;
	padding-top: 8px;
`;

export let Footer = styled.div`
	clear: both;
	margin-top: 8px;
	text-align: center;
	width: 100%;

	& td,
	& p,
	& span,
	& a {
		color: #999999;
		font-size: 12px;
		text-align: center;
	}
`;
