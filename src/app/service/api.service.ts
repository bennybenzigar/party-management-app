import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient)
  { }
 private url='https://ap.greatfuturetechno.com/'
  getParty(id?:number){

    if(id){
      return this.http.get<any>(this.url+'party/?id='+id)
    }
    else{
      return this.http.get<any>(this.url+'party/')

    }
  }

  editData(data:any, id:number){
    return this.http.put<any>(this.url+'party/?id='+id,data)

  }

  deleteData(id:number){
    return this.http.delete<any>(this.url+'party/?id='+id)

  }

  postData(data:any){
    return this.http.post<any>(this.url+'party/',data)



  }

  login(data:any){
    return this.http.post<any>(this.url+'login/',data)

  }

  logout(){
   const body={}
    return this.http.post<any>(this.url+'logout/',body)

  }
}
