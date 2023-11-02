import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpResponse,
} from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        private modalService: NgbModal,
        private translate: TranslateService
    ) { }
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next
            .handle(request)
            .pipe(
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        if (event?.body?.errorMessage) {
                            throw new HttpErrorResponse({
                                error: {
                                    errorMessage: event.body.errorMessage,
                                },
                                headers: event.headers,
                                status: 400,
                                statusText: 'Warning',
                                url: event.url,
                            });
                        }
                        return event;
                    }
                })
            )
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let errorMsg = '';
                    if (error.error) {
                        errorMsg = `${error.error.errorMessage}`;
                    } else {
                        errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
                    }
                    return throwError(errorMsg);
                })
            );
    }
}
