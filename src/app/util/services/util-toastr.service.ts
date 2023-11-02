import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export class UtilToastrService {
    constructor(
        private translate: TranslateService,
    ) { }

    toastByApiResult(
        result: { errorMessage: string },
        successMessageKey: string = 'Common.Success'
    ): void {
        if (!!result.errorMessage) {
        } else {
        }
    }

    toastSuccess(successMessageKey: string = 'Common.Success'): void {
    }
}
