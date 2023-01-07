import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'reactjs-popup/dist/index.css';
import Pagination from './Pagination';
import contract from '../../../contract/nft.json';
import env from "react-dotenv";

function CardsPrice(props) {

  const [countPerPage, setCountPerPage] = useState(0);
  const [nftItems, setNftItems] = useState([]);
  const [maxSupply, setMaxSupply] = useState(0);
  const [minted, setMinted] = useState(0);
  const [mainPrice, setMainPrice] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setMaxSupply(typeof props.maxSupply === 'number' ? props.maxSupply : 0);
    setMinted(typeof props.minted === 'number' ? props.minted : 0);
    setMainPrice(typeof props.mainPrice === 'number' ? props.mainPrice : 0);
    setCountPerPage(typeof props.countPerPage === 'number' ? props.countPerPage : 12);
  }, [props.maxSupply, props.minted, props.mainPrice, props.countPerPage]);

  useEffect(() => {
    fetchNFTItems();
  }, [page, countPerPage, maxSupply, minted]);

  const fetchNFTItems = () => {
    let promises = [];
    for (let index = page * countPerPage; index < (page + 1) * countPerPage && index < maxSupply && index < minted; index++) {
      promises.push(fetch(env.BACKEND_ORIGIN + '/arts/jsons/' + (index),
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      ));
    }

    Promise.all(promises).then((res) => {
      let jsonPromises = [];
      res.forEach(element => {
        jsonPromises.push(element.json());
      });
      Promise.all(jsonPromises).then((response) => {
        let nfts = [];
        response.forEach(item => {
          let nft = {
            index: item.index,
            img: item.index,
            title: item.name,
            price: mainPrice,
          };
          nfts.push(nft);
        });
        setNftItems(nfts);
      }).catch((error) => {
        console.log(error);
      }).finally(() => {

      });
    }).catch((err) => {
      console.log(err);
    }).finally(() => {

    });
  };

  return (
    <div className="row mb-30_reset">
      {nftItems.map((val, i) => (
        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6" key={i}>
          <div className="card__item four">
            <div className="card_body space-y-10">
              {/* =============== */}
              <div className="card_head">
                <Link to={{ pathname: 'Item-details', state:{ nft: val } }}>
                  <img src={`${env.BACKEND_ORIGIN}/arts/images/${val.index}`} alt="nftimage" />
                </Link>
              </div>
              {/* =============== */}
              <h6 className="card_title">{val.title}</h6>
              <div className="card_footer d-block space-y-10">
                <div className="card_footer justify-content-between">
                </div>
                <div className="hr" />
                <div
                  className="d-flex
                                  align-items-center
                                  space-x-10
                                  justify-content-between">
                  <Link className="btn btn-sm btn-primary" to={{ pathname: 'https://' + props.info.net + '.opensea.io/assets/' + props.info.chain + '/' + contract.address + '/' + val.index }} target="_blank">
                    Buy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <Pagination total={minted} page={page} countPerPage={countPerPage} setPage={(pageNumber) => { setPage(pageNumber) }} />
    </div>
  );
}

export default CardsPrice;
