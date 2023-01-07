import React from 'react';
import {Link} from 'react-router-dom';
import Footer from '../components/footer/Footer';
import SiteFooter from '../components/footer/SiteFooter';
import Header from '../components/header/Header';
import SiteHeader from '../components/header/SiteHeader';
import useDocumentTitle from '../components/useDocumentTitle';

const NotFound = (props) => {
  useDocumentTitle(' Page Not Found ');
  return (
    <div>
      <SiteHeader {...props} />
      <div className="not__found">
        <div className="container">
          <div className="row justify-content-center align-items-center pt-100">
            <div className="col-lg-3 d-none d-lg-block">
              <img
                className="img-fluid"
                src={`img/bg/left-Skull.png`}
                alt="skull"
              />
            </div>
            <div className="col-lg-6">
              <div className="space-y-30 content">
                <div
                  className="space-y-20 d-flex flex-column
                        justify-content-center align-items-center">
                  <img className="img" src={`img/bg/404.png`} alt="skull" />
                  <h2 className="text-center">whooops 🥺!Page not Found</h2>
                  <p className="text-center">
                    Maybe bigfoot has broken this page. Come back to the
                    Homepage
                  </p>
                  <div>
                    <Link to="/" className="btn btn-grad">
                      Go Back
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 d-none d-lg-block">
              <img
                className="img-fluid"
                src={`img/bg/right-Skull.png`}
                alt="skull"
              />
            </div>
          </div>
        </div>
      </div>
      <SiteFooter {...props} />
    </div>
  );
};

export default NotFound;
