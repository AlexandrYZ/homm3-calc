import unitSpecialitys from './unitSpecialityService.js';
import spellSpecialitys from './spellSpecialityService.js';
import skillSpecialtys from './skillSpecialityService.js';

export default {
	getSpecialitys() {
		return {
			...unitSpecialitys.getSpecialitys(),
			...spellSpecialitys.getSpecialitys(),
			...skillSpecialtys.getSpecialitys(),
		};
	},

	getSpeciality(specialitySlug) {
		return this.getSpecialitys()[specialitySlug.toUpperCase()];
	},
};
