import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelpDirective } from './directives/help.directive';
import { HelperComponent } from './helper/helper.component';
import { SparklineComponent } from './sparkline/sparkline.component';

@NgModule({
  declarations: [
    AppComponent,
    HelpDirective,
    HelperComponent,
    SparklineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
