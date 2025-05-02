import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthForm from './components/AuthForm';

function App() {
  return (
    <>
      <AuthForm />
      <ToastContainer position="bottom-center" autoClose={3000} />
    </>
  );
}

export default App;
