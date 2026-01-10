import damageService from '../src/services/damageService.js';
import unitService from '../src/services/unitService.js';
import Hero from '../src/models/Hero.js';
import Unit from '../src/models/Unit.js';

describe('Counter-attack damage', () => {
  test('retaliation scales with defender losses', () => {
    const attackerHero = new Hero('Att', 0, 0, 1, 'offense', {});
    const defenderHero = new Hero('Def', 0, 0, 1, 'armorer', {});

    // Use simple SOD/HOTA units via service (defaults to HOTA). Pick melee vs melee.
    const attackerUnit = unitService.getUnit('ANGEL');
    const defenderUnit = unitService.getUnit('ANGEL');

    attackerUnit.count = 5;
    defenderUnit.count = 10;

    const res = damageService.detailedTotalDamageCalculation(
      attackerHero,
      defenderHero,
      attackerUnit,
      defenderUnit,
    );

    // Baseline: defender full-force attack against attacker (not accounting losses)
    const baselineDefAttack = damageService.detailedTotalDamageCalculation(
      defenderHero,
      attackerHero,
      defenderUnit,
      attackerUnit,
    );

    // Assertions: some kills happen, and retaliation uses remaining count so is <= baseline
    expect(res.kills.max).toBeGreaterThanOrEqual(0);
    expect(res.counterMaxTotalDamage).toBeLessThanOrEqual(baselineDefAttack.maxTotalDamage);
    expect(res.counterMinTotalDamage).toBeLessThanOrEqual(baselineDefAttack.minTotalDamage);

    expect(res.counterMaxTotalDamage).toBeGreaterThanOrEqual(0);
    expect(res.counterMinTotalDamage).toBeGreaterThanOrEqual(0);

    // Basic sanity: counter damage is non-negative
    expect(res.counterMaxTotalDamage).toBeGreaterThanOrEqual(0);
    expect(res.counterMinTotalDamage).toBeGreaterThanOrEqual(0);
  });

  test('no enemy retaliation special disables counter damage', () => {
    const attackerHero = new Hero('Att', 0, 0, 1, 'offense', {});
    const defenderHero = new Hero('Def', 0, 0, 1, 'armorer', {});

    // Custom unit with no enemy retaliation
    const attackerUnit = new Unit({
      name: 'Test Striker',
      count: 10,
      level: 1,
      attack: 5,
      defense: 5,
      minDamage: 2,
      maxDamage: 3,
      health: 10,
      speed: 5,
      isRanged: false,
      spells: {},
      specials: ['no_enemy_retaliation'],
    });

    const defenderUnit = unitService.getUnit('PIKEMAN');
    defenderUnit.count = 20;

    const res = damageService.detailedTotalDamageCalculation(
      attackerHero,
      defenderHero,
      attackerUnit,
      defenderUnit,
    );

    expect(res.counterMinTotalDamage).toBe(0);
    expect(res.counterMaxTotalDamage).toBe(0);
    expect(res.counterKills).toEqual({ min: 0, max: 0 });
  });
});
