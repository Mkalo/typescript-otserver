export enum NodeType {
	Start = 0xFE,
	End = 0xFF,
	Escape = 0xFD
};

export enum FluidType {
	Empty,
	Water,
	Blood,
	Beer,
	Slime,
	Lemonade,
	Milk,
	Mana,
	Life,
	Oil,
	Urine,
	CoconutMilk,
	Wine,
	Mud,
	FruitJuice,
	Lava,
	Rum,
	Swamp
};

export enum CorpseType {
	None,
	Venom,
	Blood,
	Undead,
	Fire,
	Energy
};

export enum FloorChangeDirection {
	None,
	Up,
	Down,
	North,
	South,
	West,
	East
};

export enum ItemGroup {
	None = 0,
	Ground,
	Container,
	Weapon,
	Ammunition,
	Armor,
	Charges,
	Teleport,
	MagicField,
	Writeable,
	Key,
	Splash,
	Fluid,
	Door,
	Deprecated,
	Depot,
	Mailbox,
	TrashHolder,
	Bed
};

export enum LocationType {
	Container,
	Slot,
	Ground
};

export enum SlotType {
	None,
	Head,
	Neck,
	Back,
	Armor,
	Right,
	Left,
	Legs,
	Feet,
	Ring,
	Ammo,
	Depot, // Internal only
	TwoHanded, // Internal only
	First = Head,
	Last = Ammo
};

export enum ProjectileType {
	Spear = 1,
	Bolt = 2,
	Arrow = 3,
	Fire = 4,
	Energy = 5,
	PoisonArrow = 6,
	BurstArrow = 7,
	ThrowingStar = 8,
	ThrowingKnife = 9,
	SmallStone = 10,
	Death = 11,
	LargeRock = 12,
	Snowball = 13,
	PowerBolt = 14,
	PoisonField = 15,
	InfernalBolt = 16,
	HuntingSpear = 17,
	EnchantedSpear = 18,
	RedStar = 19,
	GreenStar = 20,
	RoyalSpear = 21,
	SniperArrow = 22,
	OnyxArrow = 23,
	PiercingBolt = 24,
	WhirlwindSword = 25,
	WhirlwindAxe = 26,
	WhirlwindClub = 27,
	EtherealSpear = 28,
	Ice = 29,
	Earth = 30,
	Holy = 31,
	SuddenDeath = 32,
	FlashArrow = 33,
	FlamingArrow = 34,
	ShiverArrow = 35,
	EnergyBall = 36,
	SmallIce = 37,
	SmallHoly = 38,
	SmallEarth = 39,
	EarthArrow = 40,
	Explosion = 41,
	Cake = 42,
	//for internal use, dont send to client
	None = 255,
	Unknown = 0xFFFF
};

export enum ServerPacketType {
	Disconnect = 0x0A,
	MessageOfTheDay = 0x14,
	CharacterList = 0x64,

	SelfAppear = 0x0A,
	GMAction = 0x0B,
	ErrorMessage = 0x14,
	FyiMessage = 0x15,
	WaitingList = 0x16,
	Ping = 0x1E,
	Death = 0x28,
	CanReportBugs = 0x32,
	MapDescription = 0x64,
	MapSliceNorth = 0x65,
	MapSliceEast = 0x66,
	MapSliceSouth = 0x67,
	MapSliceWest = 0x68,
	TileUpdate = 0x69,
	TileAddThing = 0x6A,
	TileTransformThing = 0x6B,
	TileRemoveThing = 0x6C,
	CreatureMove = 0x6D,
	ContainerOpen = 0x6E,
	ContainerClose = 0x6F,
	ContainerAddItem = 0x70,
	ContainerUpdateItem = 0x71,
	ContainerRemoveItem = 0x72,
	InventorySetSlot = 0x78,
	InventoryClearSlot = 0x79,
	ShopWindowOpen = 0x7A,
	ShopSaleGoldCount = 0x7B,
	ShopWindowClose = 0x7C,
	SafeTradeRequestAck = 0x7D,
	SafeTradeRequestNoAck = 0x7E,
	SafeTradeClose = 0x7F,
	WorldLight = 0x82,
	Effect = 0x83,
	AnimatedText = 0x84,
	Projectile = 0x85,
	CreatureSquare = 0x86,
	CreatureHealth = 0x8C,
	CreatureLight = 0x8D,
	CreatureOutfit = 0x8E,
	CreatureSpeed = 0x8F,
	CreatureSkull = 0x90,
	CreatureShield = 0x91,
	ItemTextWindow = 0x96,
	HouseTextWindow = 0x97,
	PlayerStatus = 0xA0,
	PlayerSkillsUpdate = 0xA1,
	PlayerFlags = 0xA2,
	CancelTarget = 0xA3,
	CreatureSpeech = 0xAA,
	ChannelList = 0xAB,
	ChannelOpen = 0xAC,
	ChannelOpenPrivate = 0xAD,
	RuleViolationOpen = 0xAE,
	RuleViolationRemove = 0xAF,
	RuleViolationCancel = 0xB0,
	RuleViolationLock = 0xB1,
	PrivateChannelCreate = 0xB2,
	ChannelClosePrivate = 0xB3,
	TextMessage = 0xB4,
	PlayerWalkCancel = 0xB5,
	FloorChangeUp = 0xBE,
	FloorChangeDown = 0xBF,
	OutfitWindow = 0xC8,
	VipState = 0xD2,
	VipLogin = 0xD3,
	VipLogout = 0xD4,
	QuestList = 0xF0,
	QuestPartList = 0xF1,
	ShowTutorial = 0xDC,
	AddMapMarker = 0xDD,
};

export enum ClientPacketType {
	LoginServerRequest = 0x01,
	GameServerRequest = 0x0A,
	Logout = 0x14,
	ItemMove = 0x78,
	ShopBuy = 0x7A,
	ShopSell = 0x7B,
	ShopClose = 0x7C,
	ItemUse = 0x82,
	ItemUseOn = 0x83,
	ItemRotate = 0x85,
	LookAt = 0x8C,
	PlayerSpeech = 0x96,
	ChannelList = 0x97,
	ClientChannelOpen = 0x98,
	ChannelClose = 0x99,
	Attack = 0xA1,
	Follow = 0xA2,
	CancelMove = 0xBE,
	ItemUseBattlelist = 0x84,
	ContainerClose = 0x87,
	ContainerOpenParent = 0x88,
	TurnNorth = 0x6F,
	TurnWest = 0x70,
	TurnSouth = 0x71,
	TurnEast = 0x72,
	AutoWalk = 0x64,
	AutoWalkCancel = 0x69,
	MoveNorth = 0x65,
	MoveEast = 0x66,
	MoveSouth = 0x67,
	MoveWest = 0x68,
	MoveNorthEast = 0x6A,
	MoveSouthEast = 0x6B,
	MoveSouthWest = 0x6C,
	MoveNorthWest = 0x6D,
	VipAdd = 0xDC,
	VipRemove = 0xDD,
	RequestOutfit = 0xD2,
	ChangeOutfit = 0xD3,
	Ping = 0x1E,
	FightModes = 0xA0,
	ContainerUpdate = 0xCA,
	TileUpdate = 0xC9,
	PrivateChannelOpen = 0x9A,
	NpcChannelClose = 0x9E,
};

export enum TextMessageType {
	ConsoleRed = 0x12, //Red message in the console
	ConsoleOrange = 0x13, //Orange message in the console
	ConsoleOrange2 = 0x14, //Orange message in the console
	Warning = 0x15, //Red message in game window and in the console
	EventAdvance = 0x16, //White message in game window and in the console
	EventDefault = 0x17, //White message at the bottom of the game window and in the console
	StatusDefault = 0x18, //White message at the bottom of the game window and in the console
	DescriptionGreen = 0x19, //Green message in game window and in the console
	StatusSmall = 0x1A, //White message at the bottom of the game window"
	ConsoleBlue = 0x1B, //Blue message in the console
};

