import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import CardProfile from '../../../components/cards/CardProfile';
import CollectionProfile from '../../../components/collection/CollectionProfile';
import { Link } from 'react-router-dom';
import React from 'react';
import SidebarProfile from '../../../components/sidebars/SidebarProfile';
import SiteFooter from '../../../components/footer/SiteFooter';
import SiteHeader from '../../../components/header/SiteHeader';
import useDocumentTitle from '../../../components/useDocumentTitle';

const Profile = (props) => {
  useDocumentTitle('Profile ');
  return (
    <div>
      <SiteHeader {...props} />
      <div className="hero_marketplace bg_white">
        <div className="container">
          <h1 className="text-center">My Wallet</h1>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <CardProfile {...props} />
      </div>
      <SiteFooter />
    </div>
  );
};

export default Profile;
