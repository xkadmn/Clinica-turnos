import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'aprobado'
})
export class AprobadoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
