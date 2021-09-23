import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  token: any
  value: any
  name: any
  conta: any
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.token = sessionStorage.getItem("token")
    if (this.token == null) {
      this.router.navigate(['/'])
    }
    else {
      this.getUser()
      this.getValue()
    }
  }
  async getValue() {
    this.token = sessionStorage.getItem("token")
    const response = await fetch(`http://localhost:3000/transitions/value/${this.conta}`, {
      method: "GET",
      headers: {
        'authorization': 'Bearer ' + this.token,
        'Content-type': 'application/json; charset=utf-8'
      }
    }).then(data => data.json()).catch(error => console.log(error))
    if (response.statusCode === 401) {
      sessionStorage.removeItem("token")
      this.router.navigate(['/'])
    }
    else {
      this.value = response.message
    }
  }
  async getUser() {
    let jwtToken = this.token.split(".")[1];
    let user = JSON.parse(window.atob(jwtToken))
    this.name = user.name
    this.conta = user.conta
  }

  async logout() {
    sessionStorage.removeItem("token")
    this.router.navigate(['/'])
  }
}
