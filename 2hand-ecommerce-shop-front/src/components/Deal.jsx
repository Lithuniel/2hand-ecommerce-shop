/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/auth-context.jsx";
import "../assets/css/Deal.css";
import { getDealExchangeConditions } from "../api/get-deal-exchange-conditioons.js";
import { getDealRates } from "../api/get-deal-rates.js";
import { RatingModal } from "./RatingModal.jsx";

export function Deal({ deal, onAccept, onReject }) {
  const { currentUser, token } = useContext(AuthContext);
  const userId = currentUser?.id;
  const [exchangeDateTime, setExchangeDateTime] = useState(null);
  const [fetched, setFetched] = useState(false);
  const [ratings, setRatings] = useState([]);
  const currentDate = new Date();
  const exchangeDate = new Date(exchangeDateTime);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleRateClick = () => {
    setModalVisible(true);
  };

  const handleCloseModal = (wasSuccessful) => {
    setModalVisible(false);
    if (wasSuccessful) {
      // Handle post-rating actions, e.g., updating the deal's status, UI updates, etc.
    }
  };

  useEffect(() => {
    if (!fetched && deal[0].id) {
      getDealExchangeConditions(deal[0].id)
        .then((data) => {
          setExchangeDateTime(data.exchange_date_time);
          return getDealRates(deal[0].id);
        })
        .then((rates) => {
          setRatings(rates);
          setFetched(true);
        })
        .catch((error) => console.error(error));
    }
  }, [deal, fetched]);

  const userHasRated = () => {
    return ratings.some((rate) => rate.userid === userId);
  };

  return (
    <div className="deal-for-page">
      <h1 className="deal-date-page">
        Deal created at: {new Date(deal[0].createdAt).toLocaleString()}
      </h1>
      <h2 className="deal-status-page ">Status: {deal[0].status}</h2>
      {deal[0].status === "pending" && (
        <div className="button-deal-container">
          {deal[0].seller_id === userId && (
            <button
              className="button-deal-accept"
              onClick={() => onAccept(deal[0].id)}
            >
              Accept
            </button>
          )}
          <button
            className="button-deal-reject"
            onClick={() => onReject(deal[0].id)}
          >
            Reject
          </button>
        </div>
      )}
      {deal.map((item, i) => (
        <div className="deal-item-page" key={i}>
          <p className="item-owner-page">Owner: {item.owner_username}</p>
          <p className="item-name-page">Item: {item.item_name}</p>
        </div>
      ))}
      {deal[0].status === "accepted" &&
        currentDate > exchangeDate &&
        !userHasRated() && (
          <button className="button-rate-deal" onClick={handleRateClick}>
            Rate
          </button>
        )}

      {isModalVisible && (
        <RatingModal
          dealId={deal[0].id}
          token={token}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
