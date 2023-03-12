import Hero1 from '../../components/hero/Hero1';
import Logos from '../../components/Sections/Logos';
import React from 'react';
import SiteFooter from '../../components/footer/SiteFooter';
import SiteHeader from '../../components/header/SiteHeader';
import TopNFTList from '../../components/creators/TopNFTList';
import useDocumentTitle from '../../components/useDocumentTitle';

const Home = (props) => {
  useDocumentTitle(' Home');
  return (
    <div>
      <SiteHeader {...props} />
      <Hero1 />
      <TopNFTList {...props} />
      <Logos />
      <SiteFooter {...props} />
    </div>
  );
};

export default Home;
