import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';

export class ChallengeStatusValidacaoPipe implements PipeTransform {
  readonly statusPermitted = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELLED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.isValidStatus(status)) {
      throw new BadRequestException(`${status} is an invalid status`);
    }

    return value;
  }

  private isValidStatus(status: any) {
    const idx = this.statusPermitted.indexOf(status);
    // -1 se o elemento não for encontrado
    return idx !== -1;
  }
}
