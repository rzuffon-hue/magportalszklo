export interface DiceHandEvaluation {
  handType: 'POKER' | 'KARETA' | 'FULL_HOUSE' | 'DUŻY_STRIT' | 'MAŁY_STRIT' | 'TRÓJKA' | 'DWIE_PARY' | 'PARA' | 'WYSOKA_SUMA';
  handNamePl: string;
  handRank: number; // 9 = Poker, 1 = Wysoka Suma
  primaryValue: number; // e.g. die value for 5-of-a-kind, 4-of-a-kind, triplet
  secondaryValue: number; // e.g. pair value in Full House or second pair
  kickersSum: number; // sum of remaining dice
  totalSum: number;
  description: string;
}

/**
 * Evaluates 5 dice (each 1..6) and returns deterministic hand rank & metadata
 */
export function evaluateDiceHand(dice: number[]): DiceHandEvaluation {
  if (!dice || dice.length !== 5) {
    return {
      handType: 'WYSOKA_SUMA',
      handNamePl: 'Brak kości',
      handRank: 1,
      primaryValue: 0,
      secondaryValue: 0,
      kickersSum: 0,
      totalSum: 0,
      description: 'Niekompletny rzut',
    };
  }

  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  let totalSum = 0;

  dice.forEach((val) => {
    counts[val] = (counts[val] || 0) + 1;
    totalSum += val;
  });

  const sortedDice = [...dice].sort((a, b) => a - b);
  const diceStr = sortedDice.join('');

  // 1. POKER (Five of a kind)
  for (let val = 6; val >= 1; val--) {
    if (counts[val] === 5) {
      return {
        handType: 'POKER',
        handNamePl: 'POKER! (Pięć jednakowych)',
        handRank: 9,
        primaryValue: val,
        secondaryValue: 0,
        kickersSum: 0,
        totalSum,
        description: `Pięć ${val}-ek`,
      };
    }
  }

  // 2. KARETA (Four of a kind)
  for (let val = 6; val >= 1; val--) {
    if (counts[val] === 4) {
      const kicker = sortedDice.find((d) => d !== val) || 0;
      return {
        handType: 'KARETA',
        handNamePl: 'KARETA (Cztery jednakowe)',
        handRank: 8,
        primaryValue: val,
        secondaryValue: 0,
        kickersSum: kicker,
        totalSum,
        description: `Cztery ${val}-ki (kicker ${kicker})`,
      };
    }
  }

  // 3. FULL HOUSE (3 + 2)
  let tripletVal = 0;
  let pairVal = 0;
  for (let val = 6; val >= 1; val--) {
    if (counts[val] === 3) tripletVal = val;
    else if (counts[val] === 2) pairVal = val;
  }
  if (tripletVal > 0 && pairVal > 0) {
    return {
      handType: 'FULL_HOUSE',
      handNamePl: 'FULL HOUSE (Trójka i Para)',
      handRank: 7,
      primaryValue: tripletVal,
      secondaryValue: pairVal,
      kickersSum: 0,
      totalSum,
      description: `Trzy ${tripletVal}-ki i dwa ${pairVal}-ki`,
    };
  }

  // 4. DUŻY STRIT (2-3-4-5-6)
  if (diceStr === '23456') {
    return {
      handType: 'DUŻY_STRIT',
      handNamePl: 'DUŻY STRIT (2-3-4-5-6)',
      handRank: 6,
      primaryValue: 6,
      secondaryValue: 0,
      kickersSum: 0,
      totalSum,
      description: 'Strit wysoki (2, 3, 4, 5, 6)',
    };
  }

  // 5. MAŁY STRIT (1-2-3-4-5)
  if (diceStr === '12345') {
    return {
      handType: 'MAŁY_STRIT',
      handNamePl: 'MAŁY STRIT (1-2-3-4-5)',
      handRank: 5,
      primaryValue: 5,
      secondaryValue: 0,
      kickersSum: 0,
      totalSum,
      description: 'Strit niski (1, 2, 3, 4, 5)',
    };
  }

  // 6. TRÓJKA (Three of a kind)
  if (tripletVal > 0) {
    const kickers = sortedDice.filter((d) => d !== tripletVal);
    const kickersSum = kickers.reduce((a, b) => a + b, 0);
    return {
      handType: 'TRÓJKA',
      handNamePl: 'TRÓJKA (Trzy jednakowe)',
      handRank: 4,
      primaryValue: tripletVal,
      secondaryValue: 0,
      kickersSum,
      totalSum,
      description: `Trzy ${tripletVal}-ki`,
    };
  }

  // 7. DWIE PARY
  const pairs: number[] = [];
  for (let val = 6; val >= 1; val--) {
    if (counts[val] === 2) pairs.push(val);
  }
  if (pairs.length === 2) {
    const highPair = Math.max(pairs[0], pairs[1]);
    const lowPair = Math.min(pairs[0], pairs[1]);
    const kicker = sortedDice.find((d) => d !== highPair && d !== lowPair) || 0;
    return {
      handType: 'DWIE_PARY',
      handNamePl: 'DWIE PARY',
      handRank: 3,
      primaryValue: highPair,
      secondaryValue: lowPair,
      kickersSum: kicker,
      totalSum,
      description: `Pary ${highPair} oraz ${lowPair}`,
    };
  }

  // 8. PARA
  if (pairs.length === 1) {
    const pVal = pairs[0];
    const kickers = sortedDice.filter((d) => d !== pVal);
    const kickersSum = kickers.reduce((a, b) => a + b, 0);
    return {
      handType: 'PARA',
      handNamePl: 'PARA',
      handRank: 2,
      primaryValue: pVal,
      secondaryValue: 0,
      kickersSum,
      totalSum,
      description: `Para ${pVal}-ek`,
    };
  }

  // 9. WYSOKA SUMA
  return {
    handType: 'WYSOKA_SUMA',
    handNamePl: 'NAJWYŻSZA SUMA',
    handRank: 1,
    primaryValue: sortedDice[4], // highest die
    secondaryValue: 0,
    kickersSum: totalSum,
    totalSum,
    description: `Suma oczek: ${totalSum}`,
  };
}

