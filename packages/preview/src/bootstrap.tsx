import { Routes, Route, Navigate } from "react-router-dom";

import { App } from "~/src/app";

let Bootstrap = () => {
	return (
		<Routes>
			<Route
				path='preview/*'
				element={<App />}
			/>
			<Route
				path='/'
				element={<Navigate to='preview' />}
			/>
		</Routes>
	);
};

export default Bootstrap;