export enum SpeechType {
	Say = 0x01,	//normal talk
	Whisper = 0x02,	//whispering - #w text
	Yell = 0x03,	//yelling - #y text
	PrivatePlayerToNPC = 0x04, //Player-to-NPC speaking(NPCs channel)
	PrivateNPCToPlayer = 0x05, //NPC-to-Player speaking
	Private = 0x06, //Players speaking privately to players
	ChannelYellow = 0x07,	//Yellow message in chat
	ChannelWhite = 0x08, //White message in chat
	RuleViolationReport = 0x09, //Reporting rule violation - Ctrl+R
	RuleViolationAnswer = 0x0A, //Answering report
	RuleViolationContinue = 0x0B, //Answering the answer of the report
	Broadcast = 0x0C,	//Broadcast a message - #b
	ChannelRed = 0x0D,	//Talk red on chat - #c
	PrivateRed = 0x0E,	//Red private - @name@ text
	ChannelOrange = 0x0F,	//Talk orange on text
	//SPEAK_                = 0x10, //?
	ChannelRedAnonymous = 0x11,	//Talk red anonymously on chat - #d
	//SPEAK_MONSTER_SAY12 = 0x12, //?????
	MonsterSay = 0x13,	//Talk orange
	MonsterYell = 0x14,	//Yell orange
};

export enum ChatChannel {
	Guild = 0x00,
	Party = 0x01,
	//?Gamemaster = 0x01,
	Tutor = 0x02,
	RuleReport = 0x03,
	Game = 0x05,
	Trade = 0x06,
	TradeRook = 0x07,
	RealLife = 0x08,
	Help = 0x09,
	OwnPrivate = 0x0E,
	Custom = 0xA0,
	Custom1 = 0xA1,
	Custom2 = 0xA2,
	Custom3 = 0xA3,
	Custom4 = 0xA4,
	Custom5 = 0xA5,
	Custom6 = 0xA6,
	Custom7 = 0xA7,
	Custom8 = 0xA8,
	Custom9 = 0xA9,
	Private = 0xFFFF,
	None = 0xAAAA
};

export enum TextColor {
	Blue = 5,
	Green = 30,
	LightBlue = 35,
	Crystal = 65,
	Purple = 83,
	Platinum = 89,
	LightGrey = 129,
	DarkRed = 144,
	Red = 180,
	Orange = 198,
	Gold = 210,
	White = 215,
	None = 255
};

export enum PlayerFlags {
	None = 0,
	Poisoned = 1 << 0,
	Burning = 1 << 1,
	Electrified = 1 << 2,
	Drunk = 1 << 3,
	ManaShield = 1 << 4,
	Paralyze = 1 << 5,
	Hasted = 1 << 6,
	InBattle = 1 << 7,
	Drowning = 1 << 8,
	Freezing = 1 << 9,
	Dazzled = 1 << 10,
	Cursed = 1 << 11,
	Strengthened = 1 << 12,
	CannotLogoutOrEnterProtectionZone = 1 << 13,
	WithinProtectionZone = 1 << 14
};

export enum StateType {
	Regeneration
};

export enum Effect {
	RedSpark = 1,
	BlueRings = 2,
	Puff = 3,
	YellowSpark = 4,
	ExplosionArea = 5,
	ExplosionDamage = 6,
	FireArea = 7,
	YellowRings = 8,
	GreenRings = 9,
	BlackSpark = 10,
	Teleport = 11,
	EnergyDamage = 12,
	BlueShimmer = 13,
	RedShimmer = 14,
	GreenShimmer = 15,
	FirePlume = 16,
	GreenSpark = 17,
	MortArea = 18,
	GreenNotes = 19,
	RedNotes = 20,
	PoisonArea = 21,
	YellowNotes = 22,
	PurpleNotes = 23,
	BlueNotes = 24,
	WhiteNotes = 25,
	Bubbles = 26,
	Dice = 27,
	GiftWraps = 28,
	FireworkYellow = 29,
	FireworkRed = 30,
	FireworkBlue = 31,
	Stun = 32,
	Sleep = 33,
	WaterCreature = 34,
	Groundshaker = 35,
	Hearts = 36,
	FireAttack = 37,
	EnergyArea = 38,
	SmallClouds = 39,
	HolyDamage = 40,
	BigClouds = 41,
	IceArea = 42,
	IceTornado = 43,
	IceAttack = 44,
	Stones = 45,
	SmallPlants = 46,
	Carniphilia = 47,
	PurpleEnergy = 48,
	YellowEnergy = 49,
	HolyArea = 50,
	BigPlants = 51,
	Cake = 52,
	GiantIce = 53,
	WaterSplash = 54,
	PlantAttack = 55,
	TutorialArrow = 56,
	TutorialSquare = 57,
	MirrorHorizontal = 58,
	MirrorVerticle = 59,
	SkullHorizontal = 60,
	SkullVertical = 61,
	Assassin = 62,
	StepsHorizontal = 63,
	BloodySteps = 64,
	StepsVertical = 65,
	YalahariGhost = 66,
	Bats = 67,
	Smoke = 68,
	None = 0xFF
};

export class LightLevel {
	None = 0;
	Torch = 7;
	Full = 27;
	World = 255;
};

export class LightColor {
	None = 0;
	Default = 206; // default light color
	Orange = 206;
	White = 215;
};

export enum Direction {
	North,
	East,
	South,
	West,
	NorthEast,
	SouthEast,
	NorthWest,
	SouthWest
};

export enum Skull {
	None = 0,
	Yellow = 1,
	Green = 2,
	White = 3,
	Red = 4,
	Black = 5
};

export enum Party {
	None = 0,
	Host = 1,
	Guest = 2,
	Member = 3,
	Leader = 4,
	MemberSharedExp = 5,
	LeaderSharedExp = 6,
	MemberSharedExpInactive = 7,
	LeaderSharedExpInactive = 8,
	MemberNoSharedExp = 9,
	LeaderNoSharedExp = 10
};

export enum WarIcon {
	None = 0,
	Blue = 1,
	Green = 2,
	Red = 3
};

export enum Gender {
	Male,
	Female
};

// TODO: dynamic?
export enum Vocation {
	None
};

export enum FightMode {
	FullAttack = 1,
	Balanced = 2,
	FullDefense = 3
};

export enum FluidColor {
	Empty = 0,
	Blue = 1,
	Red = 2,
	Brown = 3,
	Green = 4,
	Yellow = 5,
	White = 6,
	Purple = 7
};

export enum Fluid {
	Empty,
	Water,
	Blood,
	Beer,
	Slime,
	Lemonade,
	Milk,
	Mana,
	Life,
	Oil,
	Urine,
	CoconutMilk,
	Wine,
	Mud,
	FruitJuice,
	Lava,
	Rum,
	Swamp
};

export enum WeaponType {
	None,
	Sword,
	Club,
	Axe,
	Shield,
	Distance,
	Wand,
	Ammunition
};

export enum AmmoType {
	None,
	Bolt,
	Arrow,
	Spear,
	ThrowingStar,
	ThrowingKnife,
	Stone,
	Snowball
};

export const AmmoTypeNames = {
	"spear": AmmoType.Spear,
	"bolt": AmmoType.Bolt,
	"arrow": AmmoType.Arrow,
	"poisonarrow": AmmoType.Arrow,
	"burstarrow": AmmoType.Arrow,
	"throwingstar": AmmoType.ThrowingStar,
	"throwingknife": AmmoType.ThrowingKnife,
	"smallstone": AmmoType.Stone,
	"largerock": AmmoType.Stone,
	"snowball": AmmoType.Snowball,
	"powerbolt": AmmoType.Bolt,
	"infernalbolt": AmmoType.Bolt,
	"huntingspear": AmmoType.Spear,
	"enchantedspear": AmmoType.Spear,
	"royalspear": AmmoType.Spear,
	"sniperarrow": AmmoType.Arrow,
	"onyxarrow": AmmoType.Arrow,
	"piercingbolt": AmmoType.Bolt,
	"etherealspear": AmmoType.Spear,
	"flasharrow": AmmoType.Arrow,
	"flammingarrow": AmmoType.Arrow,
	"shiverarrow": AmmoType.Arrow,
	"eartharrow": AmmoType.Arrow,
};

export enum ItemFlag {
	BlocksSolid = 1,
	BlocksProjectile = 2,
	BlocksPathFinding = 4,
	HasHeight = 8,
	Useable = 16,
	Pickupable = 32,
	Moveable = 64,
	Stackable = 128,
	FloorChangeDown = 256,
	FloorChangeNorth = 512,
	FloorChangeEast = 1024,
	FloorChangeSouth = 2048,
	FloorChangeWest = 4096,
	AlwaysOnTop = 8192,
	Readable = 16384,
	Rotatable = 32768,
	Hangable = 65536,
	Vertical = 131072,
	Horizontal = 262144,
	CannotDecay = 524288,
	AllowDistanceRead = 1048576,
	Unused = 2097152,
	ClientCharges = 4194304,
	LookThrough = 8388608,
	Animated = 1 << 24
};

