import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../service/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from '../service/spinner.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id','image' ,'name', 'company_name', 'email', 'mobile_no', 'is_active', 'edit', 'delete'];
  dataSource = new MatTableDataSource<any>(); // Initialize as MatTableDataSource

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  userData: any[] = [];
url:string='https://ap.greatfuturetechno.com/'
  constructor(private apiService: ApiService,private cdr:ChangeDetectorRef, private router:Router, private spinner: SpinnerService, private toastr: ToastrService) {
    this.getAllParty();
  }

  ngOnInit(): void {
    // this.spinner.show()

  }

  ngAfterViewInit() {
    // Ensure dataSource is initialized before assigning sort and paginator
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator.pageSize = 8;
    }
  }

  getAllParty() {
    this.spinner.show()
    this.apiService.getParty().subscribe(
      (response: any) => {
        this.spinner.hide()
        console.log(response, 'get all party');
        // this.toastr.success(response.msg)
        this.userData = response;
        this.dataSource.data = response; // Assign data to MatTableDataSource
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error: Error) => {
        this.spinner.hide()
this.toastr.error('something went wrong, please try again')
        // Handle error as needed, e.g., show error message to user
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteData(id:number){
    this.spinner.show()

    this.apiService.deleteData(id).subscribe((reponse:any)=>{
      this.spinner.hide()

      this.toastr.success(reponse.msg)
      this.getAllParty()
      this.cdr.detectChanges()
    },
    (error:Error)=>{
      this.spinner.hide()

      console.log(error)
      this.toastr.error('something went wrong, please try again')

    })

  }

  navigate(id:number){
    this.router.navigate(['/dashboard/view-party', id]);
  }

  logout(){
this.spinner.show()
    this.apiService.logout().subscribe((response:any)=>{
      this.spinner.hide()


this.toastr.success("logout successfully")
localStorage.removeItem('token')
this.router.navigate(['/'])



    },
  (error:any)=>{
    localStorage.removeItem('token')
    this.router.navigate(['/'])

    this.spinner.hide()

    this.toastr.error('something went wrong, please try again')

  })
  }
}
