import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import Activity from "../views/pages/others/Activity"
import Article from "../views/pages/blog/Article"
import Blog from "../views/pages/blog/Blog"
import Chat from "../views/pages/Support/Chat"
import Collections from "../views/pages/NftPages/Collections"
import ConnectWalllet from "../views/pages/account/ConnectWalllet"
import Contact from "../views/pages/Support/Contact"
import Creators from "../views/pages/NftPages/Creators"
import EditProfile from "../views/pages/account/EditProfile"
import Faq from "../views/pages/Support/Faq"
import Forum from "../views/pages/forum/Forum"
import Home from "../views/homes/Home"
import Home1 from "../views/homes/Home1"
import Home2 from "../views/homes/Home2"
import Home3 from "../views/homes/Home3"
import ItemDetails from "../views/pages/item/ItemDetails"
import LiveAuctions from "../views/pages/NftPages/LiveAuctions"
import Login from "../views/pages/account/Login"
import Marketplace from "../views/pages/NftPages/Marketplace"
import Newsletter from "../views/pages/others/Newsletter"
import NoResults from "../views/pages/others/NoResults"
import NotFound from "../views/NotFound"
import PostDetails from "../views/pages/forum/PostDetails"
import Preview from "../views/Preview";
import PrivacyPolicy from "../views/pages/others/PrivacyPolicy"
import Profile from "../views/pages/account/Profile"
import Ranking from "../views/pages/NftPages/Ranking"
import React from "react";
import Register from "../views/pages/account/Register"
import SubmitRequest from "../views/pages/Support/SubmitRequest"
import UpcomingProjects from "../views/pages/NftPages/UpcomingProjects"
import Upload from "../views/pages/item/Upload"
import UploadType from "../views/pages/item/UploadType"

const Routes = (props) => {
    return (
        <>
            <Router>
                <Switch>
                    <Route exact path="/" render={() => <Home {...props} />} />
                    {/* <Route exact path="/preview" render={() => <Preview {...props} />} />
                    <Route path="/home-1" render={() => <Home1 {...props} />} />
                    <Route path="/home-2" render={() => <Home2 {...props} />} />
                    <Route path="/home-3" render={() => <Home3 {...props} />} /> */}
                    {/* inner pages */}
                    {/* <Route path="/connect-wallet" render={() => <ConnectWalllet {...props} />} /> */}
                    <Route path="/login" render={() => <Login {...props} />} />
                    {/* <Route path="/profile" render={() => <Profile {...props} />} /> */}
                    <Route path="/wallet" render={() => <Profile {...props} />} />
                    {/* <Route path="/edit-profile" render={() => <EditProfile {...props} />} />
                    <Route path="/register" render={() => <Register {...props} />} />
                    <Route path="/blog" render={() => <Blog {...props} />} />
                    <Route path="/article" render={() => <Article {...props} />} /> */}
                    <Route path="/item-details" render={() => <ItemDetails {...props} />} />
                    {/* <Route path="/upload" render={() => <Upload {...props} />} />
                    <Route path="/upload-type" render={() => <UploadType {...props} />} />
                    <Route path="/collections" render={() => <Collections {...props} />} />
                    <Route path="/creators" render={() => <Creators {...props} />} />
                    <Route path="/live-auctions" render={() => <LiveAuctions {...props} />} /> */}
                    <Route path="/marketplace" render={() => <Marketplace {...props} />} />
                    {/* <Route path="/ranking" render={() => <Ranking {...props} />} />
                    <Route path="/upcoming-projects" render={() => <UpcomingProjects {...props} />} />
                    <Route path="/activity" render={() => <Activity {...props} />} />
                    <Route path="/newsletter" render={() => <Newsletter {...props} />} />
                    <Route path="/chat" render={() => <Chat {...props} />} />
                    <Route path="/submit-request" render={() => <SubmitRequest {...props} />} />
                    <Route path="/no-results" render={() => <NoResults {...props} />} />
                    <Route path="/faq" render={() => <Faq {...props} />} />
                    <Route path="/privacy-policy" render={() => <PrivacyPolicy {...props} />} />
                    <Route path="/forum" render={() => <Forum {...props} />} />
                    <Route path="/post-details" render={() => <PostDetails {...props} />} />
                    <Route path="/contact" render={() => <Contact {...props} />} /> */}
                    <Route render={() => <NotFound {...props} />} />

                </Switch>
            </Router>
        </>
    );
};

export default Routes;
