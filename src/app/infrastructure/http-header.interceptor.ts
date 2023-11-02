import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpEvent,
    HttpResponse,
    HttpRequest,
    HttpHandler,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslationService } from '@modules/i18n';

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {
    constructor(private translationService: TranslationService) {}

    intercept(
        httpRequest: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        let language = this.translationService.getSelectedLanguage();

        return next.handle(
            httpRequest.clone({ setHeaders: { 'User-Culture': language } })
        );
    }
}
