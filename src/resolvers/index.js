import path          from 'path';
import fs            from 'fs';
import { promisify } from 'util';
import directoryTree from 'directory-tree';
import mkdir         from 'make-dir';

const readFile   = promisify(fs.readFile);
const writeFile  = promisify(fs.writeFile);
const rmdir      = promisify(fs.rmdir);
const renameFile = promisify(fs.rename);
const unlink     = promisify(fs.unlink);

const STATE_FILE    = `.file-state.json`;
const REPO_HOME     = path.resolve(__dirname, `../../repos`);
const TEMPLATE_HOME = path.resolve(__dirname, `../../templates`);

const resolvers = {
	Query : {
		getRepo : async (obj, { repo = null, framework = `webdriverio`, template = `mocha` }, ctx) => {
			console.log(repo);
			const repo_find = repo ? `${REPO_HOME}/${repo}` : `${TEMPLATE_HOME}/${framework}/${template}`;
			const repo_path = path.resolve(__dirname, repo_find);
			const flat      = await getCode(repo_path, !repo);

			return flat;
		},

		getHistory : async (obj, { user }, ctx) => {

		},

		searchPackages : async (obj, { search }, ctx) => {
			console.log(search, `search`)
			return [
				{
					id: `foo`,
					title: `bar`,
					version: `1.0.0`
				},
				{
					id: `blay`,
					title: `blah`,
					version: `5.0.0`
				}
			];
		}
	},

	Mutation : {
		saveFiles : async (obj, { repo, files }, ctx) => {
			// If the repo doesn't exist yet, create it
			if(!repo) {
				repo = createUrl();

				await mkdir(`${REPO_HOME}/${repo}`);

				// Save the creator of the repo to the db
			}

			const repo_directory = `${REPO_HOME}/${repo}`;
			const state_path     = `${repo_directory}/${STATE_FILE}`;

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

				if(is_directory) {
					await mkdir(current_path);
				}
				else if(new_file || file.updated) {
					await writeFile(current_path, file.content, `utf-8`);
				}
			}

			const state = files.filter(file => file.open).map(({ path, open, active }) => {
				return {
					path,
					open,
					active,
				};
			});

			await writeFile(state_path, JSON.stringify(state), `utf-8`);

			const flat = await getCode(repo_directory);

			return {
				repo,
				files : flat,
			};
		},

		importRepo : async (obj, { repo_url }, ctx) => {
			const repo_path = createUrl();

			// Do a git clone here for the repo
			/*
			await exec(`
				cd ${REPO_HOME}
				git clone ${repo_url} ${repo_path}
			`);
			*/

			return repo_path;
		}
	},
};

export default resolvers;

async function getCode(directory_path, template = false) {
	const all    = await directoryTree(directory_path, { exclude : /node_modules|.file-state.json/ });
	const regex  = new RegExp(`${directory_path}/`);
	const tmp    = await readFile(`${directory_path}/${STATE_FILE}`);
	const state  = JSON.parse(tmp);
	let tmp_flat = flattenTree(all.children);

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

		item.icon = getIcon(icon_extension);

		if(template) {
			item.updated = true;
		}

		const state_data = state.find((state_item) => state_item.path === item.path);
		if(state_data) {
			item = {...item, ...state_data};
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

function createUrl() {
	return Date.now().toString();
}
