import damageService from '../src/services/damageService';
import Hero from '../src/models/Hero';
import unitService from '../src/services/unitService';

describe('detailedTotalDamageCalculation', () => {
  test('computes counter attack damage accounting for losses', () => {
    const attackerHero = new Hero('A', 0, 0, 1, 'archers', {});
    const defenderHero = new Hero('D', 0, 0, 1, 'archers', {});

    const attackerUnit = { ...unitService.getUnit('PIKEMAN'), count: 10 };
    const defenderUnit = { ...unitService.getUnit('GRIFFIN'), count: 10 };

    const result = damageService.detailedTotalDamageCalculation(
      attackerHero,
      defenderHero,
      attackerUnit,
      defenderUnit
    );

    expect(result.counterDamage).not.toBeNull();
    expect(result.counterDamage.minTotalDamage).toBeCloseTo(31.05);
    expect(result.counterDamage.maxTotalDamage).toBeCloseTo(69);
    expect(result.counterDamage.kills).toEqual({ min: 3, max: 6 });
  });

  test('returns null counter damage when disabled', () => {
    const attackerHero = new Hero('A', 0, 0, 1, 'archers', {});
    const defenderHero = new Hero('D', 0, 0, 1, 'archers', {});

    const attackerUnit = { ...unitService.getUnit('PIKEMAN'), count: 10 };
    const defenderUnit = { ...unitService.getUnit('GRIFFIN'), count: 10 };

    const result = damageService.detailedTotalDamageCalculation(
      attackerHero,
      defenderHero,
      attackerUnit,
      defenderUnit,
      false
    );

    expect(result.counterDamage).toBeNull();
  });
});
