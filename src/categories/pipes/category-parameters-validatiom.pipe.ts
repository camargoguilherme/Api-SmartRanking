import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
export class CategoryParameterValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException(
        `Parameter '${metadata.data}' not be empty`,
      );
    }
    return value;
  }
}
