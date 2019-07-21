import { promisify } from 'util';
import { exec } from 'child_process';
import WebSocket from 'ws';
import { getRepoPath } from '../helpers';

const socket_path  = `ws://localhost:4000/foo`;
const execp        = promisify(exec);
const docker_image = `chrome-ubuntu`;

export default async (obj, { repo, cli_args }, ctx) => {
	//const ws = new WebSocket(socket_path);
	//ctx.ws.send(`fooooooooooooobarrrrrr`);

	/*
	ws.on(`open`, (data) => {
		console.log(`open`, data);
	});

	ws.on(`message`, (data) => {
		console.log(`message`, data);
	});

	const repo_path = getRepoPath(repo);

	const command = `docker run --rm -v ${repo_path}:/repo ${docker_image} bash -c "cd repo && yarn && CHROMEDRIVER_FILEPATH=/chromedriver ./node_modules/.bin/wdio wdio.conf.js"`;
	console.log(command, `command`)
	const foo = await execp(command);
	console.log(foo, `the foo`);
	*/

	// Get the stuff to run the tests
	// e.g. specs, suites, config
	// Tringger the docker run

	// Get the container id some how
	// Store that in the db
	// Then a script checks if that container is still active
	// If so, then stream the results to the browser terminal

	return true;
}
