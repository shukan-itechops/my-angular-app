import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Ingredient } from '../interface/interface';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  apiUrl = environment.apiUrl;

  http = inject(HttpClient);
  constructor() { }

  getAllIngredient(
    page: number,
    pageSize: number,
    filters: { userName: string; selectedMonth: string; selectedYear: string }
  ): Observable<{ items: Ingredient[]; totalCount: number }> {
    const params = new URLSearchParams();

    if (filters.userName) params.set('userName', filters.userName);
    if (filters.selectedMonth) params.set('month', filters.selectedMonth);
    if (filters.selectedYear) params.set('year', filters.selectedYear);

    params.set('page', page.toString());
    params.set('pageSize', pageSize.toString());

    return this.http.get<{ items: Ingredient[]; totalCount: number }>(
      `${this.apiUrl}/Ingredient?${params.toString()}`
    );
  }



  createIngredient(ingredient: Ingredient) {
    return this.http.post(this.apiUrl + "/Ingredient", ingredient);
  }

  getIngredient(ingredientId: number) {
    return this.http.get<Ingredient[]>(this.apiUrl + "/Ingredient/" + ingredientId);
  }

  updatedIngredient(ingredientId: number, ingredient: Ingredient) {
    return this.http.put<Ingredient[]>(this.apiUrl + "/Ingredient/" + ingredientId, ingredient);
  }
  deletedIngredient(ingredientId: string) {
    return this.http.delete(this.apiUrl + "/Ingredient/" + ingredientId);
  }
}
