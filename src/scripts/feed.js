import { renderCreatePostModal, renderPosts } from "./render.js";
import { allPostsRequests } from "./requests.js";


const authentication = () => {
  if(!localStorage.getItem('@petinfo:token')) {
    location.replace('../../')
  }
}
authentication()

const postDB = await allPostsRequests()

const handleEvents = () => {
  
  const pageConfig = () => {
    const userInfo = JSON.parse(localStorage.getItem("@petinfo:userData"))
    const userImg = document.querySelector('#user__headerImg')
    userImg.src = userInfo.avatar
    const userName = document.querySelector('.user__uniquename')
    userName.innerText = `@${userInfo.username}`
  }
  pageConfig()

  const logOutPop = () => {
    const logOutMenuBtn = document.querySelector('#user__headerImg')
    const logOutMenuContainer = document.querySelector('.user__logout')
    logOutMenuBtn.addEventListener('click', () => {
      if(logOutMenuContainer.classList.contains('visible')) {
        logOutMenuContainer.classList.remove('visible')
        logOutMenuContainer.classList.add('hidden')
      } else if(logOutMenuContainer.classList.contains('hidden')) {
        logOutMenuContainer.classList.remove('hidden')
        logOutMenuContainer.classList.add('visible')
      }
      setTimeout(() => {
        logOutMenuContainer.classList.remove('visible')
        logOutMenuContainer.classList.add('hidden')
      }, 3000)
    })
  }
  logOutPop()

  const exitAcc = () => {
    const exitBtn = document.querySelector('.logout__button')
    exitBtn.addEventListener('click', () => {
      localStorage.clear()
      location.replace('../../')
    })
  }
  exitAcc()

  const newPostModal = () => {
    const newPostButton = document.querySelector('#createPost__button')
    const modalControler = document.querySelector('.modal__controler')
    newPostButton.addEventListener('click', () => {
      modalControler.innerHTML = ''
      const newPostModal = renderCreatePostModal()
      modalControler.appendChild(newPostModal)
      modalControler.showModal()
    })
  }
  newPostModal()

  renderPosts(postDB)
}

handleEvents()
