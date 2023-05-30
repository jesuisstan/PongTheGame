import Swal from 'sweetalert2';
import * as color from '../UI/colorsPong';

const errorAlert = (text: string) => {
  Swal.fire({
    showConfirmButton: false,
    icon: 'error',
    iconColor: '#fd5087',
    width: 450,
    title: 'Oops...',
    text: text,
    showCloseButton: true,
    color: color.PONG_WHITE,
    background: 'rgba(0, 0, 0, 0.95)'
  });
};

export default errorAlert;
