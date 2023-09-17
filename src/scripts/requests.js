import { failure, success, toast } from "./toast.js";

const baseUrl = "http://localhost:3333";
// Desenvolva as funcionalidades de requisições aqui
export const createUserRequest = async (userData) => {
  const newUser = await fetch(`${baseUrl}/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then(async (res) => {
      if (res.ok) {
        toast("Usuário cadastrado com sucesso", success);
        setTimeout(
          () => toast("Redirecionando para página de login", success),
          1000
        );
        setTimeout(() => {
          location.replace("../../");
        }, 2000)
        return res.json();
      } else {
        const resConvert = await res.json();
        if (resConvert.message.includes("Email já cadastrado")) {
          toast(resConvert.message, failure);
        } else if (resConvert.message.includes("Username já cadastrado")) {
          toast(resConvert.message, failure);
        } else {
          throw new Error(resConvert.message);
        }
      }
    })
    .catch((err) => toast(err, failure));
  return newUser;
};

const verifyData = ((data, inputId) => {
  const smallText = document.querySelector(data)
  const input = document.querySelector(inputId)
  smallText.classList.toggle('hidden')
  input.classList.toggle('wrong-info')
  setTimeout(() => {
    smallText.classList.toggle('hidden')
    input.classList.toggle('wrong-info')
  }, 1500)
})

export const loginRequest = async (userData) => {
  const token = await fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then(async (res) => {
      if (res.ok) {
        toast("login realizado com sucesso!", success);
        setTimeout(() => toast("Redirecionando pagina", success), 1000);
        setTimeout(() => location.replace('./src/pages/feed.html'), 1800)
        return res.json();
      } else {
        const resConvert = await res.json();
        if (resConvert.message.includes("email")) {
          verifyData('#wrong-email','#Email')
        } else if (resConvert.message.includes("senha")) {
          verifyData('#wrong-password',"#Senha")
        } else {
          throw new Error(resConvert.message);
        }
      }
    })
    .catch((err) => toast(err, failure));
  localStorage.setItem("@petinfo:token", JSON.stringify(token));
  userDataRequest()
  return token
};

export const userDataRequest = async () => {
  const authToken = JSON.parse(localStorage.getItem('@petinfo:token'))
  const userInformation = await fetch(`${baseUrl}/users/profile`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.token}`
    }
  })
  .then(res => res.json())
  localStorage.setItem("@petinfo:userData", JSON.stringify(userInformation))
}

export const allPostsRequests = async () => {
  const authToken = JSON.parse(localStorage.getItem('@petinfo:token'))
  const allPosts = await fetch(`${baseUrl}/posts`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.token}`
    }
  })
  .then(async (res) => {
    const resConvert = await res.json()
    if(res.ok) {
      return resConvert
    } else {
      throw new Error(resConvert.message)
    }
  })
  .catch(err => toast(err, failure))
  return allPosts
}

export const postDataRequest = async (postId) => {
  const authToken = JSON.parse(localStorage.getItem('@petinfo:token'))
  const allPosts = await fetch(`${baseUrl}/posts/${postId}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.token}`
    }
  })
  .then(async (res) => {
    const resConvert = await res.json()
    if(res.ok) {
      return resConvert
    } else {
      throw new Error(resConvert.message)
    }
  })
  .catch(err => toast(err, failure))
  return allPosts
}

export const newPostRequest = async (postBody) => {
  const authToken = JSON.parse(localStorage.getItem('@petinfo:token'))
  const newPost = await fetch(`${baseUrl}/posts/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.token}`
    },
    body: JSON.stringify(postBody)
  })
  .then(async (res) => {
    const resConvert = await res.json()
    if(res.ok) {
      return resConvert
    } else {
      throw new Error(resConvert.message)
    }
  })
  .catch(err => toast(err, failure))
  return newPost
}

export const editPostRequest = async (postBody, postId) => {
  const authToken = JSON.parse(localStorage.getItem('@petinfo:token'))
  const editedPost = await fetch(`${baseUrl}/posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.token}`
    },
    body: JSON.stringify(postBody)
  })
  .then(async (res) => {
    const resConvert = await res.json()
    if(res.ok){
      return resConvert
    } else {
      throw new Error(resConvert.message)
    }
  })
  .catch(err => toast(err, failure))
  return editedPost
}

export const deletePostRequest = async (postId) => {
  const authToken = JSON.parse(localStorage.getItem('@petinfo:token'))
  const deletedPost = await fetch(`${baseUrl}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.token}`
    },
  })
  .then(async (res) => {
    const resConvert = await res.json()
    if(res.ok){
      return resConvert
    } else {
      throw new Error(resConvert.message)
    }
  })
  .catch(err => toast(err, failure))
  return deletedPost
}

