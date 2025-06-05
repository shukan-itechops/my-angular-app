export interface IEmployee{
  id?: number,
  name: string,
  email: string,
  phone: string,
  age: number | null,
  salary:number
}
export interface IProduct{
  title? : string,
  description : string,
  ISBN : number,
  author: string
  listPrice: number,
  price_1_50:number,
  price_50_100:number,
  price_100_up: number
}
