export const success = "#087d5a"
export const failure = "#db3d5a"

export const toast = (message, status) => {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: status,
    },
  }).showToast();
}