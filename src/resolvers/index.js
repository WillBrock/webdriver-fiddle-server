const resolvers = {
	Query : {
		getTemplate : async (obj, { framework = `WebdriverIO`, template = `mocha` }, ctx) => {
			const all_files = [
				{
					name  : `tests`,
					type  : `folder`,
					path  : `./tests`,
					files : [
						{
							name  : `foo`,
							type  : `folder`,
							path  : `./tests/foo`,
							files : [
								{
									path    : `./tests/foo/bar-1.js`,
									name    : `bar-1.js`,
									content : `hello there`,
									type    : `file`,
									icon    : `js square`,
								},
							]
						},
						{
							path    : `./tests/test-1.js`,
							name    : `test-1.js`,
							content : `fooooooo`,
							type    : `file`,
							icon    : `js square`,
						},
						{
							path    : `./tests/test-2.js`,
							name    : `test-2.js`,
							content : `barrrrrr`,
							type    : `file`,
							icon    : `js square`,
						},
						{
							path    : `./tests/Register.page.js`,
							name    : `Register.page.js`,
							content : `bazzzzzzzzz`,
							type    : `file`,
							icon    : `js square`,
						},
					],
				},
				{
					path    : `./package.json`,
					name    : `package.json`,
					content : ``,
					type    : `file`,
					icon    : `node`,
				},
				{
					path  : `./wdio.conf.js`,
					name    : `wdio.conf.js`,
					content : ``,
					type    : `file`,
					icon    : `js square`,
				}
			];

			return {
				tree : JSON.stringify(all_files),
				flat : {},
			};
		},
	},

	Mutation : {
		saveFiles : async (obj, { data }, ctx) => {
			return true;
		},
	},
};

export default resolvers;
