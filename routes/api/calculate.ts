class Player {
  name: string;
  dates: Date[];
  score = 0;

  constructor(name: string, dates: Date[]) {
    this.name = name;
    this.dates = dates;
  }
}

function genDates() {
  return Array(29)
    .fill(0)
    .map((_, i) => new Date(`2023-02-${i.toString().padStart(2, "0")}`))
    .slice(1);
}

function genScores(dates: Date[]) {
  const scores = [];
  for (const date of dates) {
    const dayName = date.toLocaleDateString("us-US", { weekday: "long" });
    const score = dayName === "Sunday" ? 2 : dayName === "Saturday" ? 1.5 : 1;

    scores.push({
      date,
      score,
    });
  }

  return scores;
}

function assign(players: Player[], ds: { date: Date; score: number }) {
  const playersSortedWithLowestScore = players
    .sort((p1, p2) => p1.score - p2.score);

  for (const player of playersSortedWithLowestScore) {
    if (player.dates.find((date) => date.getTime() === ds.date.getTime())) {
      // player can't take this date
      continue;
    }
    player.score += ds.score;
    return player;
  }
  console.warn("All players declared the same date");
}

export function calculate(playersInput: Record<string, Date[]>) {
  const players = shuffle(
    Object.entries(playersInput)
      .map((p) => new Player(p[0], p[1])),
  );

  const dates = genDates();
  const datesWithScores = genScores(dates);

  const result = [];

  for (const ds of datesWithScores) {
    const player = assign(players, ds);
    if (!player) break;
    result.push({
      name: player.name,
      date: ds.date,
      score: ds.score,
    });
  }

  return {
    result,
    totalScore: players.map((p) => {
      return {
        name: p.name,
        score: p.score,
      };
    }),
  };
}

function shuffle<T>(array: T[]) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
