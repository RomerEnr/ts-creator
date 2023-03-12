import { accessSync, constants } from "fs";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const chop = (str: string) => str.replace(/\n$/, "");
export const exec = (cmd: string): string => chop(execSync(cmd).toString());

export function formatTargetDir(targetDir: string | undefined): string | undefined {
	return targetDir?.trim().replace(/\/+$/g, "");
}

export const copyDir = (srcDir: string, destDir: string): void => {
	fs.mkdirSync(destDir, { recursive: true });
	for (const file of fs.readdirSync(srcDir)) {
		const srcFile = path.resolve(srcDir, file);
		const destFile = path.resolve(destDir, file);
		copy(srcFile, destFile);
	}
};

export function copy(src: string, dest: string): void {
	const stat = fs.statSync(src);
	if (stat.isDirectory()) {
		copyDir(src, dest);
	} else {
		fs.copyFileSync(src, dest);
	}
}

export const toValidPackageName = (projectName: string): string => {
	return projectName
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/^[._]/, "")
		.replace(/[^a-z\d\-~]+/g, "-");
};

export const pkgFromUserAgent = (userAgent: string | undefined): any => {
	if (!userAgent) {
		return undefined;
	}
	const pkgSpec = userAgent.split(" ")[0];
	const pkgSpecArr = pkgSpec.split("/");

	return {
		name: pkgSpecArr[0],
		version: pkgSpecArr[1],
	};
};

export const verifyDirectory = (dir: string): void => {
	if (fs.existsSync(dir)) {
		console.error(` Error: Directory ${dir} already exists. Please choose a different name.`);
		process.exit(-1);
	}
};

export const initializeGitRepository = (root: string): void => {
	process.chdir(root);
	exec("git init");
	exec("cd ..");
};

export const verifyPermissions = (): void => {
	try {
		accessSync(".", constants.R_OK | constants.W_OK);
	} catch {
		console.log("No tienes permisos para escribir en la carpeta actual.");
		process.exit(-5);
	}
};

export const verifyFullPermissions = (root: string): void => {
	verifyDirectory(root);
	verifyPermissions();
};
