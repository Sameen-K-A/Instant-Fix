const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="mt-4 d-flex justify-content-center gap-2">
        {currentPage !== 1 && (
          <button className="btn btn-outline-primary" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        )}
        {pageNumbers.map(number => (
          <button key={number} className={`btn ${number === currentPage ? 'bg-gradient-primary' : 'btn-outline-primary'}`} onClick={() => setCurrentPage(number)}>{number}</button>
        ))}
        {currentPage !== totalPages && (
          <button className="btn btn-outline-primary" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        )}
      </ul>
    </nav>
  );
};

export default Pagination; 