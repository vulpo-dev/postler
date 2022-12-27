import { Global, css } from "@emotion/react";

export let typography = css`
	@charset "UTF-8";

	html {
	  font-size: 100%;
	  -webkit-text-size-adjust: 100%;
	  -ms-text-size-adjust: 100%;
	}

	body {
	  line-height: 1.5;
	}

	body {
	  font-weight: 400;
	}

	h1, .h1,
	h2, .h2,
	h3, .h3,
	h4, .h4,
	h5, .h5,
	h6, .h6 {
	  margin-top: 0;
	  padding-top: 0;
	  padding-bottom: 0;
	  font-weight: bold;
	}

	h1, .h1 {
	  margin-bottom: 0.1875566421em;
	  font-size: 1.999396em;
	  line-height: 1.1253398526;
	}

	@media (min-width: 43.75em) {
	  h1, .h1 {
	    margin-bottom: 0.132642604em;
	    font-size: 2.827145944em;
	    line-height: 1.0611408323;
	  }
	}

	@media (min-width: 56.25em) {
	  h1, .h1 {
	    margin-bottom: 0.0938066507em;
	    font-size: 3.9975843648em;
	    line-height: 0.9380665066;
	  }
	}

	h2, .h2 {
	  margin-bottom: 0.2652050919em;
	  font-size: 1.414em;
	  line-height: 1.3260254597;
	}

	@media (min-width: 43.75em) {
	  h2, .h2 {
	    margin-bottom: 0.1875566421em;
	    font-size: 1.999396em;
	    line-height: 1.1253398526;
	  }
	}

	@media (min-width: 56.25em) {
	  h2, .h2 {
	    margin-bottom: 0.132642604em;
	    font-size: 2.827145944em;
	    line-height: 1.0611408323;
	  }
	}

	h3, .h3 {
	  margin-bottom: 0.2652050919em;
	  font-size: 1.414em;
	  line-height: 1.3260254597;
	}

	@media (min-width: 56.25em) {
	  h3, .h3 {
	    margin-bottom: 0.1875566421em;
	    font-size: 1.999396em;
	    line-height: 1.1253398526;
	  }
	}

	h4, .h4 {
	  margin-bottom: 0.2652050919em;
	  font-size: 1.414em;
	  line-height: 1.3260254597;
	}

	h5, .h5,
	h6, .h6 {
	  margin-bottom: 0.375em;
	  font-size: 1em;
	  line-height: 1.5;
	}

	p {
	  margin-top: 0;
	  margin-bottom: 1.5em;
	  padding-top: 0;
	  padding-bottom: 0;
	  max-width: 36em;
	}

	@media (min-width: 43.75em) {
	  p {
	    text-align: justify;
	  }
	}

	p + p {
	  margin-top: -1.5em;
	  text-indent: 1.5em;
	}

	small,
	.font-small {
	  font-size: 0.7072135785em;
	  line-height: 1.59075;
	}

	.font-italic,
	em {
	  font-style: italic;
	}

	.font-bold,
	strong {
	  font-weight: bold;
	}

	blockquote {
	  margin-top: 1.5em;
	  margin-bottom: 1.5em;
	  margin-left: 0;
	  padding-top: 0;
	  padding-bottom: 0;
	  padding-left: 1.5em;
	  border-left: 6px solid gray;
	  font-family: Georgia, "Times New Roman", serif;
	}

	blockquote p {
	  margin-bottom: 0.75em;
	}

	blockquote footer cite:before {
	  content: " – ";
	}

	pre,
	code {
	  font-family: "Lucida Console", Monaco, monospace;
	}

	time,
	.time {
	  text-transform: uppercase;
	}

	ol,
	ul,
	dl {
	  margin-top: 0;
	  margin-bottom: 1.5em;
	  margin-left: 1.5em;
	  padding-top: 0;
	  padding-bottom: 0;
	}

	ul ul,
	ol ol,
	dl dl {
	  margin-left: 0;
	  margin-bottom: 0;
	}

	ul {
	  list-style: disc;
	}

	ol {
	  list-style: decimal;
	}

	abbr {
	  font-variant: small-caps;
	  font-weight: 600;
	  text-transform: lowercase;
	}

	abbr[title]:hover {
	  cursor: help;
	}

	hr {
	  margin-top: 1.5em;
	  margin-bottom: 0;
	  border: none;
	  border-top-color: #000;
	  border-top-style: solid;
	  border-top-width: 1px;
	  padding-top: 1.4375em;
	}
`;

export let Typography = () => {
	return <Global styles={typography} />;
};
