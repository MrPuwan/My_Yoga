export const DIFFICULTIES = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export type PainArea = string;

export interface YogaPose {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  benefits: string[];
  precautions: string[];
  difficulty: Difficulty;
  imageUrl: string | null;
  durationSeconds: number | null;
  targetAreas: string[];
  suitablePainAreas: PainArea[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface YogaPosePayload {
  name: string;
  description: string;
  instructions: string[];
  benefits: string[];
  precautions: string[];
  difficulty: Difficulty;
  imageUrl?: string;
  durationSeconds?: number;
  targetAreas: string[];
  suitablePainAreas: PainArea[];
  isActive?: boolean;
}

export interface YogaPoseListParams {
  page?: number;
  limit?: number;
  difficulty?: Difficulty;
  painArea?: PainArea;
  search?: string;
  isActive?: boolean;
}

export interface YogaPoseListResponse {
  data: YogaPose[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
