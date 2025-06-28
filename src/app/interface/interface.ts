export interface Ingredient{
  id?: string,
  ingredientName: string;
  amount: number;
  userId: string;
  userName?: string;
  createdAt?: Date;
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

export interface UserRegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
}


export interface User {
  id?: string
  username: string;
  email: string;
  password?: string;
  isActive: boolean;
  isButterMilkEnable: boolean;
}

export interface Setting{
  id? : string;
  roomRent: number;
  cookSalary: number;
  workerSalary: number;
  lightBill: number;
}

export interface ReportResponse{
  userId: string;
  userName: string;
  totalButterMilkPaidAmount: number;
  totalOtherPaidAmount: number;
  isButterMilkEnable: boolean;
}
