import { Component, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }
  //Variáveis
  data: any
  type: any
  value: any
  name: any
  conta: any
  token: any

  //Submição dos formulários
  onSubmit(form: NgForm) {
    this.data = form.value
    //Dependente do tipo de operação chamamos a função correspondente
    if (this.type == 1) {
      this.addMoney(this.data)
    }
    else if (this.type == 2) {
      this.payment(this.data)
    }
    else if (this.type == 3) {
      this.transactions(this.data)
    }
  }
  ngOnInit(): void {
    //Ao iniciar a página obtemos o token que se encntra armazenado na session storage
    this.token = sessionStorage.getItem("token")
    //caso não exista token redireciona-nos para a página inicial
    if (this.token == null) {
      this.router.navigate(['/'])
    }
    else {
      this.type = this.route.snapshot.paramMap.get('feature'); //obter tipo de opração através do parametros
      this.getUser()
      this.getValue()
    }
  }

  //Função para obter o valor da conta do utilizador
  async getValue() {
    this.token = sessionStorage.getItem("token") //token armazenado no session storage
    //Fazemos o pedido à API através do fetch onde passamos o token atraves do header
    const response = await fetch(`http://localhost:3000/transitions/value/${this.conta}`, {
      method: "GET",
      headers: {
        'authorization': 'Bearer ' + this.token,//Token passado no header
        'Content-type': 'application/json; charset=utf-8'
      }
    }).then(data => data.json()).catch(error => console.log(error))

    if (response.statusCode === 401) {
      //Caso o token tenha expirado retorna-nos erro 401 e eliminamo-lo da session storage
      sessionStorage.removeItem("token")
      this.router.navigate(['/']) //redireciona para a página inicial
    }
    else {
      this.value = response.message // retorna-nos o valor na conta
    }
  }

  //função para obter os dados do utilizador através do token
  async getUser() {
    let jwtToken = this.token.split(".")[1];
    let user = JSON.parse(window.atob(jwtToken))
    this.name = user.name
    this.conta = user.conta
  }

  //Função para adicionar dinheiro à conta
  async addMoney(data: any) {
    if (this.data.value != '') {
      this.token = sessionStorage.getItem("token") //obter token da session storage
      //Pedido Fetch ao servidor
      const response = await fetch(`http://localhost:3000/transitions/add/${this.conta}`, {
        method: "PUT",
        headers: {
          'authorization': 'Bearer ' + this.token,//Token passado no header
          'Content-type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data)//Passar dados do formulário
      }).then(data => data.json()).catch(error => console.log(error))

      if (response.success) {
        this.showAlert(response.message, 'success', false)
        //Atualiza o valor
        this.getValue()
      }
      //Token não autorizado
      else if (response.statusCode === 401) {
        sessionStorage.removeItem("token")
        this.router.navigate(['/'])
      }
    } else {
      this.showAlert("Falta Prencher Campos do Formulário", 'error', false)
    }
  }

  //Função para fazer pagamentos
  async payment(data: any) {
    if (this.data.value != '') {
      this.token = sessionStorage.getItem("token") //obter token da session storage
      //Pedido fetch ao servidor
      const response = await fetch(`http://localhost:3000/transitions/payments/${this.conta}`, {
        method: "PUT",
        headers: {
          'authorization': 'Bearer ' + this.token, //Token passado no header
          'Content-type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data)//Passar dados do formulário
      }).then(data => data.json()).catch(error => console.log(error))
      if (response.success) {
        //Atualiza o valor
        this.getValue()
        this.showAlert(response.message, 'success', false)
      }
      else if (response.statusCode === 401) {
        //Caso não tenha um token válido redireciona para a página inicial
        sessionStorage.removeItem("token")
        this.router.navigate(['/'])
      }
      else {
        //Caso retorne algum erro surge um alerta com o erro
        this.showAlert(response.message, 'error', false)
      }
    } else {
      this.showAlert("Falta Prencher Campos do Formulário", 'error', false)
    }
  }

  //Função para fazer transferência para outro utilizador
  async transactions(data: any) {
    if (this.data.value != '' && this.data.conta != '') {
      this.token = sessionStorage.getItem("token")
      const response = await fetch(`http://localhost:3000/transitions/transactions/${this.conta}`, {
        method: "PUT",
        headers: {
          'authorization': 'Bearer ' + this.token,
          'Content-type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data)
      }).then(data => data.json()).catch(error => console.log(error))
      if (response.success) {
        this.showAlert(response.message, 'success', false)
        this.getValue() //Atualizar valor
      } else if (response.statusCode === 401) {
        sessionStorage.removeItem("token")
        this.router.navigate(['/'])
      }
      else {
        this.showAlert(response.message, 'error', false)
      }
    } else {
      this.showAlert("Falta Prencher Campos do Formulário", 'error', false)
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
