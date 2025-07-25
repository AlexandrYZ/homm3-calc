export default class Results {
	constructor(containerElId) {
		this.containerEl = document.getElementById(containerElId);
	}

        render(detailedDamageInfo) {
                const {
                        minDamageText,
                        maxDamageText,
                        minTotalRangedDamage,
			maxTotalRangedDamage,
			averageDamage,
			averageRangedDamage,
			kills,
			rangedKills,
			attackSkillBonusText,
			defenseSkillBonusText,
			offenseBonusText,
			armorerReductionText,
			offenseSpecialityBonusHtml,
			archeryBonus,
			// archerySpecialtyBonus,
			armorerSpecialityBonusHtml,
                        totalOffenseBonusText,
                        totalArmorerBonusText,
                        meleePenaltyReduction,
                        counterMinDamageText,
                        counterMaxDamageText,
                        counterAverageDamage,
                        counterKills,
                } = formatDamageOutput(detailedDamageInfo);

                const headerData = {
                        minDamageText,
                        maxDamageText,
                        minTotalRangedDamage,
                        maxTotalRangedDamage,
                        averageDamage,
                        averageRangedDamage,
                        kills,
                        rangedKills,
                        counterMinDamageText,
                        counterMaxDamageText,
                        counterAverageDamage,
                        counterKills,
                };

		this.containerEl.innerHTML = `
      ${createResultsHeader(headerData)}

      <div id="results-bonuses">
        <h5>Bonuses</h5>
        <h5>Reductions</h5>
        <p>Attack skill: <span>${attackSkillBonusText}%</span></p>
        <p>Defense skill: <span>${defenseSkillBonusText}%</span></p>

        <p>Offense: <span>${offenseBonusText}%</span></p>
        <p>Armorer: <span>${armorerReductionText}%</span></p>

        ${offenseSpecialityBonusHtml}
        ${armorerSpecialityBonusHtml}

        <p>Offense total: <span>${totalOffenseBonusText}%</span></p>
        <p>Armorer total: <span>${totalArmorerBonusText}%</span></p>

        <p>Archery bonus: <span>${archeryBonus * 100}%</span></p>
        <p>Melee penalty: <span>${meleePenaltyReduction * 100}%</span></p>
      </div>
    `;
	}
}

function createResultsHeader(detailedDamageInfo) {
        const {
                minDamageText,
                maxDamageText,
                averageDamage,
                averageRangedDamage,
                kills,
                rangedKills,
                minTotalRangedDamage,
                maxTotalRangedDamage,
                counterMinDamageText,
                counterMaxDamageText,
                counterAverageDamage,
                counterKills,
        } = detailedDamageInfo;

        const meleeHeaderData = {
                title: 'Melee damage',
                minDamage: minDamageText,
                maxDamage: maxDamageText,
                averageDamage,
                kills,
        };

        const counterHeaderData = {
                title: 'Counter damage',
                minDamage: counterMinDamageText,
                maxDamage: counterMaxDamageText,
                averageDamage: counterAverageDamage,
                kills: counterKills,
        };

	const rangedHeaderData = {
		title: 'Ranged damage',
		minDamage: minTotalRangedDamage,
		maxDamage: maxTotalRangedDamage,
		averageDamage: averageRangedDamage,
		kills: rangedKills,
	};

        const meleeHeader = createResultsHeaderItem(meleeHeaderData);
        let rangedHeader = '';
        const counterHeader = createResultsHeaderItem(counterHeaderData);

	if (maxTotalRangedDamage > 0) {
		rangedHeader = createResultsHeaderItem(rangedHeaderData);
	}

        const headerHtml = rangedHeader + meleeHeader + counterHeader;

	return `
    <div id="results-header">
      ${headerHtml}
    </div>
  `;
}

