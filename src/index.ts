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
	toValidPackageName
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

const main = () => {
	try {
		const argTargetDir = formatTargetDir(argv._[0]);
		const argTemplate = argv.type ?? argv.t;

		const targetDir = argTargetDir ?? defaultDir;

		const getProjectName = (): string => {
			targetDir === "." ? path.basename(path.resolve()) : targetDir;

			return targetDir;
		};

		const projectName = toValidPackageName(getProjectName());

		const root = path.join(cwd, targetDir);

		verifyFullPermissions(root);

		const template: string | undefined = argTemplate;
		const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);

		const pkgManager = pkgInfo ? pkgInfo.name : "npm";

		console.log(`\n Creating a new backend project in ${root}.\n`);

		const templateDir = path.resolve(
			fileURLToPath(import.meta.url),
			"../..",
			`template-${template}`
		);

		const write = (file: string, content?: string): void => {
			const targetPath = path.join(root, renameFiles[file] ?? file);
			if (content) {
				fs.writeFileSync(targetPath, content);
			} else {
				copy(path.join(templateDir, file), targetPath);
			}
		};

		const files = fs.readdirSync(templateDir);
		for (const file of files.filter((f) => f !== "package.json")) {
			write(file);
		}

		const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, "package.json"), "utf-8"));

		pkg.name = projectName;

		write("package.json", `${JSON.stringify(pkg, null, 2)}\n`);

		initializeGitRepository(root);

		const cdProjectName = path.relative(cwd, root);
		console.log("\nDone. Now run:\n");
		if (root !== cwd) {
			console.log(`  cd ${cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName}`);
		}

		switch (pkgManager) {
			case "yarn":
				console.log("  yarn");
				console.log("  yarn dev");
				break;
			default:
				console.log(`  ${pkgManager} install`);
				console.log(`  ${pkgManager} run dev`);
				break;
		}
		console.log();
	} catch (error) {
		console.error(error);
	}
};
main();
