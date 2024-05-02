import React from 'react';
import Subscribe from './subscribe-form';
import userEvent from '@testing-library/user-event';


const SubscribeModal = ({  setUserEmail, setOpenedSubscribe, setOpenLogin, userEmail }) => {
  return (
    <div className={`modal-view `}>
      <Subscribe userEmail={userEmail} setUserEmail={setUserEmail} setOpenedSubscribe={setOpenedSubscribe} setOpenLogin={setOpenLogin} />
    </div>
  );
};

export default SubscribeModal;