function createResultsHeaderItem(damageDetails) {
	const { title, minDamage, maxDamage, averageDamage, kills } = damageDetails;

	const minDamageText = Math.floor(minDamage);
	const maxDamageText = Math.floor(maxDamage);
	const averageDamageText = Math.floor(averageDamage).toPrecision();

	const rangeText =
		minDamage === maxDamage
			? `${maxDamageText}`
			: `${minDamageText}-${maxDamageText}`;

	const killsText =
		kills.min === kills.max ? `${kills.max}` : `${kills.min}-${kills.max}`;

	return `
    <h5>${title}</h5>

    <div id="results-damage">
      <p>Range: <span>${rangeText}</span></p>
      <p>Average: <span>${averageDamageText}</span></p>
      <p>Kills: <span>${killsText}</span></p>
    </div>
  `;
}

function formatDamageOutput(detailedDamageInfo) {
        const {
                minTotalDamage,
                maxTotalDamage,
                kills,
                minTotalRangedDamage,
                maxTotalRangedDamage,
                rangedKills,
                attackSkillBonus,
                offenseBonus,
                offenseSpecialityBonus,
                archeryBonus,
                defenseSkillReduction,
                armorerReduction,
                armorerSpecialityBonus,
                meleePenaltyReduction,
                counterDamage,
        } = detailedDamageInfo;

	const minDamageText = Math.floor(minTotalDamage);
	const maxDamageText = Math.floor(maxTotalDamage);
	const averageDamage = Math.floor(
		(detailedDamageInfo.minTotalDamage + detailedDamageInfo.maxTotalDamage) / 2
	);

        const averageRangedDamage = Math.floor(
                (detailedDamageInfo.minTotalRangedDamage +
                        detailedDamageInfo.maxTotalRangedDamage) /
                        2
        );

        let counterMinDamageText = 0;
        let counterMaxDamageText = 0;
        let counterAverageDamage = 0;
        let counterKills = { min: 0, max: 0 };

        if (detailedDamageInfo.counterDamage) {
                const { minTotalDamage: counterMin, maxTotalDamage: counterMax, kills: cKills } =
                        detailedDamageInfo.counterDamage;
                counterMinDamageText = Math.floor(counterMin);
                counterMaxDamageText = Math.floor(counterMax);
                counterAverageDamage = Math.floor((counterMin + counterMax) / 2);
                counterKills = cKills;
        }

	const attackSkillBonusText = `${(attackSkillBonus * 100).toFixed(1)}`;
	const defenseSkillBonusText = `${(defenseSkillReduction * 100).toFixed(1)}`;

	const offenseBonusText = `${(offenseBonus * 100).toFixed(1)}`;
	const offenseSpecialityBonusText = `${(offenseSpecialityBonus * 100).toFixed(
		1
	)}%`;
	const armorerReductionText = `${(armorerReduction * 100).toFixed(1)}`;
	const armorerSpecialityBonusText = `${(armorerSpecialityBonus * 100).toFixed(
		2
	)}%`;

	const offenseSpecialityBonusHtml = `<p>Offense speciality: <span>${offenseSpecialityBonusText}</span></p>`;
	const armorerSpecialityBonusHtml = `<p>Armorer speciality: <span>${armorerSpecialityBonusText}</span></p>`;

	const totalOffenseBonus =
		(Math.abs(offenseSpecialityBonus) + Math.abs(offenseBonus)) * 100;
	const totalOffenseBonusText = `${totalOffenseBonus.toFixed(1)}`;

	const totalArmorerBonus = armorerReduction + armorerSpecialityBonus;
	const totalArmorerBonusText = `${(totalArmorerBonus * 100).toFixed(2)}`;

	return {
		minDamageText,
		maxDamageText,
		minTotalRangedDamage,
		maxTotalRangedDamage,
		averageDamage,
		averageRangedDamage,
		kills,
		rangedKills,
		attackSkillBonusText,
		defenseSkillBonusText,
		offenseBonusText,
		offenseSpecialityBonusText,
		armorerReductionText,
		armorerSpecialityBonusText,
		offenseSpecialityBonusHtml,
		archeryBonus,
		armorerSpecialityBonusHtml,
		totalOffenseBonus,
		totalOffenseBonusText,
                totalArmorerBonus,
                totalArmorerBonusText,
                meleePenaltyReduction,
                counterMinDamageText,
                counterMaxDamageText,
                counterAverageDamage,
                counterKills,
        };
}
