import Swal from "sweetalert2";
import "./confirmAlert.css";

const confirmAlert = (content) => {
   return Swal.fire({
      html: `<div class="custom-text">${content}</div>`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm',
      position: "bottom",
      customClass: {
         popup: 'custom-width',
         confirmButton: 'confirm-btn',
         cancelButton: 'cancel-btn'
      },
      buttonsStyling: false
   })
}

export default confirmAlert;