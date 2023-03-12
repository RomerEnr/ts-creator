import minimist from "minimist";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
	copy,
	formatTargetDir,
	initializeGitRepository,
	pkgFromUserAgent,
	verifyFullPermissions,
} from "./utils";

const argv = minimist<{
	t?: string;
	type?: string;
	help?: string;
	h?: string;
}>(process.argv.slice(2), { string: ["_"] });
const cwd = process.cwd();

const renameFiles: Record<string, string | undefined> = {
	_gitignore: ".gitignore",
	_dockerignore: ".dockerignore",
	_eslintrc: ".eslintrc.cjs",
};

const defaultDir = "my-backend-project";