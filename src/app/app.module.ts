import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardModule } from 'ngx-clipboard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// #fake-start#
import { HttpHeaderInterceptor } from './infrastructure/http-header.interceptor';
import { HttpErrorInterceptor } from './infrastructure/_index';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ClipboardModule,
        AppRoutingModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true,
            deps: [NgbModal],
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpHeaderInterceptor,
            multi: true,
            deps: [],
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
