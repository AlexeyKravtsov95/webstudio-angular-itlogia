import { ActiveParamsInterface } from '../../interfaces/active-params.interface';
import { Params } from '@angular/router';

export class ActiveParamsUtil {
  static processParams(params: Params): ActiveParamsInterface {
    const activeParams: ActiveParamsInterface = { categories: [] };

    if (Object.prototype.hasOwnProperty.call(params, 'categories')) {
      activeParams.categories = Array.isArray(params['categories'])
        ? params['categories']
        : [params['categories']];
    }

    if (Object.prototype.hasOwnProperty.call(params, 'page')) {
      activeParams.page = +params['page'];
    }

    return activeParams;
  }
}
