//import Home from '../classes/Home.page';

describe(`Homepage`, () => {
	before(() => {
		//Home.open();
	});

	it(`should check page title`, () => {
		browser.url(`https://google.com`);
		browser.pause(2000);
		//expect(Home.pageTitle.getText()).to.equal(`WebdriverIO`);
	});

	it(`should check project title`, () => {
		//expect(Home.projectTitle.getText()).to.equal(`Webdriver I/O`);
	});
});
