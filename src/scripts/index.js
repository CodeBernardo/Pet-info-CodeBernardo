// Desenvolva as funcionalidades de login aqui

import { loginRequest } from "./requests.js"
import { failure, success, toast } from "./toast.js"

const handleLogin = () => {
  const loginInputs = document.querySelectorAll('.login_input')
  const loginButton = document.querySelector('#login__submit')
  const registerBtn = document.querySelector('#register__button')
  
  loginButton.addEventListener('click', (event) => {
    event.preventDefault()
    const requestBody = {}
    let counter = 0
    loginInputs.forEach(input => {
      if(input.value.trim() === '') {
        counter ++
      } else {
        requestBody[input.name] = input.value
      }
    })
    if(counter !== 0) {
      toast("Preencha todos os campos", failure)
    } else {
      loginRequest(requestBody)
    }
    return requestBody
  })

  registerBtn.addEventListener('click', (event) => {
    event.preventDefault()
    location.replace("./src/pages/register.html")
  })
}

handleLogin()
