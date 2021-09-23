import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  data: any
  onSubmit(form: NgForm) {
    this.data = form.value
    this.login(this.data)
  }
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  //Função para fazer o login
  async login(data: any) {
    //Pedido fetch ao servidor
    const response = await fetch(`http://localhost:3000/login`, {
      method: "POST",
      headers: {
        'Content-type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(data)//Passar dados do formulário
    }).then(data => data.json()).catch(error => console.log(error))
    if (response.token !== undefined) {
      //armazena o token na session storage 
      sessionStorage.setItem("token", response.token)
      //direciona-nos para o menu
      this.router.navigate(['/menu'])
      this.showAlert(
        response.message,
        'success',
        false
      )
    }
    else {
      this.showAlert(response.message, 'error', false)
    }
  }

  //Função para surgir alerta
  showAlert(title: any, icon: any, showCancelButton = true) {
    return Swal.fire({
      title: title,
      icon: icon,
      showCancelButton: showCancelButton
    })
  }
}