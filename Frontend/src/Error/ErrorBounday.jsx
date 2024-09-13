import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import NotFoundPage from '../Components/Common/Page404';
import { useNavigate } from 'react-router-dom';

function ErrorFallback({ error, resetErrorBoundary }) {
   const navigate = useNavigate();

   const handleReset = () => {
      resetErrorBoundary();
      navigate(-1);
   };

   return (
      <>
         <NotFoundPage />
         <button onClick={handleReset}>Go Back</button>
      </>
   );
}

const AppErrorBoundary = ({ children }) => {
   const navigate = useNavigate();

   return (
      <ErrorBoundary
         FallbackComponent={ErrorFallback}
         onError={(error, info) => {
            console.error('Error caught by ErrorBoundary:', error, info);
            navigate('/404', { replace: true }); 
         }}
      >
         {children}
      </ErrorBoundary>
   );
};

export default AppErrorBoundary;