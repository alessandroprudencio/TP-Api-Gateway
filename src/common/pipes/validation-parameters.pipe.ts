import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PlayersValidationParameterPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === '' && metadata.type === 'query') {
      throw new BadRequestException(`The value from ${metadata.data} is required`);
    }

    return value;
  }
}
