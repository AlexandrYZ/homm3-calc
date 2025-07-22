export default class HistoryView {
    constructor(containerElId) {
        this.containerEl = document.getElementById(containerElId);
    }

    render(history) {
        if (!this.containerEl) return;

        if (!history || history.length === 0) {
            this.containerEl.innerHTML = '<p>No history</p>';
            return;
        }

        const entriesHtml = history
            .map((entry) => {
                const { attackerUnit, defenderUnit, detailedDamageInfo } = entry;
                const minDamage = Math.floor(detailedDamageInfo.minTotalDamage);
                const maxDamage = Math.floor(detailedDamageInfo.maxTotalDamage);
                const kills = detailedDamageInfo.kills;
                const killsText =
                    kills.min === kills.max
                        ? `${kills.max}`
                        : `${kills.min}-${kills.max}`;

                return `
            <div class="history-entry">
                <span>${attackerUnit} vs ${defenderUnit}</span>
                <span>${minDamage}-${maxDamage} dmg, kills ${killsText}</span>
            </div>`;
            })
            .join('');

        this.containerEl.innerHTML = entriesHtml;
    }
}
