import { runCli } from "./cli";
import { getPreviewDirectory } from "./utils/files";

let preview = getPreviewDirectory(process.cwd())
runCli(preview);
