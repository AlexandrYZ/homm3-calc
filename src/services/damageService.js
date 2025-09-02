/* eslint-disable max-len */
import specialityService from './specialityService.js';
import unitService from './unitService.js';

export default {
	detailedTotalDamageCalculation,
	calculateSpecialtyAttackBonus,
	calculateSpecialtyDefenseBonus,
	calculateSlayerAttackSkillBonus,
};

function detailedTotalDamageCalculation(
	attackingHero,
	defendingHero,
	attackingUnit,
	defendingUnit
) {
	const attackerSpecialtyAttackBonus = calculateSpecialtyAttackBonus(
		attackingHero,
		attackingUnit
	);
	const defenderSpecialtyAttackBonus = calculateSpecialtyAttackBonus(
		defendingHero,
		defendingUnit
	);

	const attackerSpecialtyDefenseBonus = calculateSpecialtyDefenseBonus(
		attackingHero,
		attackingUnit
	);
	const defenderSpecialtyDefenseBonus = calculateSpecialtyDefenseBonus(
		defendingHero,
		defendingUnit
	);

	const slayerAttackBonus = calculateSlayerAttackSkillBonus(
		attackingUnit,
		defendingUnit
	);

	const totalAttack =
		attackingHero.attack +
		attackingUnit.totalAttackSkill +
		slayerAttackBonus +
		attackerSpecialtyAttackBonus;

	const totalDefense =
		defendingHero.defense +
		defendingUnit.totalDefenseSkill +
		defenderSpecialtyDefenseBonus;

	let { minBaseDamage, maxBaseDamage } = attackingUnit;
	minBaseDamage *= calculateBlessSpecialityBonus(attackingHero, attackingUnit);
	maxBaseDamage *= calculateBlessSpecialityBonus(attackingHero, attackingUnit);

	const attackSkillBonus = calculateAttackSkillBonus(totalAttack, totalDefense);

	const {
		offenseBonus,
		offenseSpecialityBonus,
		archeryBonus,
		archerySpecialtyBonus,
	} = attackingHero;

	const defenseSkillReduction = calculateDefenseSkillReduction(
		totalAttack,
		totalDefense
	);

	const armorerReduction = defendingHero.armorerBonus;
	const { armorerSpecialityBonus } = defendingHero;
	const shieldSpellReduction = calculateShieldSpellReduction(
		defendingUnit.spells.shield ? defendingHero.skills.earth_magic || 1 : 0
	);
	const airShieldSpellReduction = calculateAirShieldSpellReduction(
		defendingUnit.spells.airshield ? defendingHero.skills.air_magic || 1 : 0
	);
	const meleePenaltyReduction = attackingUnit.meleePenalty;

	const minTotalDamage =
		attackingUnit.count *
		minBaseDamage *
		(1 + attackSkillBonus + offenseBonus + offenseSpecialityBonus) *
		(1 - defenseSkillReduction) *
		(1 - armorerReduction) *
		(1 - armorerSpecialityBonus) *
		(1 - shieldSpellReduction) *
		(1 - meleePenaltyReduction);

	const maxTotalDamage =
		attackingUnit.count *
		maxBaseDamage *
		(1 + attackSkillBonus + offenseBonus + offenseSpecialityBonus) *
		(1 - defenseSkillReduction) *
		(1 - armorerReduction) *
		(1 - armorerSpecialityBonus) *
		(1 - shieldSpellReduction) *
		(1 - meleePenaltyReduction);

	let minTotalRangedDamage = 0;
	let maxTotalRangedDamage = 0;

	if (attackingUnit.isRanged) {
		minTotalRangedDamage =
			attackingUnit.count *
			minBaseDamage *
			(1 + attackSkillBonus + archeryBonus + archerySpecialtyBonus) *
			(1 - defenseSkillReduction) *
			(1 - armorerReduction) *
			(1 - armorerSpecialityBonus) *
			(1 - airShieldSpellReduction);

		maxTotalRangedDamage =
			attackingUnit.count *
			maxBaseDamage *
			(1 + attackSkillBonus + archeryBonus + archerySpecialtyBonus) *
			(1 - defenseSkillReduction) *
			(1 - armorerReduction) *
			(1 - armorerSpecialityBonus) *
			(1 - airShieldSpellReduction);
	}

	const kills = calculateKills(
		minTotalDamage,
		maxTotalDamage,
		defendingUnit.health
	);
	const rangedKills = calculateKills(
		minTotalRangedDamage,
		maxTotalRangedDamage,
		defendingUnit.health
	);

	// Counter-attack calculation (melee), accounting for defender losses
	const attackerHasNoEnemyRetaliation =
		(attackingUnit.specials || []).includes('no_enemy_retaliation');

	let counterMinTotalDamage = 0;
	let counterMaxTotalDamage = 0;
	let counterKills = { min: 0, max: 0 };

	if (!attackerHasNoEnemyRetaliation) {
		const defenderRemainingIfMaxKills = Math.max(
			0,
			defendingUnit.count - kills.max
		);
		const defenderRemainingIfMinKills = Math.max(
			0,
			defendingUnit.count - kills.min
		);

		if (defenderRemainingIfMaxKills > 0 || defenderRemainingIfMinKills > 0) {
			// Clone units preserving getters/prototype, adjust counts
			const defenderUnitForMinRetaliation = cloneUnitWithCount(
				defendingUnit,
				defenderRemainingIfMaxKills
			);
			const defenderUnitForMaxRetaliation = cloneUnitWithCount(
				defendingUnit,
				defenderRemainingIfMinKills
			);

			// Compute min retaliation damage (using fewer remaining defenders)
			const minRet = computeMeleeDamageOnly(
				defendingHero,
				attackingHero,
				defenderUnitForMinRetaliation,
				attackingUnit
			);
			// Compute max retaliation damage (using more remaining defenders)
			const maxRet = computeMeleeDamageOnly(
				defendingHero,
				attackingHero,
				defenderUnitForMaxRetaliation,
				attackingUnit
			);

			counterMinTotalDamage = minRet.minTotalDamage;
			counterMaxTotalDamage = maxRet.maxTotalDamage;
			counterKills = calculateKills(
				counterMinTotalDamage,
				counterMaxTotalDamage,
				attackingUnit.health
			);
		}
	}

	return {
		attackerCount: attackingUnit.count,
		defenderCount: defendingUnit.count,
		minTotalDamage,
		maxTotalDamage,
		minTotalRangedDamage,
		maxTotalRangedDamage,
		kills,
		rangedKills,
		counterMinTotalDamage,
		counterMaxTotalDamage,
		counterKills,
		attackerSpecialtyAttackBonus,
		attackerSpecialtyDefenseBonus,
		defenderSpecialtyAttackBonus,
		defenderSpecialtyDefenseBonus,
		attackSkillBonus,
		offenseBonus,
		offenseSpecialityBonus,
		archeryBonus: attackingHero.archeryBonus,
		archerySpecialtyBonus: attackingHero.archerySpecialtyBonus,
		defenseSkillReduction,
		armorerReduction,
		armorerSpecialityBonus,
		meleePenaltyReduction,
		slayerAttackBonus,
	};
}

