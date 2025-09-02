import ResultsView from '../src/views/results.js';

function mountRoot() {
  const container = { innerHTML: '' };
  global.document = {
    getElementById: (id) => container,
  };
  return container;
}

function sampleDetails({ withRanged = false } = {}) {
  return {
    minTotalDamage: 100,
    maxTotalDamage: 150,
    minTotalRangedDamage: withRanged ? 60 : 0,
    maxTotalRangedDamage: withRanged ? 80 : 0,
    kills: { min: 1, max: 2 },
    rangedKills: { min: 0, max: 0 },
    counterMinTotalDamage: 30,
    counterMaxTotalDamage: 40,
    counterKills: { min: 0, max: 1 },
    attackSkillBonus: 0.1,
    defenseSkillReduction: 0.05,
    offenseBonus: 0.2,
    offenseSpecialityBonus: 0,
    archeryBonus: 0,
    armorerReduction: 0.1,
    armorerSpecialityBonus: 0,
    meleePenaltyReduction: 0,
  };
}

describe('ResultsView UI', () => {
  test('renders Counter-attack panel with values', () => {
    const container = mountRoot();
    const view = new ResultsView('results');
    view.render(sampleDetails());

    const html = container.innerHTML;
    expect(html).toContain('<h5>Counter-attack</h5>');
    expect(html).toContain('Range: <span>30-40</span>');
    expect(html).toContain('Kills: <span>0-1</span>');
  });

  test('hides Ranged panel when ranged damage is zero', () => {
    const container = mountRoot();
    const view = new ResultsView('results');
    view.render(sampleDetails({ withRanged: false }));

    const html = container.innerHTML;
    expect(html).not.toContain('<h5>Ranged damage</h5>');
    // Order check: Ranged omitted; Melee then Counter
    const meleeIndex = html.indexOf('<h5>Melee damage</h5>');
    const counterIndex = html.indexOf('<h5>Counter-attack</h5>');
    expect(meleeIndex).toBeGreaterThanOrEqual(0);
    expect(counterIndex).toBeGreaterThan(meleeIndex);
  });

  test('shows Ranged panel when ranged damage is present', () => {
    const container = mountRoot();
    const view = new ResultsView('results');
    view.render(sampleDetails({ withRanged: true }));

    const html = container.innerHTML;
    const rangedIndex = html.indexOf('<h5>Ranged damage</h5>');
    const meleeIndex = html.indexOf('<h5>Melee damage</h5>');
    const counterIndex = html.indexOf('<h5>Counter-attack</h5>');
    expect(rangedIndex).toBeLessThan(meleeIndex);
    expect(meleeIndex).toBeLessThan(counterIndex);
    expect(html).toContain('Range: <span>60-80</span>');
  });
});
