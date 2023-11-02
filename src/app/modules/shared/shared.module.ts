import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddQuestionsModalComponent } from '@modules/form/modals/add-questions-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SwiperModule } from 'swiper/angular';
import { TabsComponent } from './tab/tabs.component';
import { TabContainerComponent } from './tab/tab-container.component';

@NgModule({
    declarations: [
        AddQuestionsModalComponent,
        TabsComponent,
        TabContainerComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        NgSelectModule,
        NgbModule,
        NgxSpinnerModule,
        NgImageSliderModule,
        NgImageFullscreenViewModule,
    ],
    exports: [
        TranslateModule,
        FormsModule,
        NgSelectModule,
        NgbModule,
        ReactiveFormsModule,
        SwiperModule,
        CommonModule,
        NgxSpinnerModule,
        NgImageSliderModule,
        NgImageFullscreenViewModule,
        AddQuestionsModalComponent,
        TabsComponent,
        TabContainerComponent,
    ],
    providers: [],
})
export class SharedModule {}
