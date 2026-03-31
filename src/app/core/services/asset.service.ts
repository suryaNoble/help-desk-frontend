import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Asset } from '../models/asset.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AssetService {
  private api = inject(ApiService);
  private auth = inject(AuthService);

  getMyAssets(): Observable<Asset[]> {
    const userId = this.auth.userId();
    return this.api.get<Asset[]>(`/assets/user/${userId}`);
  }

  getAvailableAssets(): Observable<Asset[]> {
    return this.api.get<Asset[]>('/assets'); 
  }

  // --- UPDATED to match your POST /assets/assign endpoint ---
  assignAsset(assetId: number, userId: number): Observable<any> {
    // Matches your Java AssetAssignDTO structure exactly
    const payload = { assetId: assetId, userId: userId };
    return this.api.post('/assets/assign', payload);
  }

  //  For the Return Asset feature ---
  returnAsset(assetId: number): Observable<any> {
    return this.api.post(`/assets/${assetId}/return`, {});
  }

  getCategories(): Observable<any[]> {
    return this.api.get<any[]>('/categories');
  }

  createAsset(assetData: any): Observable<Asset> {
    return this.api.post<Asset>('/assets', assetData);
  }

  getAllAssets(): Observable<Asset[]> {
    return this.api.get<Asset[]>('/assets');
  }

}