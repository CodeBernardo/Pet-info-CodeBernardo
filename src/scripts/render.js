import {
  newPostRequest,
  allPostsRequests,
  editPostRequest,
  postDataRequest,
  deletePostRequest,
} from "./requests.js";
import { failure, toast, success } from "./toast.js";

export function handleDate(timeStamp) {
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const date = new Date(timeStamp);
  const month = months.at(date.getMonth());
  const year = date.getFullYear();

  return `${month} de ${year}`;
}

export const renderPostHeader = (postData) => {
  const userData = JSON.parse(localStorage.getItem("@petinfo:userData"));

  const articleHeader = document.createElement("div");
  articleHeader.classList.add("article__header");

  const userinfos = document.createElement("div");
  userinfos.classList.add("userInfos");

  const userImg = document.createElement("img");
  userImg.classList.add("user__img");
  userImg.src = postData.user.avatar;

  const userName = document.createElement("p");
  userName.classList.add("user__name", "text3", "bold");
  userName.innerText = postData.user.username;

  const postDate = document.createElement("p");
  postDate.classList.add("post__date", "text3");
  postDate.innerText = handleDate(postData.createdAt);

  userinfos.append(userImg, userName, postDate);
  articleHeader.appendChild(userinfos);

  if (postData.user.id === userData.id) {
    const modalControler = document.querySelector(".modal__controler");
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("postButtons_container");

    const editButton = document.createElement("button");
    editButton.classList.add("editPost__button", "btn");
    editButton.dataset.postId = postData.id;

    editButton.addEventListener("click", async () => {
      localStorage.setItem("@petinfo:editingPost", editButton.dataset.postId);

      const postDataLS = await postDataRequest(editButton.dataset.postId);
      localStorage.setItem("@petinfo:postdata", JSON.stringify(postDataLS));

      const editPost = renderEditPostModal();

      modalControler.innerHTML = "";
      modalControler.appendChild(editPost);
      modalControler.showModal();
    });

    const editImg = document.createElement("img");
    editImg.src = "../assets/img/edit.svg";
    editImg.classList.add("edit__buttonImg");
    editButton.appendChild(editImg);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deletePost__button", "btn");
    deleteButton.dataset.postId = postData.id;
    deleteButton.addEventListener("click", () => {
      localStorage.setItem("@petinfo:deletingpost", deleteButton.dataset.postId )
      modalControler.innerHTML = ""
      const modalContainer = renderDeletePostModal()
      modalControler.appendChild(modalContainer)
      modalControler.showModal();
    });

    const deletImg = document.createElement("img");
    deletImg.src = "../assets/img/delete.svg";
    deletImg.classList.add("delete__buttonImg");
    deleteButton.appendChild(deletImg);

    buttonsContainer.append(editButton, deleteButton);
    articleHeader.appendChild(buttonsContainer);
  }
  return articleHeader;
};

export const renderPostBody = (postData) => {
  const modalControler = document.querySelector(".modal__controler");
  const contentContainer = document.createElement("div");
  contentContainer.classList.add("postContent__container");

  const postTitle = document.createElement("h2");
  postTitle.classList.add("post__title", "title3", "bolder");
  postTitle.innerText = postData.title;

  const postContent = document.createElement("p");
  postContent.classList.add("post__content", "text3");
  postContent.innerText = postData.content;

  const postOpenBtn = document.createElement("button");
  postOpenBtn.classList.add("openPost__button", "btn", "text3");
  postOpenBtn.dataset.postId = postData.id;
  postOpenBtn.innerText = "Acessar publicação";
  postOpenBtn.addEventListener("click", (event) => {
    modalControler.innerHTML = "";
    const postContent = renderPostModal(postData);
    modalControler.appendChild(postContent);
    modalControler.showModal();
  });

  contentContainer.append(postTitle, postContent, postOpenBtn);

  return contentContainer;
};

export const renderPosts = (postData) => {
  const postsSection = document.querySelector(".postsSection__container");

  postData.forEach((post) => {
    const article = document.createElement("article");
    article.classList.add("article");

    const postHeader = renderPostHeader(post);
    const postBody = renderPostBody(post);

    article.append(postHeader, postBody);
    postsSection.appendChild(article);
  });
  return postsSection;
};

