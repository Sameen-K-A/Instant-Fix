import { Send } from '../../../public/svgs/Icons';

const MsgBtn = () => {
  return (
    <div className='mt-3 px-3 d-flex align-items-center justify-content-center gap-3'>
      <input type="text" className='form-control py-3' placeholder='Enter your message' />
      <button className='btn btn-outline-primary mb-0 py-3 d-flex align-items-center justify-content-center' > <Send /> </button>
    </div>
  );
};

export default MsgBtn;