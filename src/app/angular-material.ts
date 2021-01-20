import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    exports: [
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatToolbarModule,
        MatInputModule,
        MatIconModule,
        MatPaginatorModule,
        MatExpansionModule,
        MatDialogModule
    ]
})
export class AngularMaterialModule {}