export enum OtbmNodeType {
	Root = 1,
	MapData = 2,
	ItemDef = 3,
	TileArea = 4,
	Tile = 5,
	Item = 6,
	TileSquare = 7,
	TileRef = 8,
	Spawns = 9,
	SpawnArea = 10,
	Monster = 11,
	Towns = 12,
	Town = 13,
	HouseTile = 14,
	WayPoints = 15,
	WayPoint = 16
}

export enum OtbmAttribute {
	Description = 1,
	ExtFile = 2,
	TileFlags = 3,
	ActionId = 4,
	UniqueId = 5,
	Text = 6,
	Desc = 7,
	TeleportDestination = 8,
	Item = 9,
	DepotId = 10,
	ExtSpawnFile = 11,
	RuneCharges = 12,
	ExtHouseFile = 13,
	HouseDoorId = 14,
	Count = 15,
	Duration = 16,
	DecayingState = 17,
	WrittenDate = 18,
	WrittenBy = 19,
	SleeperId = 20,
	SleepStart = 21,
	Charges = 22
}

export enum TileFlags {
	TILESTATE_NONE = 0,

	TILESTATE_FLOORCHANGE_DOWN = 1 << 0,
	TILESTATE_FLOORCHANGE_NORTH = 1 << 1,
	TILESTATE_FLOORCHANGE_SOUTH = 1 << 2,
	TILESTATE_FLOORCHANGE_EAST = 1 << 3,
	TILESTATE_FLOORCHANGE_WEST = 1 << 4,
	TILESTATE_FLOORCHANGE_SOUTH_ALT = 1 << 5,
	TILESTATE_FLOORCHANGE_EAST_ALT = 1 << 6,
	TILESTATE_PROTECTIONZONE = 1 << 7,
	TILESTATE_NOPVPZONE = 1 << 8,
	TILESTATE_NOLOGOUT = 1 << 9,
	TILESTATE_PVPZONE = 1 << 10,
	TILESTATE_TELEPORT = 1 << 11,
	TILESTATE_MAGICFIELD = 1 << 12,
	TILESTATE_MAILBOX = 1 << 13,
	TILESTATE_TRASHHOLDER = 1 << 14,
	TILESTATE_BED = 1 << 15,
	TILESTATE_DEPOT = 1 << 16,
	TILESTATE_BLOCKSOLID = 1 << 17,
	TILESTATE_BLOCKPATH = 1 << 18,
	TILESTATE_IMMOVABLEBLOCKSOLID = 1 << 19,
	TILESTATE_IMMOVABLEBLOCKPATH = 1 << 20,
	TILESTATE_IMMOVABLENOFIELDBLOCKPATH = 1 << 21,
	TILESTATE_NOFIELDBLOCKPATH = 1 << 22,
	TILESTATE_SUPPORTS_HANGABLE = 1 << 23,

	TILESTATE_FLOORCHANGE = TILESTATE_FLOORCHANGE_DOWN | TILESTATE_FLOORCHANGE_NORTH | TILESTATE_FLOORCHANGE_SOUTH | TILESTATE_FLOORCHANGE_EAST | TILESTATE_FLOORCHANGE_WEST | TILESTATE_FLOORCHANGE_SOUTH_ALT | TILESTATE_FLOORCHANGE_EAST_ALT,
};

export enum TileFlag {
	None = 0,
	ProtectionZone = 1 << 0,
	DeprecatedHouse = 1 << 1,
	NoPvpZone = 1 << 2,
	NoLogout = 1 << 3,
	PvpZone = 1 << 4,
	Refresh = 1 << 5,

	//internal usage
	House = 1 << 6,
	FloorChange = 1 << 7,
	FloorChangeDown = 1 << 8,
	FloorChangeNorth = 1 << 9,
	FloorChangeSouth = 1 << 10,
	FloorChangeEast = 1 << 11,
	FloorChangeWest = 1 << 12,
	Teleport = 1 << 13,
	MagicField = 1 << 14,
	Mailbox = 1 << 15,
	TrashHolder = 1 << 16,
	Bed = 1 << 17,
	BlocksSolid = 1 << 18,
	BlocksPath = 1 << 19,
	ImmoveableBlocksSolid = 1 << 20,
	ImmoveableBlocksPath = 1 << 21,
	ImmoveableNoFieldBlocksPath = 1 << 22,
	NoFieldBlocksPath = 1 << 23,
	Dynamic = 1 << 24
}

export enum ItemAttribute {
	ServerId = 0x10,
	ClientId,
	Name,				/*deprecated*/
	Description,			/*deprecated*/
	Speed,
	Slot,				/*deprecated*/
	MaxItems,			/*deprecated*/
	Weight,			/*deprecated*/
	Weapon,			/*deprecated*/
	Ammunition,				/*deprecated*/
	Armor,			/*deprecated*/
	MagicLevel,			/*deprecated*/
	MagicFieldType,		/*deprecated*/
	Writeable,		/*deprecated*/
	RotateTo,			/*deprecated*/
	Decay,			/*deprecated*/
	SpriteHash,
	MiniMapColor,
	Attr07,
	Attr08,
	Light,

	//1-byte aligned
	Decay2,			/*deprecated*/
	Weapon2,			/*deprecated*/
	Ammunition2,				/*deprecated*/
	Armor2,			/*deprecated*/
	Writeable2,		/*deprecated*/
	Light2,
	TopOrder,
	Writeable3		/*deprecated*/
};

export enum GameState {
	Startup,
	Init,
	Normal,
	Closed,
	Shutdown,
	Closingg,
	Maintain
};

export enum TileFlag {
	TILESTATE_NONE = 0,

	TILESTATE_FLOORCHANGE_DOWN = 1 << 0,
	TILESTATE_FLOORCHANGE_NORTH = 1 << 1,
	TILESTATE_FLOORCHANGE_SOUTH = 1 << 2,
	TILESTATE_FLOORCHANGE_EAST = 1 << 3,
	TILESTATE_FLOORCHANGE_WEST = 1 << 4,
	TILESTATE_FLOORCHANGE_SOUTH_ALT = 1 << 5,
	TILESTATE_FLOORCHANGE_EAST_ALT = 1 << 6,
	TILESTATE_PROTECTIONZONE = 1 << 7,
	TILESTATE_NOPVPZONE = 1 << 8,
	TILESTATE_NOLOGOUT = 1 << 9,
	TILESTATE_PVPZONE = 1 << 10,
	TILESTATE_TELEPORT = 1 << 11,
	TILESTATE_MAGICFIELD = 1 << 12,
	TILESTATE_MAILBOX = 1 << 13,
	TILESTATE_TRASHHOLDER = 1 << 14,
	TILESTATE_BED = 1 << 15,
	TILESTATE_DEPOT = 1 << 16,
	TILESTATE_BLOCKSOLID = 1 << 17,
	TILESTATE_BLOCKPATH = 1 << 18,
	TILESTATE_IMMOVABLEBLOCKSOLID = 1 << 19,
	TILESTATE_IMMOVABLEBLOCKPATH = 1 << 20,
	TILESTATE_IMMOVABLENOFIELDBLOCKPATH = 1 << 21,
	TILESTATE_NOFIELDBLOCKPATH = 1 << 22,
	TILESTATE_SUPPORTS_HANGABLE = 1 << 23,

	TILESTATE_FLOORCHANGE = TILESTATE_FLOORCHANGE_DOWN | TILESTATE_FLOORCHANGE_NORTH | TILESTATE_FLOORCHANGE_SOUTH | TILESTATE_FLOORCHANGE_EAST | TILESTATE_FLOORCHANGE_WEST | TILESTATE_FLOORCHANGE_SOUTH_ALT | TILESTATE_FLOORCHANGE_EAST_ALT,
};

export enum CylinderFlag {
	FLAG_NOLIMIT = 1 << 0, //Bypass limits like capacity/container limits, blocking items/creatures etc.
	FLAG_IGNOREBLOCKITEM = 1 << 1, //Bypass movable blocking item checks
	FLAG_IGNOREBLOCKCREATURE = 1 << 2, //Bypass creature checks
	FLAG_CHILDISOWNER = 1 << 3, //Used by containers to query capacity of the carrier (player)
	FLAG_PATHFINDING = 1 << 4, //An additional check is done for floor changing/teleport items
	FLAG_IGNOREFIELDDAMAGE = 1 << 5, //Bypass field damage checks
	FLAG_IGNORENOTMOVEABLE = 1 << 6, //Bypass check for mobility
	FLAG_IGNOREAUTOSTACK = 1 << 7, //queryDestination will not try to stack items together
};

