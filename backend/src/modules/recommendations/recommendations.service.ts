import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Difficulty,
  type HealthProfile,
  type YogaPose,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RecommendationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getForUser(userId: string) {
    const profile = await this.prisma.healthProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(
        'Health profile not found. Create a health profile before requesting recommendations.',
      );
    }

    const painArea = profile.painArea;
    const activity = this.getActivityLevel(profile.activityLevel);
    const isObese = profile.bmiCategory.toLowerCase() === 'obese';
    const allowedDifficulties = this.getAllowedDifficulties(
      activity,
      isObese,
      painArea === GENERAL_WELLNESS,
    );

    const poses = await this.prisma.yogaPose.findMany({
      where: {
        isActive: true,
        difficulty: { in: allowedDifficulties },
        suitablePainAreas: {
          hasSome:
            painArea === GENERAL_WELLNESS
              ? [GENERAL_WELLNESS]
              : [painArea, GENERAL_WELLNESS],
        },
      },
    });

    return poses
      .filter(
        (pose) =>
          pose.isActive &&
          allowedDifficulties.includes(pose.difficulty) &&
          (pose.suitablePainAreas.includes(painArea) ||
            pose.suitablePainAreas.includes(GENERAL_WELLNESS)),
      )
      .map((pose) => this.rankPose(pose, profile, painArea, activity))
      .sort((first, second) => second.matchScore - first.matchScore)
      .slice(0, 10);
  }

  private rankPose(
    pose: YogaPose,
    profile: HealthProfile,
    painArea: string,
    activity: ActivityLevel,
  ) {
    let matchScore = 0;
    const reasons: string[] = [];
    const exactMatch = pose.suitablePainAreas.includes(painArea);

    if (exactMatch) {
      matchScore += 100;
      reasons.push(
        painArea === GENERAL_WELLNESS
          ? 'Supports general wellness'
          : `Matches your ${painArea.toLowerCase()} pain area`,
      );
    } else if (pose.suitablePainAreas.includes(GENERAL_WELLNESS)) {
      matchScore += 40;
      reasons.push('Suitable as a general wellness pose');
    }

    if (profile.bmiCategory.toLowerCase() === 'obese') {
      if (pose.difficulty === Difficulty.BEGINNER) {
        matchScore += 30;
        reasons.push('Beginner-friendly for your BMI category');
      }
    } else {
      matchScore += this.getDifficultyScore(pose.difficulty, activity);
      reasons.push(this.getActivityReason(pose.difficulty, activity));
    }

    return {
      yogaPose: pose,
      matchScore,
      reason: reasons.join('. '),
    };
  }

  private getAllowedDifficulties(
    activity: ActivityLevel,
    isObese: boolean,
    generalWellnessOnly: boolean,
  ): Difficulty[] {
    if (generalWellnessOnly || isObese || activity === 'LOW') {
      return [Difficulty.BEGINNER];
    }
    if (activity === 'MEDIUM') {
      return [Difficulty.BEGINNER, Difficulty.INTERMEDIATE];
    }
    return [
      Difficulty.BEGINNER,
      Difficulty.INTERMEDIATE,
      Difficulty.ADVANCED,
    ];
  }

  private getDifficultyScore(
    difficulty: Difficulty,
    activity: ActivityLevel,
  ): number {
    if (activity === 'LOW') {
      return difficulty === Difficulty.BEGINNER ? 25 : 0;
    }
    if (activity === 'MEDIUM') {
      return difficulty === Difficulty.INTERMEDIATE ? 20 : 10;
    }
    if (difficulty === Difficulty.ADVANCED) return 20;
    if (difficulty === Difficulty.INTERMEDIATE) return 15;
    return 10;
  }

  private getActivityReason(
    difficulty: Difficulty,
    activity: ActivityLevel,
  ): string {
    if (activity === 'LOW') return 'Beginner-friendly for your activity level';
    if (activity === 'MEDIUM') {
      return difficulty === Difficulty.INTERMEDIATE
        ? 'Matches your moderate activity level'
        : 'Accessible for your moderate activity level';
    }
    return 'Suitable for your high activity level';
  }

  private getActivityLevel(activityLevel: string | null): ActivityLevel {
    const normalized = activityLevel?.trim().toLowerCase() ?? '';
    if (normalized.includes('high') || normalized.includes('very')) {
      return 'HIGH';
    }
    if (normalized.includes('medium') || normalized.includes('moderat')) {
      return 'MEDIUM';
    }
    return 'LOW';
  }

}

type ActivityLevel = 'LOW' | 'MEDIUM' | 'HIGH';
const GENERAL_WELLNESS = 'NONE';
