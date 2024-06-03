import { SpinnerService } from './../service/spinner.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  inputType:string='password'
loginForm!:FormGroup
  constructor(private formBuilder:FormBuilder, private apiService:ApiService, private router:Router, private spinner:SpinnerService, private toastr:ToastrService){}

  ngOnInit(): void {
    localStorage.removeItem('token')
    this.createForm()
  this.getLoginDetails()

  }

  createForm(){
 this.loginForm=   this.formBuilder.group({
      username:['',[Validators.required, Validators.minLength(3)]],
      password:['',[Validators.required, Validators.minLength(6)]]
    })
  }

  login(){
    if(this.loginForm.valid){
      this.spinner.show()

      this.apiService.login(this.loginForm.value).subscribe((response:any)=>{
        this.spinner.hide()

        console.log(response,'response')
        localStorage.setItem('token',JSON.stringify(response.token))
        if(response.token){
          this.toastr.success('login successfully')
        }
        this.router.navigate(['/dashboard'])

      },(error:Error)=>{
        this.spinner.hide()

        console.log(error)
        this.toastr.error("something went wrong, please try again")
      })
    }

  }

  getLoginDetails(){
    const token = localStorage.getItem('token');
    if(token){
      const tokens =JSON.parse(token);
      this.router.navigate(['/dashboard'])

    }


  }
}