/**
 * Compare two hand evaluations.
 * Returns 1 if handA > handB, -1 if handB > handA, 0 if tie.
 */
export function compareDiceHands(handA: DiceHandEvaluation, handB: DiceHandEvaluation): number {
  if (handA.handRank !== handB.handRank) {
    return handA.handRank > handB.handRank ? 1 : -1;
  }
  if (handA.primaryValue !== handB.primaryValue) {
    return handA.primaryValue > handB.primaryValue ? 1 : -1;
  }
  if (handA.secondaryValue !== handB.secondaryValue) {
    return handA.secondaryValue > handB.secondaryValue ? 1 : -1;
  }
  if (handA.kickersSum !== handB.kickersSum) {
    return handA.kickersSum > handB.kickersSum ? 1 : -1;
  }
  if (handA.totalSum !== handB.totalSum) {
    return handA.totalSum > handB.totalSum ? 1 : -1;
  }
  return 0; // Absolute tie
}

/**
 * ELO calculation algorithm.
 * Returns rounded integer changes for player A and player B.
 */
export function calculateEloChange(ratingA: number, ratingB: number, scoreA: 1 | 0 | 0.5): { changeA: number; changeB: number } {
  const K = 32;
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
  const expectedB = 1 - expectedA;
  const scoreB = 1 - scoreA;

  let changeA = Math.round(K * (scoreA - expectedA));
  let changeB = Math.round(K * (scoreB - expectedB));

  // Ensure minimum 1 point gained on win, minimum 1 point lost on loss
  if (scoreA === 1 && changeA <= 0) changeA = 1;
  if (scoreA === 0 && changeA >= 0) changeA = -1;
  if (scoreB === 1 && changeB <= 0) changeB = 1;
  if (scoreB === 0 && changeB >= 0) changeB = -1;

  return { changeA, changeB };
}
