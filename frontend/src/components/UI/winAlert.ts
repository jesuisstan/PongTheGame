import Swal from 'sweetalert2';

const winAlert = (title: string, text: string) => {
  Swal.fire({
    showConfirmButton: false,
    icon: 'info',
    iconColor: '#fd5087',
    width: 450,
    title: title,
    text: text,
    showCloseButton: true,
    color: 'whitesmoke',
    background: 'black'
  });
};

export default winAlert
