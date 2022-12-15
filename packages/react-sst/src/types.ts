export type ToString = {
	toString: () => string;
};

export type PropProxy<T> = {
	[Property in keyof T]: T[Property];
};