export const renderCreatePostModal = () => {
  const modalControler = document.querySelector(".modal__controler");

  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal__container--newPOst");

  const modaltitle = document.createElement("h2");
  modaltitle.classList.add("post__title__input--modal", "title2", "bolder");
  modaltitle.innerText = "Criando um novo post";
  modalContainer.appendChild(modaltitle);

  const formContainer = document.createElement("form");
  formContainer.classList.add("newpost__form");

  const titleLabel = document.createElement("label");
  titleLabel.classList.add("text3", "bold", "label__name");
  titleLabel.innerText = "Título do post";

  const titleInput = document.createElement("input");
  titleInput.placeholder = "Digite o título aqui...";
  titleInput.classList.add("postData");
  titleInput.name = "title";
  titleInput.id = "postTitle";

  const contentLabel = document.createElement("label");
  contentLabel.classList.add("text3", "bold", "label__name");
  contentLabel.innerText = "Conteúdo do post";

  const textArea = document.createElement("textarea");
  textArea.placeholder = "Desenvolva o conteúdo do post aqui...";
  textArea.classList.add("postData");
  textArea.id = "postContent";
  textArea.name = "content";
  textArea.rows = "10";

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("form__buttons--modal");

  const cancelButton = document.createElement("button");
  cancelButton.classList.add("btn", "btn--gray");
  cancelButton.innerText = "Cancelar";

  cancelButton.addEventListener("click", (event) => {
    event.preventDefault();
    modalControler.innerHTML = "";
    modalControler.close();
  });

  const postButton = document.createElement("button");
  postButton.classList.add("btn", "btn--brand");
  postButton.innerText = "Publicar";

  postButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const inputs = document.querySelectorAll(".postData");
    const feed = document.querySelector(".postsSection__container");
    const postBody = {};
    let counter = 0;

    inputs.forEach((input) => {
      if (input.value.trim() === "") {
        counter++;
      } else {
        postBody[input.name] = input.value;
      }
    });

    if (counter !== 0) {
      toast("Publicações em branco não são permitidas!", failure);
    }

    newPostRequest(postBody);

    inputs.forEach((input) => {
      input.value = "";
    });

    feed.innerHTML = "";

    const postDB = await allPostsRequests();

    renderPosts(postDB);
    
    modalControler.close();
  });

  buttonsContainer.append(cancelButton, postButton);
  formContainer.append(
    titleLabel,
    titleInput,
    contentLabel,
    textArea,
    buttonsContainer
  );
  modalContainer.appendChild(formContainer);

  return modalContainer;
};

export const renderPostHeaderModal = (postData) => {
  const articleHeader = document.createElement("div");
  articleHeader.classList.add("article__header");

  const userinfos = document.createElement("div");
  userinfos.classList.add("userInfos");

  const userImg = document.createElement("img");
  userImg.classList.add("user__img");
  userImg.src = postData.user.avatar;

  const userName = document.createElement("p");
  userName.classList.add("user__name", "text3", "bold");
  userName.innerText = postData.user.username;

  const postDate = document.createElement("p");
  postDate.classList.add("post__date", "text3");
  postDate.innerText = handleDate(postData.createdAt);

  userinfos.append(userImg, userName, postDate);
  articleHeader.appendChild(userinfos);
  return articleHeader;
};

export const renderPostBodyModal = (postData) => {
  const contentContainer = document.createElement("div");
  contentContainer.classList.add("postContent__container");

  const postTitle = document.createElement("h2");
  postTitle.classList.add("post__title", "title3", "bolder");
  postTitle.innerText = postData.title;

  const postContent = document.createElement("p");
  postContent.classList.add("post__content--modal", "text3");
  postContent.innerText = postData.content;

  contentContainer.append(postTitle, postContent);

  return contentContainer;
};

export const renderPostModal = (postData) => {
  const modalControler = document.querySelector(".modal__controler");
  const postContainer = document.createElement("div");
  postContainer.classList.add("modal__container--open");

  const postHeader = renderPostHeaderModal(postData);
  const postBody = renderPostBodyModal(postData);

  const closeButton = document.createElement("button");
  closeButton.classList.add("close-modal", "btn", "btn--gray");
  closeButton.innerText = "X";

  closeButton.addEventListener("click", () => {
    modalControler.close();
    modalControler.innerHTML = "";
  });

  postHeader.appendChild(closeButton);
  postContainer.append(postHeader, postBody);
  return postContainer;
};

