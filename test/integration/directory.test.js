let chai = require('chai');
let expect = chai.expect;

describe('Check the migration config by default', function () {

    before(() => {
        // do something
    });

    after(() => {
        // do something
    });

    it('The config.migration must exist after the hook sails is started', () => {
        expect(sails.config.repository).to.not.be.undefined;
    });

    it('The default migrate directory must be "[appPath]/api/migration"', () => {
        expect(sails.config.repository.dir).to.equal('./api/repositories/');
    });

    it('The default migrate status must be enable true', () => {
        expect(sails.config.repository.fixtureEnabled).to.be.true;
    });

    it('The default migrate status must be enable true', () => {
        expect(sails.config.repository.autogen).to.be.true;
    });
});
