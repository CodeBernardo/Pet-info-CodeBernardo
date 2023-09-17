// Desenvolva as funcionalidades de cadastro aqui

import { createUserRequest } from "./requests.js";
import { failure, success, toast } from "./toast.js";

const handleRegisterForm = () => {
  const regInputs = document.querySelectorAll(".register__input");
  const regButton = document.querySelector("#register__submit");
  const redirectBtn = document.querySelector("#redirect__button");

  regButton.addEventListener("click", (event) => {
    event.preventDefault();
    const registerBody = {};
    let count = 0;
    regInputs.forEach((input) => {
      if (input.value.trim() === "") {
        count++;
      } else {
        registerBody[input.name] = input.value;
      }
    });

    if (count !== 0) {
      toast("Preencha todos os campos", failure);
    } else {
      createUserRequest(registerBody);
    }
  });
  redirectBtn.addEventListener("click", () => {
    location.replace("../../");
  });
};

handleRegisterForm();
