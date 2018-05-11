import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../../models/User';
import {UserService} from '../../services/user.service';
import {OwnerService} from '../../owner.service';

@Component({
  selector: 'app-registerowener',
  templateUrl: './registerowener.component.html',
  styleUrls: ['./registerowener.component.css']
})
export class RegisterowenerComponent implements OnInit {

  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  user: User;


  passwordLengthValid: string = '';
  passwordValid: string = '';


  valid: boolean = true;

  constructor(private ownerService: OwnerService, private route: Router) {
  }

  ngOnInit() {
  }

  onSubmit() {


    if (this.validate()) {
      this.user = new User(this.firstName, this.lastName, this.email, this.password);
      this.ownerService.registerOwner(this.user)
        .subscribe(res => {
          console.log(res);
          this.route.navigateByUrl('/home');
        });
    }
  }

  validate(): boolean {
    this.valid = true;
    this.passwordLengthValid = '';
    this.passwordValid = '';

    if (this.password != this.confirmPassword) {
      this.passwordValid = 'Password does not match';
      this.valid = false;
    }
    if (this.password.length <= 3) {
      this.passwordLengthValid = 'Password length should be at least 5 char';
      this.valid = false;
    }

    return this.valid;
  }


}