export enum ReturnValue {
	RETURNVALUE_NOERROR,
	RETURNVALUE_NOTPOSSIBLE,
	RETURNVALUE_NOTENOUGHROOM,
	RETURNVALUE_PLAYERISPZLOCKED,
	RETURNVALUE_PLAYERISNOTINVITED,
	RETURNVALUE_CANNOTTHROW,
	RETURNVALUE_THEREISNOWAY,
	RETURNVALUE_DESTINATIONOUTOFREACH,
	RETURNVALUE_CREATUREBLOCK,
	RETURNVALUE_NOTMOVEABLE,
	RETURNVALUE_DROPTWOHANDEDITEM,
	RETURNVALUE_BOTHHANDSNEEDTOBEFREE,
	RETURNVALUE_CANONLYUSEONEWEAPON,
	RETURNVALUE_NEEDEXCHANGE,
	RETURNVALUE_CANNOTBEDRESSED,
	RETURNVALUE_PUTTHISOBJECTINYOURHAND,
	RETURNVALUE_PUTTHISOBJECTINBOTHHANDS,
	RETURNVALUE_TOOFARAWAY,
	RETURNVALUE_FIRSTGODOWNSTAIRS,
	RETURNVALUE_FIRSTGOUPSTAIRS,
	RETURNVALUE_CONTAINERNOTENOUGHROOM,
	RETURNVALUE_NOTENOUGHCAPACITY,
	RETURNVALUE_CANNOTPICKUP,
	RETURNVALUE_THISISIMPOSSIBLE,
	RETURNVALUE_DEPOTISFULL,
	RETURNVALUE_CREATUREDOESNOTEXIST,
	RETURNVALUE_CANNOTUSETHISOBJECT,
	RETURNVALUE_PLAYERWITHTHISNAMEISNOTONLINE,
	RETURNVALUE_NOTREQUIREDLEVELTOUSERUNE,
	RETURNVALUE_YOUAREALREADYTRADING,
	RETURNVALUE_THISPLAYERISALREADYTRADING,
	RETURNVALUE_YOUMAYNOTLOGOUTDURINGAFIGHT,
	RETURNVALUE_DIRECTPLAYERSHOOT,
	RETURNVALUE_NOTENOUGHLEVEL,
	RETURNVALUE_NOTENOUGHMAGICLEVEL,
	RETURNVALUE_NOTENOUGHMANA,
	RETURNVALUE_NOTENOUGHSOUL,
	RETURNVALUE_YOUAREEXHAUSTED,
	RETURNVALUE_PLAYERISNOTREACHABLE,
	RETURNVALUE_CANONLYUSETHISRUNEONCREATURES,
	RETURNVALUE_ACTIONNOTPERMITTEDINPROTECTIONZONE,
	RETURNVALUE_YOUMAYNOTATTACKTHISPLAYER,
	RETURNVALUE_YOUMAYNOTATTACKAPERSONINPROTECTIONZONE,
	RETURNVALUE_YOUMAYNOTATTACKAPERSONWHILEINPROTECTIONZONE,
	RETURNVALUE_YOUMAYNOTATTACKTHISCREATURE,
	RETURNVALUE_YOUCANONLYUSEITONCREATURES,
	RETURNVALUE_CREATUREISNOTREACHABLE,
	RETURNVALUE_TURNSECUREMODETOATTACKUNMARKEDPLAYERS,
	RETURNVALUE_YOUNEEDPREMIUMACCOUNT,
	RETURNVALUE_YOUNEEDTOLEARNTHISSPELL,
	RETURNVALUE_YOURVOCATIONCANNOTUSETHISSPELL,
	RETURNVALUE_YOUNEEDAWEAPONTOUSETHISSPELL,
	RETURNVALUE_PLAYERISPZLOCKEDLEAVEPVPZONE,
	RETURNVALUE_PLAYERISPZLOCKEDENTERPVPZONE,
	RETURNVALUE_ACTIONNOTPERMITTEDINANOPVPZONE,
	RETURNVALUE_YOUCANNOTLOGOUTHERE,
	RETURNVALUE_YOUNEEDAMAGICITEMTOCASTSPELL,
	RETURNVALUE_CANNOTCONJUREITEMHERE,
	RETURNVALUE_YOUNEEDTOSPLITYOURSPEARS,
	RETURNVALUE_NAMEISTOOAMBIGIOUS,
	RETURNVALUE_CANONLYUSEONESHIELD,
	RETURNVALUE_NOPARTYMEMBERSINRANGE,
	RETURNVALUE_YOUARENOTTHEOWNER,
};

export enum CylinderLink {
	LINK_OWNER,
	LINK_PARENT,
	LINK_TOPPARENT,
	LINK_NEAR,
};

export enum ZoneType {
	ZONE_PROTECTION,
	ZONE_NOPVP,
	ZONE_PVP,
	ZONE_NOLOGOUT,
	ZONE_NORMAL,
};

export enum ItemProperty {
	CONST_PROP_BLOCKSOLID = 0,
	CONST_PROP_HASHEIGHT,
	CONST_PROP_BLOCKPROJECTILE,
	CONST_PROP_BLOCKPATH,
	CONST_PROP_ISVERTICAL,
	CONST_PROP_ISHORIZONTAL,
	CONST_PROP_MOVEABLE,
	CONST_PROP_IMMOVABLEBLOCKSOLID,
	CONST_PROP_IMMOVABLEBLOCKPATH,
	CONST_PROP_IMMOVABLENOFIELDBLOCKPATH,
	CONST_PROP_NOFIELDBLOCKPATH,
	CONST_PROP_SUPPORTHANGABLE,
};

export enum CombatType {
	COMBAT_NONE = 0,

	COMBAT_PHYSICALDAMAGE = 1 << 0,
	COMBAT_ENERGYDAMAGE = 1 << 1,
	COMBAT_EARTHDAMAGE = 1 << 2,
	COMBAT_FIREDAMAGE = 1 << 3,
	COMBAT_UNDEFINEDDAMAGE = 1 << 4,
	COMBAT_LIFEDRAIN = 1 << 5,
	COMBAT_MANADRAIN = 1 << 6,
	COMBAT_HEALING = 1 << 7,
	COMBAT_DROWNDAMAGE = 1 << 8,
	COMBAT_ICEDAMAGE = 1 << 9,
	COMBAT_HOLYDAMAGE = 1 << 10,
	COMBAT_DEATHDAMAGE = 1 << 11,

	COMBAT_COUNT = 12
};

export enum ConditionType {
	CONDITION_NONE,

	CONDITION_POISON = 1 << 0,
	CONDITION_FIRE = 1 << 1,
	CONDITION_ENERGY = 1 << 2,
	CONDITION_BLEEDING = 1 << 3,
	CONDITION_HASTE = 1 << 4,
	CONDITION_PARALYZE = 1 << 5,
	CONDITION_OUTFIT = 1 << 6,
	CONDITION_INVISIBLE = 1 << 7,
	CONDITION_LIGHT = 1 << 8,
	CONDITION_MANASHIELD = 1 << 9,
	CONDITION_INFIGHT = 1 << 10,
	CONDITION_DRUNK = 1 << 11,
	CONDITION_EXHAUST_WEAPON = 1 << 12, // unused
	CONDITION_REGENERATION = 1 << 13,
	CONDITION_SOUL = 1 << 14,
	CONDITION_DROWN = 1 << 15,
	CONDITION_MUTED = 1 << 16,
	CONDITION_CHANNELMUTEDTICKS = 1 << 17,
	CONDITION_YELLTICKS = 1 << 18,
	CONDITION_ATTRIBUTES = 1 << 19,
	CONDITION_FREEZING = 1 << 20,
	CONDITION_DAZZLED = 1 << 21,
	CONDITION_CURSED = 1 << 22,
	CONDITION_EXHAUST_COMBAT = 1 << 23, // unused
	CONDITION_EXHAUST_HEAL = 1 << 24, // unused
	CONDITION_PACIFIED = 1 << 25,
	CONDITION_SPELLCOOLDOWN = 1 << 26,
	CONDITION_SPELLGROUPCOOLDOWN = 1 << 27,
};

