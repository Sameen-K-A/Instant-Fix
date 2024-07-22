import React from 'react';

function AddressModal() {
  return (
    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body p-4">
            <h5 className="modal-title" id="exampleModalLabel">Add address</h5>
            <form className='my-4'>
              <input type="text" className="form-control mb-3" placeholder="Name" />
              <textarea className="form-control mb-3" placeholder="House name, House/ Flat number, District" style={{ minHeight: "50px", maxHeight: "150px" }} />
              <input type="tel" className="form-control mb-3" placeholder="PIN Code" />
              <div className='d-flex'>
                <input type="tel" className="form-control me-2" placeholder="Phone number" />
                <input type="tel" className="form-control" placeholder="Alternate number" />
              </div>
            </form>
            <div className='d-flex justify-content-center align-items-center'>
              <button className="btn btn-outline-primary w-30 me-3" data-bs-dismiss="modal">Cancel</button>
              <button className="btn bg-gradient-primary w-30">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressModal;