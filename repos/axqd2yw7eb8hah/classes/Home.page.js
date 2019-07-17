import Page from './Page';

class Home extends Page {
	open(path = `/`) {
		super(path);
	}

	get headerTitle()  { return $(`.headerTtile`) }
	get projectTitle() { return $(`.projectTitle`) }
}

export default new Home();