const renderEditPostModal = () => {
  const modalControler = document.querySelector(".modal__controler");

  const post = JSON.parse(localStorage.getItem("@petinfo:postdata"));

  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal__container--edit");

  const modaltitle = document.createElement("h2");
  modaltitle.classList.add("post__title__input--modal", "title2", "bolder");
  modaltitle.innerText = "Editando publicação";
  modalContainer.appendChild(modaltitle);

  const formContainer = document.createElement("form");
  formContainer.classList.add("newpost__form");

  const titleLabel = document.createElement("label");
  titleLabel.classList.add("text3", "bold", "label__name");
  titleLabel.innerText = "Título do post";

  const titleInput = document.createElement("input");
  titleInput.placeholder = "Digite o título aqui...";
  titleInput.classList.add("postData");
  titleInput.value = post.title;
  titleInput.id = "postTitle";
  titleInput.name = "title";

  const contentLabel = document.createElement("label");
  contentLabel.classList.add("text3", "bold", "label__name");
  contentLabel.innerText = "Conteúdo do post";

  const textArea = document.createElement("textarea");
  textArea.placeholder = "Desenvolva o conteúdo do post aqui...";
  textArea.classList.add("postData");
  textArea.value = post.content;
  textArea.id = "postContent";
  textArea.name = "content";
  textArea.rows = "10";

  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("form__buttons--modal");

  const cancelButton = document.createElement("button");
  cancelButton.classList.add("btn", "btn--gray");
  cancelButton.innerText = "Cancelar";

  cancelButton.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("@petinfo:editingPost");
    localStorage.removeItem("@petinfo:postdata");
    modalControler.innerHTML = "";
    modalControler.close();
  });

  const postButton = document.createElement("button");
  postButton.classList.add("btn", "btn--brand");
  postButton.innerText = "Publicar";

  postButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const postId = localStorage.getItem("@petinfo:editingPost");
    const inputs = document.querySelectorAll(".postData");
    const feed = document.querySelector(".postsSection__container");
    const postBody = {};
    let counter = 0;

    inputs.forEach((input) => {
      if (input.value.trim() === "") {
        counter++;
      } else {
        postBody[input.name] = input.value;
      }
    });

    if (counter !== 0) {
      toast("Publicações em branco não são permitidas!", failure);
    } else {
      toast("Postagem editada com sucesso!", success);
    }

    await editPostRequest(postBody, postId);

    inputs.forEach((input) => {
      input.value = "";
    });

    feed.innerHTML = "";

    const postDB = await allPostsRequests();

    localStorage.removeItem("@petinfo:editingPost");
    localStorage.removeItem("@petinfo:postdata");
    renderPosts(postDB);
    modalControler.innerHTML = "";
    modalControler.close();
  });

  buttonsContainer.append(cancelButton, postButton);
  formContainer.append(
    titleLabel,
    titleInput,
    contentLabel,
    textArea,
    buttonsContainer
  );
  modalContainer.appendChild(formContainer);
  
  modalControler.innerHTML = ''
  return modalContainer;
};

const renderDeletePostModal = () => {
  const modalControler = document.querySelector('.modal__controler')
  modalControler.innerHTML = ''

  const modalContainer = document.createElement('div')
  modalContainer.classList.add('modal__container--delete')

  const modalTitle = document.createElement('h2')
  modalTitle.classList.add('title2', 'bold')
  modalTitle.innerText = "Confirmar exclusão"

  const modalQuestion = document.createElement('p')
  modalQuestion.classList.add('text1', 'bold')
  modalQuestion.innerText = 'Tem certeza que deseja excluir esse post?'

  const modalCaution = document.createElement('p')
  modalCaution.classList.add('text3')
  modalCaution.innerText = 'Esta ação não poderá ser desfeita, então pedimos cautela antes de concluir'

  const buttonsContainer = document.createElement('div')
  buttonsContainer.classList.add('modalDelete__buttons')

  const cancelButton = document.createElement('button')
  cancelButton.classList.add('btn', 'btn--gray')
  cancelButton.innerText = 'Cancelar'

  cancelButton.addEventListener('click', () => {
    localStorage.removeItem('@petinfo:deletingpost')
    modalControler.close()
  })

  const submitButton = document.createElement('button')
  submitButton.classList.add('btn', 'btn--alert')
  submitButton.innerText = 'Sim, excluir este post'

  submitButton.addEventListener('click', async (event) => {
    event.preventDefault()
    const postId = localStorage.getItem('@petinfo:deletingpost')
    const feedContainer = document.querySelector('.postsSection__container')

    toast("Postagem deletada com sucesso!", success)

    setTimeout(() => {
      deletePostRequest(postId)
    }, 500)
    
    const postDB = await allPostsRequests()
    renderPosts(postDB)

    modalControler.close()
    feedContainer.innerHTML = ''


    localStorage.removeItem('@petinfo:deletingpost')
  })

  buttonsContainer.append(cancelButton,submitButton)
  modalContainer.append(modalTitle, modalQuestion, modalCaution, buttonsContainer)

  return modalContainer
};

