import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { Link } from 'react-router-dom';
import React from 'react';
import Slider from 'react-slick';
import { useState } from 'react';
import { useEffect } from 'react';
import { ethers } from 'ethers';
import contract from '../../contract/nft.json';
import env from "react-dotenv";

export default function TopNFTList(props) {

  const [minted, setMinted] = useState(0);
  const [mainPrice, setMainPrice] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [nftItems, setNftItems] = useState([]);
  useEffect(() => {
    if (props.status === "connected") {
      fetchSmartContract();
    }
  }, [props.status, props.chainId]);

  useEffect(() => {
    fetchNFTItems();
  }, [
    minted, maxSupply
  ]);

  const fetchNFTItems = () => {
    let promises = [];
    for (let index = 0; index < 10 && index < maxSupply && index < minted; index++) {
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
        setNftItems(response.concat(response));
      }).catch((error) => {
        console.log(error);
      }).finally(() => {

      });
    }).catch((err) => {
      console.log(err);
    }).finally(() => {

    });
  };

  const fetchSmartContract = () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(contract.address, contract.abi, signer);
      let promises = [nftContract.minted(), nftContract.price(), nftContract.maxSupply()];
      Promise.all(promises).then((res) => {
        let mint = res[0];
        let price = res[1];
        let supply = res[2];
        setMinted(Number(mint._hex));
        setMainPrice(Number(price));
        setMaxSupply(Number(supply));
      }).catch((err) => {
        console.log(err);
        setMinted(0);
        setMainPrice(0);
        setMaxSupply(0);
      }).finally(() => {

      });
    } else {
      console.log("Ethereum object does not exist");
    }
  };

  const settings = {
    dots: true,
    arrow: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    margin: 20,
    responsive: [
      {
        breakpoint: 4000,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="section__artists mt-100">
      <div className="container">
        <div className="space-y-30">
          <div className="section_head">
            <h2 className="section__title mt-10">Top Artists</h2>
          </div>
          <div className="section_body swiper_artists">
            <Slider {...settings}>
              {nftItems.map((val, i) => (
                <div className="item" key={i}>
                  <div className="creator_item creator_card rounded_border space-x-10">
                    <div className="avatars space-x-10">
                      <div className="media">
                        <Link to={{ pathname: 'Item-details', state: { nft: val } }}>
                          <img
                            src={`${env.BACKEND_ORIGIN}/arts/images/${val.index}`}
                            alt="Avatar"
                            className="avatar avatar-md"
                          />
                        </Link>
                      </div>
                      <div>
                        <Link to={{ pathname: props.info.explorer + '/address/' + contract.address }} target="_blank">
                          <p className="avatars_name color_black">
                            #{val.index}
                          </p>
                          <p className="avatars_name color_black">
                            @{val.name}
                          </p>
                        </Link>
                        <Link className="btn btn-sm btn-primary" to={{ pathname: 'https://' + props.info.net + '.opensea.io/assets/' + props.info.chain + '/' + contract.address + '/' + val.index }} target="_blank">
                          Buy
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}