export enum ConditionId {
	CONDITIONID_DEFAULT = -1,
	CONDITIONID_COMBAT,
	CONDITIONID_HEAD,
	CONDITIONID_NECKLACE,
	CONDITIONID_BACKPACK,
	CONDITIONID_ARMOR,
	CONDITIONID_RIGHT,
	CONDITIONID_LEFT,
	CONDITIONID_LEGS,
	CONDITIONID_FEET,
	CONDITIONID_RING,
	CONDITIONID_AMMO,
};

export enum ItemAttributeType {
	ITEM_ATTRIBUTE_NONE,

	ITEM_ATTRIBUTE_ACTIONID = 1 << 0,
	ITEM_ATTRIBUTE_UNIQUEID = 1 << 1,
	ITEM_ATTRIBUTE_DESCRIPTION = 1 << 2,
	ITEM_ATTRIBUTE_TEXT = 1 << 3,
	ITEM_ATTRIBUTE_DATE = 1 << 4,
	ITEM_ATTRIBUTE_WRITER = 1 << 5,
	ITEM_ATTRIBUTE_NAME = 1 << 6,
	ITEM_ATTRIBUTE_ARTICLE = 1 << 7,
	ITEM_ATTRIBUTE_PLURALNAME = 1 << 8,
	ITEM_ATTRIBUTE_WEIGHT = 1 << 9,
	ITEM_ATTRIBUTE_ATTACK = 1 << 10,
	ITEM_ATTRIBUTE_DEFENSE = 1 << 11,
	ITEM_ATTRIBUTE_EXTRADEFENSE = 1 << 12,
	ITEM_ATTRIBUTE_ARMOR = 1 << 13,
	ITEM_ATTRIBUTE_HITCHANCE = 1 << 14,
	ITEM_ATTRIBUTE_SHOOTRANGE = 1 << 15,
	ITEM_ATTRIBUTE_OWNER = 1 << 16,
	ITEM_ATTRIBUTE_DURATION = 1 << 17,
	ITEM_ATTRIBUTE_DECAYSTATE = 1 << 18,
	ITEM_ATTRIBUTE_CORPSEOWNER = 1 << 19,
	ITEM_ATTRIBUTE_CHARGES = 1 << 20,
	ITEM_ATTRIBUTE_FLUIDTYPE = 1 << 21,
	ITEM_ATTRIBUTE_DOORID = 1 << 22,
};

export enum ItemDecayState {
	DECAYING_FALSE = 0,
	DECAYING_TRUE,
	DECAYING_PENDING,
};

export enum ItemGroup {
	ITEM_GROUP_NONE,

	ITEM_GROUP_GROUND,
	ITEM_GROUP_CONTAINER,
	ITEM_GROUP_WEAPON, //deprecated
	ITEM_GROUP_AMMUNITION, //deprecated
	ITEM_GROUP_ARMOR, //deprecated
	ITEM_GROUP_CHARGES,
	ITEM_GROUP_TELEPORT, //deprecated
	ITEM_GROUP_MAGICFIELD, //deprecated
	ITEM_GROUP_WRITEABLE, //deprecated
	ITEM_GROUP_KEY, //deprecated
	ITEM_GROUP_SPLASH,
	ITEM_GROUP_FLUID,
	ITEM_GROUP_DOOR, //deprecated
	ITEM_GROUP_DEPRECATED,

	ITEM_GROUP_LAST
};

export enum ClientFluidTypes {
	CLIENTFLUID_EMPTY = 0,
	CLIENTFLUID_BLUE = 1,
	CLIENTFLUID_PURPLE = 2,
	CLIENTFLUID_BROWN_1 = 3,
	CLIENTFLUID_BROWN_2 = 4,
	CLIENTFLUID_RED = 5,
	CLIENTFLUID_GREEN = 6,
	CLIENTFLUID_BROWN = 7,
	CLIENTFLUID_YELLOW = 8,
	CLIENTFLUID_WHITE = 9,
};

export const FluidMap = [
	ClientFluidTypes.CLIENTFLUID_EMPTY,
	ClientFluidTypes.CLIENTFLUID_BLUE,
	ClientFluidTypes.CLIENTFLUID_RED,
	ClientFluidTypes.CLIENTFLUID_BROWN_1,
	ClientFluidTypes.CLIENTFLUID_GREEN,
	ClientFluidTypes.CLIENTFLUID_YELLOW,
	ClientFluidTypes.CLIENTFLUID_WHITE,
	ClientFluidTypes.CLIENTFLUID_PURPLE,
];

export enum CreatureType {
	CREATURETYPE_PLAYER = 0,
	CREATURETYPE_MONSTER = 1,
	CREATURETYPE_NPC = 2,
	CREATURETYPE_SUMMON_OWN = 3,
	CREATURETYPE_SUMMON_OTHERS = 4,
};

export enum GuildEmblem {
	GUILDEMBLEM_NONE = 0,
	GUILDEMBLEM_ALLY = 1,
	GUILDEMBLEM_ENEMY = 2,
	GUILDEMBLEM_NEUTRAL = 3,
	GUILDEMBLEM_MEMBER = 4,
	GUILDEMBLEM_OTHER = 5,
};

export enum Direction {
	NORTH = 0,
	EAST = 1,
	SOUTH = 2,
	WEST = 3,

	DIAGONAL_MASK = 4,
	SOUTHWEST = DIAGONAL_MASK | 0,
	SOUTHEAST = DIAGONAL_MASK | 1,
	NORTHWEST = DIAGONAL_MASK | 2,
	NORTHEAST = DIAGONAL_MASK | 3,

	LAST = NORTHEAST,
	NONE = 8,
};

export enum ItemAttribute {
	FIRST = 0x10,
	SERVERID = FIRST,
	CLIENTID,
	NAME,
	DESCR,
	SPEED,
	SLOT,
	MAXITEMS,
	WEIGHT,
	WEAPON,
	AMU,
	ARMOR,
	MAGLEVEL,
	MAGFIELDTYPE,
	WRITEABLE,
	ROTATETO,
	DECAY,
	SPRITEHASH,
	MINIMAPCOLOR,
	_07,
	_08,
	LIGHT,

	//1-byte aligned
	DECAY2, //deprecated
	WEAPON2, //deprecated
	AMU2, //deprecated
	ARMOR2, //deprecated
	WRITEABLE2, //deprecated
	LIGHT2,
	TOPORDER,
	WRITEABLE3, //deprecated

	WAREID,

	LAST
};

export enum ItemTypes {
	ITEM_TYPE_NONE,
	ITEM_TYPE_DEPOT,
	ITEM_TYPE_MAILBOX,
	ITEM_TYPE_TRASHHOLDER,
	ITEM_TYPE_CONTAINER,
	ITEM_TYPE_DOOR,
	ITEM_TYPE_MAGICFIELD,
	ITEM_TYPE_TELEPORT,
	ITEM_TYPE_BED,
	ITEM_TYPE_KEY,
	ITEM_TYPE_RUNE,
	ITEM_TYPE_LAST
};

export enum FluidColor {
	FLUID_EMPTY,
	FLUID_BLUE,
	FLUID_RED,
	FLUID_BROWN,
	FLUID_GREEN,
	FLUID_YELLOW,
	FLUID_WHITE,
	FLUID_PURPLE,
};

export enum FluidType {
	FLUID_NONE = FluidColor.FLUID_EMPTY,
	FLUID_WATER = FluidColor.FLUID_BLUE,
	FLUID_BLOOD = FluidColor.FLUID_RED,
	FLUID_BEER = FluidColor.FLUID_BROWN,
	FLUID_SLIME = FluidColor.FLUID_GREEN,
	FLUID_LEMONADE = FluidColor.FLUID_YELLOW,
	FLUID_MILK = FluidColor.FLUID_WHITE,
	FLUID_MANA = FluidColor.FLUID_PURPLE,

	FLUID_LIFE = FluidColor.FLUID_RED + 8,
	FLUID_OIL = FluidColor.FLUID_BROWN + 8,
	FLUID_URINE = FluidColor.FLUID_YELLOW + 8,
	FLUID_COCONUTMILK = FluidColor.FLUID_WHITE + 8,
	FLUID_WINE = FluidColor.FLUID_PURPLE + 8,

	FLUID_MUD = FluidColor.FLUID_BROWN + 16,
	FLUID_FRUITJUICE = FluidColor.FLUID_YELLOW + 16,

