import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../service/alert.service";
import {Observable} from "rxjs";
import {distinctUntilChanged, map} from "rxjs/operators";
import {UsersService} from "../../service/users.service";
import {UserModel} from "../../model/Users";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  @ViewChild('toast') toast: any;
  list: UserModel[] = [];
  listComplet: UserModel[] = [];
  formUser: FormGroup = new FormGroup({});
  isUpdate: boolean = false;
  filteredUser: UserModel[] = [];
  @ViewChild('actu') modal: ElementRef | undefined;

  constructor(
    private userService: UsersService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.listSupplier();
    this.formUser = new FormGroup({
      name_user: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      name: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
    });
  }

  onSearchTextChanged(term: string) {
    this.filteredUser = term.length < 1 ? this.listComplet : this.listComplet.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
    this.list = this.filteredUser;
  }

  disableId() {
    this.formUser.get('name_user')?.disable();
  }

  activeId() {
    this.formUser.get('name_user')?.enable();
  }

  listSupplier() {
    this.userService.getUsers().subscribe((resp) => {
      if (resp) {
        this.list = resp;
        this.listComplet = resp;
      }
    });
  }

  showAlert(message: string, okay: boolean) {
    this.alertService.showAlert(message, okay);
  }

  newProduct() {
    this.isUpdate = false;
    this.activeId();
    this.formUser.reset();
  }

  isFormSubmitted: boolean = false;

  save() {
    const isFormValid = this.formUser.valid;
    this.isFormSubmitted = !isFormValid;
    if (this.formUser.valid) {
      console.log("Entraa")
      this.userService.saveUser(this.formUser.value)
        .subscribe((resp) => {
          if (resp) {
            this.showAlert(resp.message, resp.success);
            if(resp.success){
              this.newProduct();
              this.formUser.reset();
            }
            this.listSupplier();
          }
        });
      this.closeModal();
    }

  }



  delete(id: any) {
    this.userService.deleteSupplier(id).subscribe((resp) => {
      if (resp) {
        this.listSupplier();
      }
    });
  }
  selectItem(item: any) {
    this.isUpdate = true;
    this.formUser.controls['name'].setValue(item.name);
    this.formUser.controls['id_supplier'].setValue(item.id_supplier);
    this.formUser.controls['phone'].setValue(item.phone);
    this.formUser.controls['email'].setValue(item.email);
    this.disableId();
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      map((term) => {
        const lowercaseTerm = term.toLowerCase();
        this.filteredUser =
          lowercaseTerm.length < 1
            ? (this.filteredUser = this.listComplet)
            : this.listComplet.filter((product) => {
              const includesTerm = product.name
                .toLowerCase()
                .includes(lowercaseTerm);
              return includesTerm;
            });
        this.list = this.filteredUser;
        return [];
      })
    );

  private closeModal() {
    if (this.modal) {
      const closeButton = this.modal.nativeElement.querySelector('[data-bs-dismiss="modal"]');
      if (closeButton) {
        closeButton.click();
      }
    }
  }

  protected readonly console = console;

}
