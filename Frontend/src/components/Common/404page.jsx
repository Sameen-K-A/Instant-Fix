import React from 'react';

const NotFound = () => {
  return (
    <div id="notfound" className='position-relative min-vh-100'>
      <div className="notfound position-absolute w-100 text-center">
        <div className="notfound-404 position-relative">
          <h1 className='m-0 position-absolute text-dark'>OOPS!</h1>
          <h2 className='text-dark m-auto position-absolute'>404 - The page can't be found.</h2>
        </div>
        <button className='btn bg-gradient-primary btn-lg' onClick={() => window.history.back()}>Go To Homepage</button>
      </div>
    </div>
  );
}

export default NotFound;
