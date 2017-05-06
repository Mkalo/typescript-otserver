import { OTBLoader } from '../src/OTBLoader';
import { Items, Item } from '../src/Item';
import * as path from 'path';
import * as assert from 'assert';

describe('Item', () => {

    beforeEach(function () {
		const itemTestFilesDir = path.join(__dirname, '..', '..', 'test', 'itemsTestFiles');
        const otbLoader: OTBLoader = new OTBLoader();
		otbLoader.loadItems(path.join(itemTestFilesDir, 'items'));
    });

    describe('Create', () => {
        it('should return valid results', () => {
			assert(Item.create(407).isGround(), 'Item with id 407 is a ground.');
			assert(!Item.create("2148").isGround(), 'Item with id 2148 is not a ground.');
			assert(Item.create("black marble floor").isGround(), '"black marble floor" is a ground.');
			assert(Item.create("2148").getName() === "gold coin", 'Item with id 2148 is named "gold coin"');
        });
    });
});
