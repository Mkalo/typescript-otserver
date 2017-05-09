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