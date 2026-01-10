import SPECIALITYS from '../data/heroSkillSpeciality.js';

class SkillSpecialtyService {
	constructor() {
		this.specialitys = SPECIALITYS;
	}

	getSpecialitys() {
		return this.specialitys;
	}
}

export default new SkillSpecialtyService();
