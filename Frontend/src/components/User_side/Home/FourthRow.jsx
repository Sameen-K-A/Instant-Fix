import React from 'react';
import { Logout } from '../../../../public/svgs/Icons';

const FourthRaw = () => {
    return (
        <section className="container pt-7 pb-4" id="features">
            <div className="text-center mb-4">
                <h2 className="font-weight-bolder text-info text-gradient pb-1">Key Features</h2>
                <h5 className="pb-2">Discover how InstantFix makes your life easier.</h5>
            </div>
            <div className="row text-center">
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card border-0 shadow-lg">
                        <div className="card-body">
                            <h5 className="card-title mt-3">Secure Online Payment</h5>
                            <svg xmlns="http://www.w3.org/2000/svg" height="25" width="27.5" viewBox="0 0 576 512"><path fill="#B197FC" d="M512 80c8.8 0 16 7.2 16 16l0 32L48 128l0-32c0-8.8 7.2-16 16-16l448 0zm16 144l0 192c0 8.8-7.2 16-16 16L64 432c-8.8 0-16-7.2-16-16l0-192 480 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24l48 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0z" /></svg>
                            <p className="card-text py-3">Make payments quickly and safely using our integrated online payment system. Your financial security is our priority.</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card border-0 shadow-lg">
                        <div className="card-body">
                            <h5 className="card-title mt-3">Find Technicians Nearby</h5>
                            <svg xmlns="http://www.w3.org/2000/svg" height="25" width="20" viewBox="0 0 384 512"><path fill="#B197FC" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" /></svg>
                            <p className="card-text py-3">Easily locate and book technicians based on your location. Get the help you need, right when you need it.</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card border-0 shadow-lg">
                        <div className="card-body">
                            <h5 className="card-title mt-3">Exclusive Feature</h5>
                            <svg xmlns="http://www.w3.org/2000/svg" height="25" width="22.5" viewBox="0 0 448 512"><path fill="#B197FC" d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288l111.5 0L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7l-111.5 0L349.4 44.6z" /></svg>
                            <p className="card-text py-3">Experience our unique feature designed to enhance your interaction with the platform. Stay tuned for more details!</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FourthRaw;