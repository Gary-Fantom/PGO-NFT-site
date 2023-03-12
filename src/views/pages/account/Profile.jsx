
import CardProfile from '../../../components/cards/CardProfile';
import React from 'react';
import SiteFooter from '../../../components/footer/SiteFooter';
import SiteHeader from '../../../components/header/SiteHeader';
import useDocumentTitle from '../../../components/useDocumentTitle';

const Profile = (props) => {
  useDocumentTitle('Profile ');
  return (
    <div>
      <SiteHeader {...props} />
      <div className="hero_marketplace bg_white" style={{ padding: '50px 0' }}>
        <div className="container">
          <h1 className="text-center">My Wallet</h1>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <CardProfile {...props} />
      </div>
      <SiteFooter {...props} />
    </div>
  );
};

export default Profile;
