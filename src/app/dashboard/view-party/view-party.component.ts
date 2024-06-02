import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { SpinnerService } from 'src/app/service/spinner.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-view-party',
  templateUrl: './view-party.component.html',
  styleUrls: ['./view-party.component.scss']
})
export class ViewPartyComponent implements OnInit{
 url :string= 'https://ap.greatfuturetechno.com/'
  data:any
customer:any
id:number=0
  constructor(private apiService:ApiService, private activatedRoute:ActivatedRoute, private spinner:SpinnerService, private toastr:ToastrService, private location:Location, private router:Router) { }
  ngOnInit(): void {
    this.getParams();

  }
  getParams() {

    this.activatedRoute.params.subscribe((params: Params) => {
      console.log(params, 'params');
      if (params['id']) {
        this.getIndividualData(params['id']);
        this.id=params['id']
      }
    else{
      this.toastr.error('Id not found')
    }
    });
  }

  getIndividualData(id: number) {
    this.spinner.show()
    this.apiService.getParty(id).subscribe(
      (reponse: any) => {
        this.spinner.hide()
        console.log(reponse, 'edit data');
        this.data = reponse
        this.customer = reponse
      },
      (error: Error) => {
        this.spinner.hide()
this.toastr.error('something went wrong, please try again')

      }
    );
  }

  deleteData(){
    this.spinner.show()

    this.apiService.deleteData(this.id).subscribe((reponse:any)=>{
      this.spinner.hide()

      this.toastr.success(reponse.msg)
      this.router.navigate(['/dashboard'])

    },
    (error:Error)=>{
      this.spinner.hide()

      // console.log(error)
      this.toastr.error('something went wrong, please try again')

    })

  }
  goBack(){
this.location.back()
  }
}