	FLUID_LAVA = FluidColor.FLUID_RED + 24,
	FLUID_RUM = FluidColor.FLUID_BROWN + 24,
	FLUID_SWAMP = FluidColor.FLUID_GREEN + 24,

	FLUID_TEA = FluidColor.FLUID_BROWN + 32,

	FLUID_MEAD = FluidColor.FLUID_BROWN + 40,
};

export enum SlotPositionBits {
	SLOTP_WHEREEVER = 0xFFFFFFFF,
	SLOTP_HEAD = 1 << 0,
	SLOTP_NECKLACE = 1 << 1,
	SLOTP_BACKPACK = 1 << 2,
	SLOTP_ARMOR = 1 << 3,
	SLOTP_RIGHT = 1 << 4,
	SLOTP_LEFT = 1 << 5,
	SLOTP_LEGS = 1 << 6,
	SLOTP_FEET = 1 << 7,
	SLOTP_RING = 1 << 8,
	SLOTP_AMMO = 1 << 9,
	SLOTP_DEPOT = 1 << 10,
	SLOTP_TWO_HAND = 1 << 11,
	SLOTP_HAND = (SLOTP_LEFT | SLOTP_RIGHT)
};

export enum ShootType {
	CONST_ANI_NONE,

	CONST_ANI_SPEAR = 1,
	CONST_ANI_BOLT = 2,
	CONST_ANI_ARROW = 3,
	CONST_ANI_FIRE = 4,
	CONST_ANI_ENERGY = 5,
	CONST_ANI_POISONARROW = 6,
	CONST_ANI_BURSTARROW = 7,
	CONST_ANI_THROWINGSTAR = 8,
	CONST_ANI_THROWINGKNIFE = 9,
	CONST_ANI_SMALLSTONE = 10,
	CONST_ANI_DEATH = 11,
	CONST_ANI_LARGEROCK = 12,
	CONST_ANI_SNOWBALL = 13,
	CONST_ANI_POWERBOLT = 14,
	CONST_ANI_POISON = 15,
	CONST_ANI_INFERNALBOLT = 16,
	CONST_ANI_HUNTINGSPEAR = 17,
	CONST_ANI_ENCHANTEDSPEAR = 18,
	CONST_ANI_REDSTAR = 19,
	CONST_ANI_GREENSTAR = 20,
	CONST_ANI_ROYALSPEAR = 21,
	CONST_ANI_SNIPERARROW = 22,
	CONST_ANI_ONYXARROW = 23,
	CONST_ANI_PIERCINGBOLT = 24,
	CONST_ANI_WHIRLWINDSWORD = 25,
	CONST_ANI_WHIRLWINDAXE = 26,
	CONST_ANI_WHIRLWINDCLUB = 27,
	CONST_ANI_ETHEREALSPEAR = 28,
	CONST_ANI_ICE = 29,
	CONST_ANI_EARTH = 30,
	CONST_ANI_HOLY = 31,
	CONST_ANI_SUDDENDEATH = 32,
	CONST_ANI_FLASHARROW = 33,
	CONST_ANI_FLAMMINGARROW = 34,
	CONST_ANI_SHIVERARROW = 35,
	CONST_ANI_ENERGYBALL = 36,
	CONST_ANI_SMALLICE = 37,
	CONST_ANI_SMALLHOLY = 38,
	CONST_ANI_SMALLEARTH = 39,
	CONST_ANI_EARTHARROW = 40,
	CONST_ANI_EXPLOSION = 41,
	CONST_ANI_CAKE = 42,

	CONST_ANI_TARSALARROW = 44,
	CONST_ANI_VORTEXBOLT = 45,

	CONST_ANI_PRISMATICBOLT = 48,
	CONST_ANI_CRYSTALLINEARROW = 49,
	CONST_ANI_DRILLBOLT = 50,
	CONST_ANI_ENVENOMEDARROW = 51,

	CONST_ANI_GLOOTHSPEAR = 53,
	CONST_ANI_SIMPLEARROW = 54,

	// for internal use, don't send to client
	CONST_ANI_WEAPONTYPE = 0xFE, // 254
};

export const ShootTypeNames = {
	"spear": ShootType.CONST_ANI_SPEAR,
	"bolt": ShootType.CONST_ANI_BOLT,
	"arrow": ShootType.CONST_ANI_ARROW,
	"fire": ShootType.CONST_ANI_FIRE,
	"energy": ShootType.CONST_ANI_ENERGY,
	"poisonarrow": ShootType.CONST_ANI_POISONARROW,
	"burstarrow": ShootType.CONST_ANI_BURSTARROW,
	"throwingstar": ShootType.CONST_ANI_THROWINGSTAR,
	"throwingknife": ShootType.CONST_ANI_THROWINGKNIFE,
	"smallstone": ShootType.CONST_ANI_SMALLSTONE,
	"death": ShootType.CONST_ANI_DEATH,
	"largerock": ShootType.CONST_ANI_LARGEROCK,
	"snowball": ShootType.CONST_ANI_SNOWBALL,
	"powerbolt": ShootType.CONST_ANI_POWERBOLT,
	"poison": ShootType.CONST_ANI_POISON,
	"infernalbolt": ShootType.CONST_ANI_INFERNALBOLT,
	"huntingspear": ShootType.CONST_ANI_HUNTINGSPEAR,
	"enchantedspear": ShootType.CONST_ANI_ENCHANTEDSPEAR,
	"redstar": ShootType.CONST_ANI_REDSTAR,
	"greenstar": ShootType.CONST_ANI_GREENSTAR,
	"royalspear": ShootType.CONST_ANI_ROYALSPEAR,
	"sniperarrow": ShootType.CONST_ANI_SNIPERARROW,
	"onyxarrow": ShootType.CONST_ANI_ONYXARROW,
	"piercingbolt": ShootType.CONST_ANI_PIERCINGBOLT,
	"whirlwindsword": ShootType.CONST_ANI_WHIRLWINDSWORD,
	"whirlwindaxe": ShootType.CONST_ANI_WHIRLWINDAXE,
	"whirlwindclub": ShootType.CONST_ANI_WHIRLWINDCLUB,
	"etherealspear": ShootType.CONST_ANI_ETHEREALSPEAR,
	"ice": ShootType.CONST_ANI_ICE,
	"earth": ShootType.CONST_ANI_EARTH,
	"holy": ShootType.CONST_ANI_HOLY,
	"suddendeath": ShootType.CONST_ANI_SUDDENDEATH,
	"flasharrow": ShootType.CONST_ANI_FLASHARROW,
	"flammingarrow": ShootType.CONST_ANI_FLAMMINGARROW,
	"shiverarrow": ShootType.CONST_ANI_SHIVERARROW,
	"energyball": ShootType.CONST_ANI_ENERGYBALL,
	"smallice": ShootType.CONST_ANI_SMALLICE,
	"smallholy": ShootType.CONST_ANI_SMALLHOLY,
	"smallearth": ShootType.CONST_ANI_SMALLEARTH,
	"eartharrow": ShootType.CONST_ANI_EARTHARROW,
	"explosion": ShootType.CONST_ANI_EXPLOSION,
	"cake": ShootType.CONST_ANI_CAKE,
	"tarsalarrow": ShootType.CONST_ANI_TARSALARROW,
	"vortexbolt": ShootType.CONST_ANI_VORTEXBOLT,
	"prismaticbolt": ShootType.CONST_ANI_PRISMATICBOLT,
	"crystallinearrow": ShootType.CONST_ANI_CRYSTALLINEARROW,
	"drillbolt": ShootType.CONST_ANI_DRILLBOLT,
	"envenomedarrow": ShootType.CONST_ANI_ENVENOMEDARROW,
	"gloothspear": ShootType.CONST_ANI_GLOOTHSPEAR,
	"simplearrow": ShootType.CONST_ANI_SIMPLEARROW,
};

export enum MagicEffectClasses {
	CONST_ME_NONE,

