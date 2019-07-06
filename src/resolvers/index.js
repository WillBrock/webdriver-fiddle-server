
const resolvers = {
	Query : {
		getTemplate : async (obj, { framework = `WebdriverIO`, template = `mocha` }, ctx) => {
			const all_files = [
				{
					name  : `tests`,
					type  : `folder`,
					path  : `./`,
					files : [
						{
							path    : `./tests/test-1.js`,
							name    : `test-1.js`,
							content : `fooooooo`,
							type    : `file`,
							icon    : `js`,
						},
						{
							path    : `./tests/test-2.js`,
							name    : `test-2.js`,
							content : `barrrrrr`,
							type    : `file`,
							icon    : `js`,
						},
						{
							path    : `./tests/Register.page.js`,
							name    : `Register.page.js`,
							content : `bazzzzzzzzz`,
							type    : `file`,
							icon    : `js`,
						},
					],
				},
				{
					path    : `./`,
					name    : `package.json`,
					content : ``,
					type    : `file`,
					icon    : `node`,
				},
				{
					path  : `./`,
					name    : `wdio.conf.js`,
					content : ``,
					type    : `file`,
					icon    : `js`,
				}
			];
		},
	},

	Mutation : {
		saveFiles : async (obj, { data }, ctx) => {
			return true;
		},
	},
};

export default resolvers;
