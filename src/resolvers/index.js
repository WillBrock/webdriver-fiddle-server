import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import directoryTree from 'directory-tree';
import mkdir         from 'make-dir';

const readFile   = promisify(fs.readFile);
const writeFile  = promisify(fs.writeFile);
const rmdir      = promisify(fs.rmdir);
const renameFile = promisify(fs.rename);
const unlink     = promisify(fs.unlink);

const REPO_HOME     = path.resolve(__dirname, `../../repos`);
const TEMPLATE_HOME = path.resolve(__dirname, `../../templates`);

const resolvers = {
	Query : {
		getRepo : async (obj, { repo, framework = `WebdriverIO`, template = `mocha` }, ctx) => {
			const repo_find = repo ? `${REPO_HOME}/${repo}` : `${TEMPLATE_HOME}/${framework}/${template}`;
			let repo_path   = path.resolve(__dirname, repo_find);
			const flat      = await getCode(repo_path, !!repo);

			return flat;
		},
	},

	Mutation : {
		saveFiles : async (obj, { repo, files }, ctx) => {
			// If the repo doesn't exist yet, create it
			if(!repo) {
				repo = Date.now().toString();

				await mkidr(`${REPO_HOME}/${repo}`);
			}

			const repo_directory = `${REPO_HOME}/${repo}`;

			// Store the state of the files in the db, could maybe be just a json string
			// This would have the previous open and active at the last save state
			console.log(repo);
			console.log(files);

			// Sort by directories first
			files.sort((a, b) => a.type > b.type ? 1 : ((b.type > a.type) ? -1 : 0));

			for(const file of files) {
				const is_directory  = file.type === `directory`;
				const new_file      = file.new;
				const name_change   = file.name !== file.original_name && !new_file;
				const current_path  = `${repo_directory}/${file.path}`;
				const original_path = `${repo_directory}/${file.original_path}`;

				// Nothing to do if the file didn't change
				// Just need this data for saving the state of the open tabs and active file
				if(!file.updated && !file.deleted) {
					continue;
				}

				if(file.deleted && is_directory) {
					await rmdir(current_path);
				}
				else if(file.deleted) {
					await unlink(current_path)
				}

				if(name_change) {
					await renameFile(original_path, current_path);
				}

				if(new_file && is_directory) {
					await mkdir(current_path);
				}
				else if(new_file || file.updated) {
					await writeFile(current_path, file.content, `utf-8`);
				}
			}

			const flat = await getCode(repo_directory);

			return {
				repo,
				files : flat,
			};
		},
	},
};

export default resolvers;

async function getCode(directory_path, template = false) {
	const default_active_file = `test-1.test.js`;
	const all                 = await directoryTree(directory_path, { exclude : /node_modules/ });
	const regex               = new RegExp(`${directory_path}/`);
	let tmp_flat              = flattenTree(all.children);

	const file_promises = [];
	for(const item of tmp_flat) {
		if(item.type === `directory`) {
			continue;
		}

		file_promises.push(readFile(item.path, `utf-8`));
	}

	const resolved = await Promise.all(file_promises);

	let resolved_index = 0;
	const flat = tmp_flat.map((item) => {
		const icon_extension = item.type === `directory` ? item.type : item.extension;
		item.path            = item.path.replace(regex, ``);

		delete item.children;
		delete item.size;

		item.original_name = item.name;
		item.original_path = item.path;

		if(item.type !== `directory`) {
			item.content = resolved[resolved_index];
			resolved_index++;
		}

		if(item.name === default_active_file) {
			item.active = true;
			item.open   = true;
		}

		item.icon = getIcon(icon_extension);

		if(template) {
			item.updated = true;
		}

		return item;
	});

	flat.sort((a, b) => a.type > b.type ? 1 : ((b.type > a.type) ? -1 : 0));

	return flat;
}

function flattenTree(tree, files = []) {
	for(const branch of tree) {
		const type = branch.type;

		files.push(branch);

		if(type === `directory`) {
			flattenTree(branch.children, files);
		}
	}

	return files;
}

function getIcon(extension) {
	const extension_map = {
		directory : `folder outline`,
		js        : `square js`,
		json      : `node`,
		lock      : `node`,
	};
	extension = extension.replace(/\./, ``);

	if(!extension_map[extension]) {
		throw new Error(`Icon not found for ${extension}`);
	}

	return extension_map[extension];
}
