/**
 * This is a basic setup with mocha and chai
 */
describe(`Foobar Test`, () => {
	it(`should test something`, () => {
		browser.url(`https://webdriver.io`);
		
		expect(1).to.equal(1);
	});
});
