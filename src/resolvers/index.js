import fs from 'fs';
import { promisify } from 'util';
import directoryTree from 'directory-tree';

const readFile = promisify(fs.readFile);

const resolvers = {
	Query : {
		getTemplate : async (obj, { framework = `WebdriverIO`, template = `mocha` }, ctx) => {
			const default_active_file = `test-1.test.js`;
			const template_path       = `templates/${framework}/${template}`;
			const all                 = await directoryTree(template_path, { exclude : /node_modules/ });
			const regex               = new RegExp(`${template_path}/`);
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
				item.path = item.path.replace(regex, ``);
				delete item.children;
				delete item.size;

				if(item.type !== `directory`) {
					item.content = resolved[resolved_index];
					resolved_index++;
				}

				if(item.name === default_active_file) {
					item.active = true;
					item.open   = true;
				}

				item.icon = getIcon(icon_extension);

				return item;
			});

			flat.sort((a, b) => a.type > b.type ? 1 : ((b.type > a.type) ? -1 : 0));

			return flat;
		},

		getRepo : async (obj, {}, ctx) => {

		},
	},

	Mutation : {
		saveFiles : async (obj, { data }, ctx) => {
			return true;
		},
	},
};

export default resolvers;

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
