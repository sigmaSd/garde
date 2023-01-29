export interface WorkResult {
  result: CalcResult[];
  totalScore: TotalScoreType[];
}

export type Persons = Record<string, string[]>;

export interface CalcResult {
  name: string;
  date: string;
  score: number;
}

export interface TotalScoreType {
  name: string;
  score: number;
}
