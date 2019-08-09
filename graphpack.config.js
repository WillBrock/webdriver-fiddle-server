const WebSocket = require(`ws`);
const path      = require(`path`);
const { exec }  = require(`child_process`);

const REPO_HOME = path.resolve(__dirname, `./repos`);

const wss = new WebSocket.Server({ port : 12221 });
wss.on(`connection`, (ws) => {
	ws.on(`message`, (request) => {
		const {
			action,
			repo
		} = JSON.parse(request);

		ws.send(`Starting tests...\n`);

		console.log(repo, `repo..`)

		const docker_image = `chrome-ubuntu`;
		const repo_find    = `${REPO_HOME}/${repo}`;
		const repo_path    = path.resolve(__dirname, repo_find);

		const command = `docker run --rm -v ${repo_path}:/repo ${docker_image} bash -c "cd repo && yarn && FORCE_COLOR=1 CHROMEDRIVER_FILEPATH=/chromedriver ./node_modules/.bin/wdio wdio.conf.js"`;
		console.log(command)
		const child   = exec(command, {
			shell : `bash`,
			stdio : `inherit`,
		});

		child.stdout.on(`data`, (data) => {
			console.log(data)
			ws.send(`\n${data}`);
		});
	});

	ws.on(`close`, () => {
		console.log(`Socket closed`);
	});
});
