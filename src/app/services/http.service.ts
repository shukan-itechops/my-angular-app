import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Ingredient } from '../interface/interface';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  apiUrl = environment.apiUrl;

  http = inject(HttpClient);
  constructor() { }

  getAllIngredient(){
    return this.http.get<Ingredient[]>(this.apiUrl+"/Ingredient");
  }

  createIngredient(ingredient: Ingredient){
    return this.http.post(this.apiUrl+"/Ingredient",ingredient);
  }

  getIngredient(ingredientId:number){
    return this.http.get<Ingredient[]>(this.apiUrl+"/Ingredient/"+ingredientId);
  }

  updatedIngredient(ingredientId:number,ingredient:Ingredient){
    return this.http.put<Ingredient[]>(this.apiUrl+"/Ingredient/"+ingredientId,ingredient);
  }
  deletedIngredient(ingredientId:string){
    return this.http.delete(this.apiUrl+"/Ingredient/"+ingredientId);
  }
}
