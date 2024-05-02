import React from 'react';
import Login from './login';

const LoginModal = ({  setUserEmail, setOpenLogin }) => {
  return (
    <div className={`modal-view `}>

      <Login setUserEmail={setUserEmail} setOpenLogin={setOpenLogin} />

    </div>
  );
};

export default LoginModal;
