import path from 'path';

const REPO_HOME     = path.resolve(__dirname, `../../repos`);
const TEMPLATE_HOME = path.resolve(__dirname, `../../templates`);

export const getRepoPath = (repo) => {
	if(!repo) {
		throw new Error(`No repo specified in getRepoPath`);
	}
	const repo_find = `${REPO_HOME}/${repo}`;
	const repo_path = path.resolve(__dirname, repo_find);

	return repo_path;
}
