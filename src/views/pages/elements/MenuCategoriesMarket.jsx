import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CardMarketplace from '../../../components/cards/CardMarketplace';
import CardsCrerators from '../../../components/cards/filterscards/CardsCreators';
import CardsPrice from '../../../components/cards/filterscards/CardsPrice';

function MenuCategoriesMarket(props) {

  const [currentTab, setCurrentTab] = useState(0);

  return (
    <div className="w-100">
      <Tabs className=" border-b">
        <TabList className="menu_categories  bg_white py-20 px-15 w-100 d-none">
          <Tab>
            <Link className="color_brand" to="/marketplace">
              <span> All </span>
            </Link>
          </Tab>
        </TabList>

        <TabPanel>
          <div className="container">
            <div className="section mt-100">
              <div>
                <h2 className="section__title mb-20"> All Categories</h2>
                <div>
                  <div>
                    <div className="d-flex align-items-center">
                      <Tabs className="col-xl-12 col-lg-12 col-md-12 col-sm-12" selectedIndex={currentTab} onSelect={(index) => setCurrentTab(index)}>
                        <div className="row justify-content-between align-items-center section__head">
                          <div className="col-lg-auto">
                            <TabList className="menu_categories menu_start">
                              <Tab className="switch_item">
                                <span className="btn btn-white btn-sm">
                                  All items
                                </span>
                              </Tab>
                              <Tab className="switch_item">
                                <span className="btn btn-white btn-sm">
                                  Has list price
                                </span>
                              </Tab>
                              <Tab className="switch_item">
                                <span className="btn btn-white btn-sm">
                                  Owned by creator
                                </span>
                              </Tab>
                            </TabList>
                          </div>
                        </div>

                        <TabPanel>
                          <CardMarketplace {...props} changeTab={(tab) => {
                            setCurrentTab(tab);
                            window.scrollTo({
                              top: 0,
                              left: 0,
                              behavior: "smooth"
                            });
                          }} />
                        </TabPanel>
                        <TabPanel>
                          <CardsPrice {...props} />
                        </TabPanel>
                        <TabPanel>
                          <CardsCrerators {...props} />
                        </TabPanel>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default MenuCategoriesMarket;
