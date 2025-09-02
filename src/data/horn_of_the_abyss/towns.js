import CASTLE_UNITS from './units/castle.js';
import INFERNO_UNITS from './units/inferno.js';
import RAMPART_UNITS from './units/rampart.js';
import TOWER_UNITS from './units/tower.js';
import NECROPOLIS_UNITS from './units/necropolis.js';
import DUNGEON_UNITS from './units/dungeon.js';
import STRONGHOLD_UNITS from './units/stronghold.js';
import FORTRESS_UNITS from './units/fortress.js';
import CONFLUX_UNITS from './units/conflux.js';
import COVE_UNITS from './units/cove.js';
import FACTORY_UNITS from './units/factory.js'; // Added import
import NEUTRAL_UNITS from './units/neutral.js';

export default {
	CASTLE: {
		img: 'castle.gif',
		slug: 'castle',
		units: CASTLE_UNITS,
	},
	TOWER: {
		img: 'tower.gif',
		slug: 'tower',
		units: TOWER_UNITS,
	},
	INFERNO: {
		img: 'inferno.gif',
		slug: 'inferno',
		units: INFERNO_UNITS,
	},
	RAMPART: {
		img: 'rampart.gif',
		slug: 'rampart',
		units: RAMPART_UNITS,
	},
	NECROPOLIS: {
		img: 'necropolis.gif',
		slug: 'necropolis',
		units: NECROPOLIS_UNITS,
	},
	DUNGEON: {
		img: 'dungeon.gif',
		slug: 'dungeon',
		units: DUNGEON_UNITS,
	},
	STRONGHOLD: {
		img: 'stronghold.gif',
		slug: 'stronghold',
		units: STRONGHOLD_UNITS,
	},
	FORTRESS: {
		img: 'fortress.gif',
		slug: 'fortress',
		units: FORTRESS_UNITS,
	},
	CONFLUX: {
		img: 'conflux.gif',
		slug: 'conflux',
		units: CONFLUX_UNITS,
	},
	COVE: {
		img: 'cove.gif',
		slug: 'cove',
		units: COVE_UNITS,
	},
	FACTORY: { // Added Factory entry
		img: 'factory.gif',
		slug: 'factory',
		units: FACTORY_UNITS,
	},
	NEUTRAL: {
		img: 'neutral.gif',
		slug: 'neutral',
		units: NEUTRAL_UNITS,
	},
};
