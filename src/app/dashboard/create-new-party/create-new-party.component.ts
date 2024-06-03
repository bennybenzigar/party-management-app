import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { SpinnerService } from 'src/app/service/spinner.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-new-party',
  templateUrl: './create-new-party.component.html',
  styleUrls: ['./create-new-party.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNewPartyComponent implements OnInit {
  form!: FormGroup;
  selectedFile: File | null = null;
  existingImageUrl: string | null = null;
  page: string = 'create';
  id!: number;
  fileName: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private spinner: SpinnerService,
    private router: Router,
    private location: Location
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      company_name: ['', Validators.required],
      mobile_no: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      telephone_no: ['', [Validators.required, Validators.minLength(5)]],
      whatsapp_no: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      remark: ['', [Validators.required]],
      login_access: [false, Validators.required],
      date_of_birth: ['', Validators.required],
      anniversary_date: ['', Validators.required],
      gstin: ['', Validators.required],
      pan_no: ['', Validators.required],
      apply_tds: [false, Validators.required],
      credit_limit: ['', Validators.required],
      image: [null, Validators.required],
      addresses: this.fb.array([]),
      banks: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.getParams();
  }

  get banks(): FormArray {
    return this.form.get('banks') as FormArray;
  }

  get addresses(): FormArray {
    return this.form.get('addresses') as FormArray;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.fileName = event.target.files[0]?.name;
      this.form.patchValue({ image: this.selectedFile });
    }
  }

  addNewAddress() {
    const addressArray = this.form.get('addresses') as FormArray;
    addressArray.push(
      this.fb.group({
        id: [''],
        address_line_1: [''],
        address_line_2: [''],
        country: [''],
        state: [''],
        city: [''],
        pincode: ['', [Validators.maxLength(6), Validators.minLength(6)]],
      })
    );
    this.cdr.markForCheck();
  }

  addNewBank() {
    const bankArray = this.form.get('banks') as FormArray;
    bankArray.push(
      this.fb.group({
        id: [''],
        bank_ifsc_code: [''],
        bank_name: [''],
        branch_name: [''],
        account_no: ['', [Validators.minLength(9), Validators.maxLength(18)]],
        account_holder_name: [''],
      })
    );
    this.cdr.markForCheck();
  }

  onSubmit() {
    if (!this.selectedFile) {
      this.toastr.info('Please select an image');
      return;
    }

    if (this.form.valid) {
      const formData = new FormData();

      Object.keys(this.form.controls).forEach((key) => {
        if (key === 'addresses' || key === 'banks') {
          return;
        }
        formData.append(key, this.form.get(key)?.value);
      });

      const addresses = this.form.get('addresses') as FormArray;
      const addressArray = addresses.value.map((address: any) => {
        if (address.id) {
          return address;
        } else {
          delete address.id;
          return address;
        }
      });
      formData.append('addresses', JSON.stringify(addressArray));

      const banks = this.form.get('banks') as FormArray;
      const bankArray = banks.value.map((bank: any) => {
        if (bank.id) {
          return bank;
        } else {
          delete bank.id;
          return bank;
        }
      });
      formData.append('banks', JSON.stringify(bankArray));

      if (this.page === 'create') {
        this.spinner.show();
        this.apiService.postData(formData).subscribe(
          (response: any) => {
            this.spinner.hide();
            this.toastr.success(response.msg);
            this.router.navigate(['/dashboard']);
          },
          (error) => {
            this.spinner.hide();
            this.handleErrors(error);
          }
        );
      } else {
        this.spinner.show();
        this.apiService.editData(formData, this.id).subscribe(
          (response: any) => {
            this.spinner.hide();
            this.toastr.success(response.msg);
            this.router.navigate(['/dashboard']);
          },
          (error) => {
            this.spinner.hide();
            this.handleErrors(error);
          }
        );
      }
    } else {
      this.displayFormErrors();
    }
  }

  handleErrors(error: any) {
    if (error.error.gstin) {
      this.toastr.error(error.error.gstin[0]);
    } else if (error.error.mobile_no) {
      this.toastr.error(error.error.mobile_no[0]);
    } else if (error.error.email) {
      this.toastr.error(error.error.email[0]);
    } else {
      this.toastr.error(error.error.msg);
    }
  }

  displayFormErrors() {
    if (this.form.get('email')?.hasError('required')) {
      this.toastr.error('Email is required.', 'Validation Error');
    } else if (this.form.get('email')?.hasError('email')) {
      this.toastr.error('Please enter a valid email address.', 'Validation Error');
    }
    if (this.form.get('mobile_no')?.hasError('required')) {
      this.toastr.error('Mobile number is required.', 'Validation Error');
    } else if (this.form.get('mobile_no')?.hasError('minlength') || this.form.get('mobile_no')?.hasError('maxlength')) {
      this.toastr.error('Mobile number must be 10 digits long.', 'Validation Error');
    }

    if (this.form.get('pincode')?.hasError('required')) {
      this.toastr.error('Pincode is required.', 'Validation Error');
    } else if (this.form.get('pincode')?.hasError('minlength') || this.form.get('pincode')?.hasError('maxlength')) {
      this.toastr.error('Pincode must be 6 digits long.', 'Validation Error');
    }

    this.toastr.info('Form is invalid. Please fill out all required fields.');
  }

  getParams() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.id = params['id'];
        this.page = 'edit';
        this.getIndividualData(params['id']);
      } else {
        this.addNewAddress();
        this.addNewBank();
      }
    });
  }

  getIndividualData(id: number) {
    this.spinner.show();
    this.apiService.getParty(id).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.form.patchValue({
          name: response.name,
          company_name: response.company_name,
          mobile_no: response.mobile_no,
          telephone_no: response.telephone_no,
          whatsapp_no: response.whatsapp_no,
          email: response.email,
          remark: response.remark,
          login_access: response.login_access,
          date_of_birth: response.date_of_birth,
          anniversary_date: response.anniversary_date,
          gstin: response.gstin,
          pan_no: response.pan_no,
          apply_tds: response.apply_tds,
          credit_limit: response.credit_limit,
        });

        const addressArray = this.form.get('addresses') as FormArray;
        addressArray.clear();
        response.address.forEach((address: any) => {
          addressArray.push(
            this.fb.group({
              id: address.id,
              address_line_1: address.address_line_1,
              address_line_2: address.address_line_2,
              country: address.country,
              state: address.state,
              city: address.city,
              pincode: address.pincode,
            })
          );
        });

        const bankArray = this.form.get('banks') as FormArray;
        bankArray.clear();
        response.bank.forEach((bank: any) => {
          bankArray.push(
            this.fb.group({
              id: bank.id,
              bank_ifsc_code: bank.bank_ifsc_code,
              bank_name: bank.bank_name,
              branch_name: bank.branch_name,
              account_no: bank.account_no,
              account_holder_name: bank.account_holder_name,
            })
          );
        });

        this.existingImageUrl = response.image;
        this.cdr.markForCheck();
      },
      (error) => {
        this.spinner.hide();
        this.handleErrors(error);
      }
    );
  }

  goBack() {
    this.location.back();
  }

  reset(){
    this.form.reset()
  }
}
