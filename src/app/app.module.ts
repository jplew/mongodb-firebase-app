import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatMenuModule,
  MatSelectModule,
  MatTabsModule,
  MatButtonToggleModule,
  MatDialogModule
} from '@angular/material'
import { MatInputModule } from '@angular/material/input'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppComponent, ConfirmDeleteComponent } from './app.component'
import { CreateComponent } from './create/create.component'
import { ReadComponent } from './read/read.component'

@NgModule({
  declarations: [
    AppComponent,
    ReadComponent,
    CreateComponent,
    ConfirmDeleteComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatDialogModule
  ],
  entryComponents: [ConfirmDeleteComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
