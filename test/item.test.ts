import { OTBLoader } from '../src/OTB-loader';
import { Items, Item } from '../src/item';
import * as path from 'path';

describe('Item', () => {

    beforeEach(function () {
		const itemTestFilesDir = path.join(__dirname, '..', '..', 'test', 'itemsTestFiles');
        const otbLoader: OTBLoader = new OTBLoader();
		otbLoader.loadItems(path.join(itemTestFilesDir, 'items'));
    });

    describe('Create', () => {
        it('should return valid results', () => {
			if (Item.create(407).isGround() !== true) throw Error('Item with id 407 is a ground.');
			if (Item.create("2148").isGround() !== false) throw Error('Item with id 2148 is not a ground.');
			if (Item.create("black marble floor").isGround() !== true) throw Error('"black marble floor" is a ground.');
			if (Item.create("2148").getName() !== "gold coin") throw Error('Item with id 2148 is named "gold coin"');
        });
    });
});
