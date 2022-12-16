import "open-props/open-props.min.css";
import "@biotic-ui/leptons/style/base.css";
import "./style.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import Bootstrap from "~/src/bootstrap";
import { Store } from "~/src/store";
import { Provider } from "react-redux";

let container = document.getElementById("root");

if (container) {
	let root = createRoot(container);

	root.render(
		<BrowserRouter>
			<Provider store={Store}>
				<Bootstrap />
			</Provider>
		</BrowserRouter>,
	);
}
