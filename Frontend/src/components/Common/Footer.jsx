import { Instagram, Github, Linkedin } from "../../../public/svgs/Icons";
import { gitHub_URL, insta_URL, linkedIn_URL } from "../../config/credentials";

const Footer = () => {
  return (
    <footer className=' pt-4'>
      <div className="container">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <ul className="social overflow-hidden text-center">
            <li className='mx-2 d-inline-block' onClick={() => window.location.href = linkedIn_URL}>
              <a className='bg-gradient-primary d-inline-block'><Linkedin /></a>
            </li>
            <li className='mx-2 d-inline-block' onClick={() => window.location.href = insta_URL}>
              <a className='bg-gradient-primary d-inline-block'><Instagram /></a>
            </li>
            <li className='mx-2 d-inline-block' onClick={() => window.location.href = gitHub_URL}>
              <a className='bg-gradient-primary d-inline-block'><Github /></a>
            </li>
          </ul>
        </div>
        <p className="copyright">Copyright &copy; 2024 Instant-fix company</p>
      </div>
    </footer>
  )
}

export default Footer;