import { Component, OnInit } from '@angular/core';
import { TranslationService } from './modules/i18n';
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as noLang } from './modules/i18n/vocabs/no';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'body[root]',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    loggedIn: boolean;
    constructor(
        private translationService: TranslationService,
    ) {
        // register translations
        this.translationService.loadTranslations(enLang, noLang);
    }

    ngOnInit() {
    }
}
