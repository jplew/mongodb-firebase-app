import { Component, Inject } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Subject, of, Observable, BehaviorSubject } from 'rxjs';
import { PlaceService } from './services/place.service';
import { Place } from './interfaces/place';
import { sortAlphabetical } from './helpers/sortAlphabetical';

import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { environment } from '../environments/environment';

const defaultDialogConfig = new MatDialogConfig();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  dialogRef: MatDialogRef<ConfirmDeleteComponent> | null;

  apiGithubUrl = environment.apiGithubUrl;
  appGithubUrl = environment.appGithubUrl;
  placesApiUrl = environment.placesApiUrl;

  formResetSource = new Subject<void>();
  formReset$ = this.formResetSource.asObservable();

  placesSource = new BehaviorSubject<Place[] | Place>(null);
  places$: Observable<Place[] | Place> = this.placesSource.asObservable();

  placesSubject = new Subject<string>();

  selectedPlaceSource = new BehaviorSubject<Place>(null);
  selectedPlace$: Observable<Place> = this.selectedPlaceSource.asObservable();

  loadingError$ = new Subject<string>();

  state = {
    sortDescending: true,
  };

  confirmDeleteConfig = {
    disableClose: false,
    panelClass: 'custom-overlay-pane-class',
    hasBackdrop: true,
    backdropClass: '',
    width: '',
    height: '190px',
    minWidth: '',
    minHeight: '150px',
    maxWidth: defaultDialogConfig.maxWidth,
    maxHeight: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: '',
    },
  };

  constructor(private placeService: PlaceService, public dialog: MatDialog) {
    this.fetchAllLocations();
    this.subscribeToSearchBox();
  }

  fetchAllLocations(): void {
    this.placeService
      .getAll()
      .pipe(sortAlphabetical(this.state.sortDescending))
      .subscribe((next) => {
        this.placesSource.next(next);
      });
  }

  subscribeToSearchBox() {
    const subscription = this.placesSubject.subscribe((query: string) => {
      // this.loadingError$.next(null)

      this.places$ = this.placesSource.pipe(
        catchError((error) => {
          console.log(error);
          this.loadingError$.next(error);
          return of();
        }),
        map((locations: Place[]) => {
          if (!query) {
            return locations;
          }

          const hits = locations.filter(
            (location: Place) =>
              location.locationName
                .toLowerCase()
                .indexOf(query.toLowerCase()) !== -1
          );
          if (!hits.length) {
            this.loadingError$.next(query);
          }
          return hits;
        })
      );
    });
  }

  swapOrder(value: boolean) {
    this.state = {
      sortDescending: !value,
    };

    this.places$ = this.places$.pipe(
      sortAlphabetical(this.state.sortDescending)
    );
  }

  editRecord(place: Place) {
    this.selectedPlaceSource.next(place);
  }

  deleteRecord(place: Place) {
    this.openConfirmDeleteDialog(place);
  }

  openConfirmDeleteDialog(place: Place) {
    const options = {
      ...this.confirmDeleteConfig,
      data: {
        place,
      },
    };

    this.dialogRef = this.dialog.open(ConfirmDeleteComponent, options);

    this.dialogRef.afterClosed().subscribe((result: Place) => {
      this.sendDeleteRequest(result);
      this.dialogRef = null;
    });
  }

  sendDeleteRequest(place: Place) {
    this.placeService.deleteLocation(place).subscribe(
      (next) => {
        console.log('Location deleted successfully');
        this.fetchAllLocations();
      },
      () => {
        console.log('completed');
      }
    );
  }

  sendPostRequest(body: Place) {
    this.placeService.createLocation(body).subscribe(
      (createdPlace) => {
        console.log('Location created successfully');
        this.fetchAllLocations();
        this.formResetSource.next();
      },
      (err) => {
        console.error('error', err);
      }
    );
  }

  sendPutRequest(body: Place) {
    this.placeService.updateLocation(body).subscribe((updatedPlace) => {
      console.log('Location updated successfully');
      this.fetchAllLocations();
      this.formResetSource.next();
    });
  }
}

@Component({
  selector: 'app-confirm-delete',
  template: `
    <h3 mat-dialog-title>
      Are you sure you want to delete {{ data.place.locationName }}?
    </h3>

    <mat-dialog-content>
      <div class="mat-body dialog-content">
        This will permanently remove it from the database.
      </div>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button
        type="button"
        mat-button
        mat-raised-button
        color="primary"
        (click)="dialogRef.close(data.place)"
      >
        Delete
      </button>
      <button type="button" mat-button mat-dialog-close>Cancel</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
