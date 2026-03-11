import { Component, inject } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [ProgressSpinnerModule, NgIf],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  public loaderService = inject(LoaderService);
}