	CONST_ME_DRAWBLOOD = 1,
	CONST_ME_LOSEENERGY = 2,
	CONST_ME_POFF = 3,
	CONST_ME_BLOCKHIT = 4,
	CONST_ME_EXPLOSIONAREA = 5,
	CONST_ME_EXPLOSIONHIT = 6,
	CONST_ME_FIREAREA = 7,
	CONST_ME_YELLOW_RINGS = 8,
	CONST_ME_GREEN_RINGS = 9,
	CONST_ME_HITAREA = 10,
	CONST_ME_TELEPORT = 11,
	CONST_ME_ENERGYHIT = 12,
	CONST_ME_MAGIC_BLUE = 13,
	CONST_ME_MAGIC_RED = 14,
	CONST_ME_MAGIC_GREEN = 15,
	CONST_ME_HITBYFIRE = 16,
	CONST_ME_HITBYPOISON = 17,
	CONST_ME_MORTAREA = 18,
	CONST_ME_SOUND_GREEN = 19,
	CONST_ME_SOUND_RED = 20,
	CONST_ME_POISONAREA = 21,
	CONST_ME_SOUND_YELLOW = 22,
	CONST_ME_SOUND_PURPLE = 23,
	CONST_ME_SOUND_BLUE = 24,
	CONST_ME_SOUND_WHITE = 25,
	CONST_ME_BUBBLES = 26,
	CONST_ME_CRAPS = 27,
	CONST_ME_GIFT_WRAPS = 28,
	CONST_ME_FIREWORK_YELLOW = 29,
	CONST_ME_FIREWORK_RED = 30,
	CONST_ME_FIREWORK_BLUE = 31,
	CONST_ME_STUN = 32,
	CONST_ME_SLEEP = 33,
	CONST_ME_WATERCREATURE = 34,
	CONST_ME_GROUNDSHAKER = 35,
	CONST_ME_HEARTS = 36,
	CONST_ME_FIREATTACK = 37,
	CONST_ME_ENERGYAREA = 38,
	CONST_ME_SMALLCLOUDS = 39,
	CONST_ME_HOLYDAMAGE = 40,
	CONST_ME_BIGCLOUDS = 41,
	CONST_ME_ICEAREA = 42,
	CONST_ME_ICETORNADO = 43,
	CONST_ME_ICEATTACK = 44,
	CONST_ME_STONES = 45,
	CONST_ME_SMALLPLANTS = 46,
	CONST_ME_CARNIPHILA = 47,
	CONST_ME_PURPLEENERGY = 48,
	CONST_ME_YELLOWENERGY = 49,
	CONST_ME_HOLYAREA = 50,
	CONST_ME_BIGPLANTS = 51,
	CONST_ME_CAKE = 52,
	CONST_ME_GIANTICE = 53,
	CONST_ME_WATERSPLASH = 54,
	CONST_ME_PLANTATTACK = 55,
	CONST_ME_TUTORIALARROW = 56,
	CONST_ME_TUTORIALSQUARE = 57,
	CONST_ME_MIRRORHORIZONTAL = 58,
	CONST_ME_MIRRORVERTICAL = 59,
	CONST_ME_SKULLHORIZONTAL = 60,
	CONST_ME_SKULLVERTICAL = 61,
	CONST_ME_ASSASSIN = 62,
	CONST_ME_STEPSHORIZONTAL = 63,
	CONST_ME_BLOODYSTEPS = 64,
	CONST_ME_STEPSVERTICAL = 65,
	CONST_ME_YALAHARIGHOST = 66,
	CONST_ME_BATS = 67,
	CONST_ME_SMOKE = 68,
	CONST_ME_INSECTS = 69,
	CONST_ME_DRAGONHEAD = 70,
	CONST_ME_ORCSHAMAN = 71,
	CONST_ME_ORCSHAMAN_FIRE = 72,
	CONST_ME_THUNDER = 73,
	CONST_ME_FERUMBRAS = 74,
	CONST_ME_CONFETTI_HORIZONTAL = 75,
	CONST_ME_CONFETTI_VERTICAL = 76,
	// 77-157 are empty
	CONST_ME_BLACKSMOKE = 158,
	// 159-166 are empty
	CONST_ME_REDSMOKE = 167,
	CONST_ME_YELLOWSMOKE = 168,
	CONST_ME_GREENSMOKE = 169,
	CONST_ME_PURPLESMOKE = 170,
	CONST_ME_EARLY_THUNDER = 171,
	CONST_ME_RAGIAZ_BONECAPSULE = 172,
	CONST_ME_CRITICAL_DAMAGE = 173,
	// 174 is empty
	CONST_ME_PLUNGING_FISH = 175,
};

export const MagicEffectNames = {
	"redspark": MagicEffectClasses.CONST_ME_DRAWBLOOD,
	"bluebubble": MagicEffectClasses.CONST_ME_LOSEENERGY,
	"poff": MagicEffectClasses.CONST_ME_POFF,
	"yellowspark": MagicEffectClasses.CONST_ME_BLOCKHIT,
	"explosionarea": MagicEffectClasses.CONST_ME_EXPLOSIONAREA,
	"explosion": MagicEffectClasses.CONST_ME_EXPLOSIONHIT,
	"firearea": MagicEffectClasses.CONST_ME_FIREAREA,
	"yellowbubble": MagicEffectClasses.CONST_ME_YELLOW_RINGS,
	"greenbubble": MagicEffectClasses.CONST_ME_GREEN_RINGS,
	"blackspark": MagicEffectClasses.CONST_ME_HITAREA,
	"teleport": MagicEffectClasses.CONST_ME_TELEPORT,
	"energy": MagicEffectClasses.CONST_ME_ENERGYHIT,
	"blueshimmer": MagicEffectClasses.CONST_ME_MAGIC_BLUE,
	"redshimmer": MagicEffectClasses.CONST_ME_MAGIC_RED,
	"greenshimmer": MagicEffectClasses.CONST_ME_MAGIC_GREEN,
	"fire": MagicEffectClasses.CONST_ME_HITBYFIRE,
	"greenspark": MagicEffectClasses.CONST_ME_HITBYPOISON,
	"mortarea": MagicEffectClasses.CONST_ME_MORTAREA,
	"greennote": MagicEffectClasses.CONST_ME_SOUND_GREEN,
	"rednote": MagicEffectClasses.CONST_ME_SOUND_RED,
	"poison": MagicEffectClasses.CONST_ME_POISONAREA,
	"yellownote": MagicEffectClasses.CONST_ME_SOUND_YELLOW,
	"purplenote": MagicEffectClasses.CONST_ME_SOUND_PURPLE,
	"bluenote": MagicEffectClasses.CONST_ME_SOUND_BLUE,
	"whitenote": MagicEffectClasses.CONST_ME_SOUND_WHITE,
	"bubbles": MagicEffectClasses.CONST_ME_BUBBLES,
	"dice": MagicEffectClasses.CONST_ME_CRAPS,
	"giftwraps": MagicEffectClasses.CONST_ME_GIFT_WRAPS,
	"yellowfirework": MagicEffectClasses.CONST_ME_FIREWORK_YELLOW,
	"redfirework": MagicEffectClasses.CONST_ME_FIREWORK_RED,
	"bluefirework": MagicEffectClasses.CONST_ME_FIREWORK_BLUE,
	"stun": MagicEffectClasses.CONST_ME_STUN,
	"sleep": MagicEffectClasses.CONST_ME_SLEEP,
	"watercreature": MagicEffectClasses.CONST_ME_WATERCREATURE,
	"groundshaker": MagicEffectClasses.CONST_ME_GROUNDSHAKER,
	"hearts": MagicEffectClasses.CONST_ME_HEARTS,
	"fireattack": MagicEffectClasses.CONST_ME_FIREATTACK,
	"energyarea": MagicEffectClasses.CONST_ME_ENERGYAREA,
	"smallclouds": MagicEffectClasses.CONST_ME_SMALLCLOUDS,
	"holydamage": MagicEffectClasses.CONST_ME_HOLYDAMAGE,
	"bigclouds": MagicEffectClasses.CONST_ME_BIGCLOUDS,
	"icearea": MagicEffectClasses.CONST_ME_ICEAREA,
	"icetornado": MagicEffectClasses.CONST_ME_ICETORNADO,
	"iceattack": MagicEffectClasses.CONST_ME_ICEATTACK,
	"stones": MagicEffectClasses.CONST_ME_STONES,
	"smallplants": MagicEffectClasses.CONST_ME_SMALLPLANTS,
	"carniphila": MagicEffectClasses.CONST_ME_CARNIPHILA,
	"purpleenergy": MagicEffectClasses.CONST_ME_PURPLEENERGY,
	"yellowenergy": MagicEffectClasses.CONST_ME_YELLOWENERGY,
	"holyarea": MagicEffectClasses.CONST_ME_HOLYAREA,
	"bigplants": MagicEffectClasses.CONST_ME_BIGPLANTS,
	"cake": MagicEffectClasses.CONST_ME_CAKE,
	"giantice": MagicEffectClasses.CONST_ME_GIANTICE,
	"watersplash": MagicEffectClasses.CONST_ME_WATERSPLASH,
	"plantattack": MagicEffectClasses.CONST_ME_PLANTATTACK,
	"tutorialarrow": MagicEffectClasses.CONST_ME_TUTORIALARROW,
	"tutorialsquare": MagicEffectClasses.CONST_ME_TUTORIALSQUARE,
	"mirrorhorizontal": MagicEffectClasses.CONST_ME_MIRRORHORIZONTAL,
	"mirrorvertical": MagicEffectClasses.CONST_ME_MIRRORVERTICAL,
	"skullhorizontal": MagicEffectClasses.CONST_ME_SKULLHORIZONTAL,
	"skullvertical": MagicEffectClasses.CONST_ME_SKULLVERTICAL,
	"assassin": MagicEffectClasses.CONST_ME_ASSASSIN,
	"stepshorizontal": MagicEffectClasses.CONST_ME_STEPSHORIZONTAL,
	"bloodysteps": MagicEffectClasses.CONST_ME_BLOODYSTEPS,
	"stepsvertical": MagicEffectClasses.CONST_ME_STEPSVERTICAL,
	"yalaharighost": MagicEffectClasses.CONST_ME_YALAHARIGHOST,
	"bats": MagicEffectClasses.CONST_ME_BATS,
	"smoke": MagicEffectClasses.CONST_ME_SMOKE,
	"insects": MagicEffectClasses.CONST_ME_INSECTS,
	"dragonhead": MagicEffectClasses.CONST_ME_DRAGONHEAD,
	"orcshaman": MagicEffectClasses.CONST_ME_ORCSHAMAN,
	"orcshamanfire": MagicEffectClasses.CONST_ME_ORCSHAMAN_FIRE,
	"thunder": MagicEffectClasses.CONST_ME_THUNDER,
	"ferumbras": MagicEffectClasses.CONST_ME_FERUMBRAS,
	"confettihorizontal": MagicEffectClasses.CONST_ME_CONFETTI_HORIZONTAL,
	"confettivertical": MagicEffectClasses.CONST_ME_CONFETTI_VERTICAL,
	"blacksmoke": MagicEffectClasses.CONST_ME_BLACKSMOKE,
	"redsmoke": MagicEffectClasses.CONST_ME_REDSMOKE,
	"yellowsmoke": MagicEffectClasses.CONST_ME_YELLOWSMOKE,
	"greensmoke": MagicEffectClasses.CONST_ME_GREENSMOKE,
	"purplesmoke": MagicEffectClasses.CONST_ME_PURPLESMOKE,
};