/* eslint-disable-next-line consistent-return */
function calculateSpecialtyAttackBonus(hero, unit) {
	const { speciality: specialitySlug } = hero;
	const { slug: unitSlug } = unit;

	const specialty = specialityService.getSpeciality(specialitySlug);

	if (specialty.type !== 'unit') return 0;

	const affectsUnit = specialty.affectsUnit(unitSlug);
	if (!affectsUnit) return 0;

	if (specialty.scalingType === 'flat') {
		return specialty.scalingStats.attack || 0;
	}

	if (specialty.scalingType === 'level') {
		const { scalingStartLevel } = specialty;
		if (hero.level <= scalingStartLevel) return 0;

		const levelDifference = hero.level - scalingStartLevel;

		return Math.ceil(unit.attack * (0.05 * levelDifference));
	}
}

function calculateSpecialtyDefenseBonus(hero, unit) {
	const { speciality: specialitySlug } = hero;
	const { slug: unitSlug } = unit;

	const specialty = specialityService.getSpeciality(specialitySlug);

	if (specialty.type !== 'unit') return 0;
	if (!specialty.affectsUnit(unitSlug)) return 0;

	const scalingHandlerMap = {
		flat: calculateFlatscalingSpecialtyDefenseBonus,
		level: calculateLevelScalingSpecialtyDefenseBonus,
	};

	return scalingHandlerMap[specialty.scalingType](
		specialty,
		hero.level,
		unit.defense
	);
}

function calculateFlatscalingSpecialtyDefenseBonus(specialty) {
	return specialty.scalingStats.defense || 0;
}

function calculateLevelScalingSpecialtyDefenseBonus(
	specialty,
	heroLevel,
	unitDefense
) {
	const { scalingStartLevel } = specialty;
	if (heroLevel <= scalingStartLevel) return 0;

	const levelDifference = heroLevel - scalingStartLevel;

	return Math.ceil(unitDefense * (0.05 * levelDifference));
}

function calculateBlessSpecialityBonus(attackingHero, attackingUnit) {
	if (attackingHero.hasBlessSpeciality && attackingUnit.spells.bless) {
		return 1 + (attackingHero.level / attackingUnit.level) * 0.03;
	}

	return 1;
}

