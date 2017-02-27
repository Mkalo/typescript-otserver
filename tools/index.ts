import * as protobuf from 'protobufjs';
import * as path from 'path';
import { OTBLoader } from './formatConverters/OTB/OTBLoader';



protobuf.load("src/proto/item.proto", (err, root) => {
	if (err) throw err;

	const Item = root.lookupType("Item");

	const itemsFileName = path.join('data', 'items');
	console.log(itemsFileName);
	const otbLoader = new OTBLoader();
	otbLoader.loadItems(itemsFileName);

	const a = otbLoader.itemsByServerID.get(407);
	console.log(a);
	const message = Item.create({
		serverID: a.serverID
	});

	
	const buffer = Item.encode(message).finish();

	console.log(buffer);
});
