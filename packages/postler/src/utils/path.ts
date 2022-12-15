import * as path from "path";

export function toRelativePath(src: string, file: string): Array<string> {
	let srcParts = src.split(path.sep);
	let fileParts = file.split(path.sep);
	return fileParts.slice(srcParts.length);
}
