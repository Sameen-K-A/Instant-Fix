import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';

function ErrorFallback({ error, resetErrorBoundary }) {
   const navigate = useNavigate();

   const handleReset = () => {
      resetErrorBoundary();
      navigate(-1);
   };

   return (
      <div id="notfound" className="position-relative min-vh-100">
         <div className="notfound position-absolute w-100 text-center">
            <div className="notfound-404 position-relative">
               <h1 className="m-0 position-absolute text-dark">OOPS!</h1>
               <h2 className="text-dark m-auto position-absolute">404 - The page can't be found.</h2>
            </div>
            <button className="btn bg-gradient-primary btn-lg" onClick={handleReset}>Go Back </button>
         </div>
      </div>
   );
}

const AppErrorBoundary = ({ children }) => {
   return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
         {children}
      </ErrorBoundary>
   );
};

export default AppErrorBoundary;