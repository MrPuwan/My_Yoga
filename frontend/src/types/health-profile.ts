import type { PainArea } from './yoga-pose';

export interface HealthProfile {
  id: string;
  userId: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  bmiCategory: string;
  painArea: PainArea;
  activityLevel: string | null;
  medicalConditions: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HealthProfilePayload {
  age: number;
  gender: string;
  height: number;
  weight: number;
  painArea: PainArea;
  activityLevel?: string;
  medicalConditions?: string;
}
