import Swal from 'sweetalert2';

const goalAlert = () => {
  Swal.fire({
    position: 'center',
    width: 'auto',
    color: 'rgba(253, 80, 135, 0.507)',
    background: 'rgba(0, 0, 0, 0)',
    title: 'G O A L',
    showConfirmButton: false,
    timer: 300,
    showClass: {
      popup: 'swal2-show',
      backdrop: 'none',
    },
  })
};

export default goalAlert;
