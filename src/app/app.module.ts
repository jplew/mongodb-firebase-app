import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatMenuModule
} from '@angular/material'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppComponent } from './app.component'
import { ColumnLayoutComponent } from './column-layout/column-layout.component'
import { CreateComponent } from './create/create.component'
import { ReadComponent } from './read/read.component'

@NgModule({
  declarations: [
    AppComponent,
    ColumnLayoutComponent,
    ReadComponent,
    CreateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
