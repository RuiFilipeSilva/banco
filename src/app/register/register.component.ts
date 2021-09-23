import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  data: any
  message: any

  onSubmit(form: NgForm) {
    this.data = form.value
    this.register(this.data)
  }

  constructor(private router: Router) {
  }

  ngOnInit(): void {


  }

  //Função para fazer registo
  async register(data: any) {
    if (this.data.name != "" && this.data.email != "" && this.data.password != "" && this.data.confPassword != "") {
      //Pedido fetch ao servidor
      const response = await fetch(`http://localhost:3000/register`, {
        method: "POST",
        headers: {
          'Content-type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data)//Passar dados do formulário
      }).then(data => data.json()).catch(error => console.log(error))
      if (response.success) {
        this.showAlert(response.message, 'Faça agora o login na sua conta', 'success', false)
        //Direciona-nos para a página de login
        this.router.navigate(['/login'])
      }
      else {
        this.showAlert(response.message, "", 'error', false)
      }
    }
    else {
      this.showAlert("Falta Prencher Campos do Formulário", "", 'error', false)
    }
  }
  showAlert(title: any, text: any, icon: any, showCancelButton = true) {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: showCancelButton
    })
  }

}
