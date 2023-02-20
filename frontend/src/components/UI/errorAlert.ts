import Swal from 'sweetalert2';

const errorAlert = (text: string) => {
  Swal.fire({
    showConfirmButton: false,
    icon: 'error',
    iconColor: '#fd5087',
    width: 450,
    title: 'Oops...',
    text: text,
    showCloseButton: true,
    color: 'whitesmoke',
    background: 'black'
  });
};

export default errorAlert
