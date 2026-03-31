import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AssetService } from '../../../core/services/asset.service';
import { Asset } from '../../../core/models/asset.model';

@Component({
  selector: 'app-my-assets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-assets.component.html'
})
export class MyAssetsComponent implements OnInit {
  private assetService = inject(AssetService);
  
  assets$!: Observable<Asset[]>;

  ngOnInit() {
    this.assets$ = this.assetService.getMyAssets();
  }
}