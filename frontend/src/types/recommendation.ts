import type { YogaPose } from './yoga-pose';

export interface Recommendation {
  yogaPose: YogaPose;
  matchScore: number;
  reason: string;
}