export enum Skills {
	SKILL_FIST = 0,
	SKILL_CLUB = 1,
	SKILL_SWORD = 2,
	SKILL_AXE = 3,
	SKILL_DISTANCE = 4,
	SKILL_SHIELD = 5,
	SKILL_FISHING = 6,

	SKILL_MAGLEVEL = 7,
	SKILL_LEVEL = 8,

	SKILL_FIRST = SKILL_FIST,
	SKILL_LAST = SKILL_FISHING
};

export enum Stats {
	STAT_MAXHITPOINTS,
	STAT_MAXMANAPOINTS,
	STAT_SOULPOINTS, // unused
	STAT_MAGICPOINTS,

	STAT_FIRST = STAT_MAXHITPOINTS,
	STAT_LAST = STAT_MAGICPOINTS
};

export enum ConditionParam {
	CONDITION_PARAM_OWNER = 1,
	CONDITION_PARAM_TICKS = 2,
	//CONDITION_PARAM_OUTFIT = 3,
	CONDITION_PARAM_HEALTHGAIN = 4,
	CONDITION_PARAM_HEALTHTICKS = 5,
	CONDITION_PARAM_MANAGAIN = 6,
	CONDITION_PARAM_MANATICKS = 7,
	CONDITION_PARAM_DELAYED = 8,
	CONDITION_PARAM_SPEED = 9,
	CONDITION_PARAM_LIGHT_LEVEL = 10,
	CONDITION_PARAM_LIGHT_COLOR = 11,
	CONDITION_PARAM_SOULGAIN = 12,
	CONDITION_PARAM_SOULTICKS = 13,
	CONDITION_PARAM_MINVALUE = 14,
	CONDITION_PARAM_MAXVALUE = 15,
	CONDITION_PARAM_STARTVALUE = 16,
	CONDITION_PARAM_TICKINTERVAL = 17,
	CONDITION_PARAM_FORCEUPDATE = 18,
	CONDITION_PARAM_SKILL_MELEE = 19,
	CONDITION_PARAM_SKILL_FIST = 20,
	CONDITION_PARAM_SKILL_CLUB = 21,
	CONDITION_PARAM_SKILL_SWORD = 22,
	CONDITION_PARAM_SKILL_AXE = 23,
	CONDITION_PARAM_SKILL_DISTANCE = 24,
	CONDITION_PARAM_SKILL_SHIELD = 25,
	CONDITION_PARAM_SKILL_FISHING = 26,
	CONDITION_PARAM_STAT_MAXHITPOINTS = 27,
	CONDITION_PARAM_STAT_MAXMANAPOINTS = 28,
	// CONDITION_PARAM_STAT_SOULPOINTS = 29,
	CONDITION_PARAM_STAT_MAGICPOINTS = 30,
	CONDITION_PARAM_STAT_MAXHITPOINTSPERCENT = 31,
	CONDITION_PARAM_STAT_MAXMANAPOINTSPERCENT = 32,
	// CONDITION_PARAM_STAT_SOULPOINTSPERCENT = 33,
	CONDITION_PARAM_STAT_MAGICPOINTSPERCENT = 34,
	CONDITION_PARAM_PERIODICDAMAGE = 35,
	CONDITION_PARAM_SKILL_MELEEPERCENT = 36,
	CONDITION_PARAM_SKILL_FISTPERCENT = 37,
	CONDITION_PARAM_SKILL_CLUBPERCENT = 38,
	CONDITION_PARAM_SKILL_SWORDPERCENT = 39,
	CONDITION_PARAM_SKILL_AXEPERCENT = 40,
	CONDITION_PARAM_SKILL_DISTANCEPERCENT = 41,
	CONDITION_PARAM_SKILL_SHIELDPERCENT = 42,
	CONDITION_PARAM_SKILL_FISHINGPERCENT = 43,
	CONDITION_PARAM_BUFF_SPELL = 44,
	CONDITION_PARAM_SUBID = 45,
	CONDITION_PARAM_FIELD = 46,
};

export enum AttrTypes {
	//ATTR_DESCRIPTION = 1,
	//ATTR_EXT_FILE = 2,
	ATTR_TILE_FLAGS = 3,
	ATTR_ACTION_ID = 4,
	ATTR_UNIQUE_ID = 5,
	ATTR_TEXT = 6,
	ATTR_DESC = 7,
	ATTR_TELE_DEST = 8,
	ATTR_ITEM = 9,
	ATTR_DEPOT_ID = 10,
	//ATTR_EXT_SPAWN_FILE = 11,
	ATTR_RUNE_CHARGES = 12,
	//ATTR_EXT_HOUSE_FILE = 13,
	ATTR_HOUSEDOORID = 14,
	ATTR_COUNT = 15,
	ATTR_DURATION = 16,
	ATTR_DECAYING_STATE = 17,
	ATTR_WRITTENDATE = 18,
	ATTR_WRITTENBY = 19,
	ATTR_SLEEPERGUID = 20,
	ATTR_SLEEPSTART = 21,
	ATTR_CHARGES = 22,
	ATTR_CONTAINER_ITEMS = 23,
	ATTR_NAME = 24,
	ATTR_ARTICLE = 25,
	ATTR_PLURALNAME = 26,
	ATTR_WEIGHT = 27,
	ATTR_ATTACK = 28,
	ATTR_DEFENSE = 29,
	ATTR_EXTRADEFENSE = 30,
	ATTR_ARMOR = 31,
	ATTR_HITCHANCE = 32,
	ATTR_SHOOTRANGE = 33,
};

export enum AttrReadValue {
	ATTR_READ_CONTINUE,
	ATTR_READ_ERROR,
	ATTR_READ_END,
};

export enum PlayerSex {
	PLAYERSEX_FEMALE = 0,
	PLAYERSEX_MALE = 1,

	PLAYERSEX_LAST = PLAYERSEX_MALE
};