function calculateKills(minTotalDamage, maxTotalDamage, unitHealth) {
	const minKills = Math.floor(minTotalDamage / unitHealth);
	const maxKills = Math.floor(maxTotalDamage / unitHealth);

	return {
		min: minKills,
		max: maxKills,
	};
}

function calculateAttackSkillBonus(attack, defense) {
	const bonus = 0.05 * (attack - defense);

	if (bonus < 0) return 0;

	return bonus > 3 ? 3 : bonus;
}

function calculateDefenseSkillReduction(attack, defense) {
	const reduction = 0.025 * (defense - attack);

	if (reduction > 0.7) return 0.7;

	return reduction < 0 ? 0 : reduction;
}

function calculateAirShieldSpellReduction(spellLevel = 0) {
	if (spellLevel === 0) return 0;
	return spellLevel > 1 ? 0.5 : 0.25;
}

function calculateShieldSpellReduction(spellLevel = 0) {
	if (spellLevel === 0) return 0;
	return spellLevel > 1 ? 0.3 : 0.15;
}

function calculateSlayerAttackSkillBonus(attackingUnit, defendingUnit) {
	if (!attackingUnit.spells.slayer) return 0;

	const spellLevel = attackingUnit.spells.slayer || 0;

	let affectedUnits = [];

	if (spellLevel === 3) {
		affectedUnits = [...unitService.allGiantUnits];
	}

	if (spellLevel >= 2) {
		affectedUnits = [
			...affectedUnits,
			...unitService.allAngelUnits,
			...unitService.allDevilUnits,
		];
	}

	if (spellLevel >= 1) {
		affectedUnits = [
			...affectedUnits,
			...unitService.allDragonUnits,
			...unitService.allBehemothUnits,
			...unitService.allHydraUnits,
			...unitService.allPhoenixUnits,
			...unitService.allHaspidUnits,
		];
	}

	const affectedUnitNames = affectedUnits.map((unit) => unit.name);
	const isAffected = affectedUnitNames.includes(defendingUnit.name);

	return isAffected ? 8 : 0;
}

// Compute melee-only damage from attacker->defender using the same rules as above,
// but without ranged pathways. Returns an object with minTotalDamage and maxTotalDamage.
function computeMeleeDamageOnly(attHero, defHero, attUnit, defUnit) {
	const attackerSpecialtyAttackBonus = calculateSpecialtyAttackBonus(
		attHero,
		attUnit
	);
	const defenderSpecialtyDefenseBonus = calculateSpecialtyDefenseBonus(
		defHero,
		defUnit
	);

	const slayerAttackBonus = calculateSlayerAttackSkillBonus(attUnit, defUnit);

	const totalAttack =
		attHero.attack + attUnit.totalAttackSkill + slayerAttackBonus + attackerSpecialtyAttackBonus;
	const totalDefense =
		defHero.defense + defUnit.totalDefenseSkill + defenderSpecialtyDefenseBonus;

	let { minBaseDamage, maxBaseDamage } = attUnit;
	minBaseDamage *= calculateBlessSpecialityBonus(attHero, attUnit);
	maxBaseDamage *= calculateBlessSpecialityBonus(attHero, attUnit);

	const attackSkillBonus = calculateAttackSkillBonus(totalAttack, totalDefense);
	const defenseSkillReduction = calculateDefenseSkillReduction(
		totalAttack,
		totalDefense
	);

	const offenseBonus = attHero.offenseBonus;
	const offenseSpecialityBonus = attHero.offenseSpecialityBonus;
	const armorerReduction = defHero.armorerBonus;
	const { armorerSpecialityBonus } = defHero;
	const shieldSpellReduction = calculateShieldSpellReduction(
		defUnit.spells.shield ? defHero.skills.earth_magic || 1 : 0
	);
	const meleePenaltyReduction = attUnit.meleePenalty;

	const minTotalDamage =
		attUnit.count *
		minBaseDamage *
		(1 + attackSkillBonus + offenseBonus + offenseSpecialityBonus) *
		(1 - defenseSkillReduction) *
		(1 - armorerReduction) *
		(1 - armorerSpecialityBonus) *
		(1 - shieldSpellReduction) *
		(1 - meleePenaltyReduction);

	const maxTotalDamage =
		attUnit.count *
		maxBaseDamage *
		(1 + attackSkillBonus + offenseBonus + offenseSpecialityBonus) *
		(1 - defenseSkillReduction) *
		(1 - armorerReduction) *
		(1 - armorerSpecialityBonus) *
		(1 - shieldSpellReduction) *
		(1 - meleePenaltyReduction);

	return { minTotalDamage, maxTotalDamage };
}

function cloneUnitWithCount(unit, newCount) {
	const clone = Object.assign(
		Object.create(Object.getPrototypeOf(unit)),
		unit
	);
	clone.count = newCount;
	return clone;
}
