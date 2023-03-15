import React, { useContext, useState } from "react";
import "./Reserve.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reserve = ({ setOpen, hotelId }) => {
  const navigate = useNavigate();
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data, loading, error } = useFetch(
    `http://localhost:8800/api/hotels/rooms/${hotelId}`
  );
  const { dates } = useContext(SearchContext);
  const handleRoomChange = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };
  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const list = [];
    while (start <= end) {
      list.push(new Date(start).getTime());
      start.setDate(start.getDate() + 1);
    }
    return list;
  };

  const allDates = getDatesInRange(dates[0].startDate, dates[0].endDate);
  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavaiableDates.some((date) =>
      allDates.includes(new Date(date).getTime())
    );
    return !isFound;
  };

  const handleClick = async () => {
    try {
      await Promise.all(
        selectedRooms.map((roomId) => {
          const res = axios.put(
            `http://localhost:8800/api/rooms/availability/${roomId}`,
            { dates: allDates }
          );
          return res.data;
        })
      );
      setOpen(false);
      navigate("/");
    } catch (err) {}
  };
  console.log(setOpen);
  return (
    <div className="app__reserve">
      <div className="app__reserve-container">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="reserve__close"
          onClick={() => setOpen(false)}
        />
        <span>Select Your Rooms:</span>
        {data.map((item) => (
          <div className="reserve__item">
            <div className="reserve__item-info">
              <div className="reserve__item-title">{item.title}</div>
              <div className="reserve__item-description">{item.desc}</div>
              <div className="reserve__item-maxPeople">
                Max People: {item.maxPeople}
              </div>
              <div className="reserve__item-price">Price: ${item.price}</div>
            </div>
            <div className="reserve__select-room">
              {item.roomNumber.map((roomNumber) => (
                <div className="room__number">
                  <label htmlFor="">{roomNumber.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumber._id}
                    onChange={handleRoomChange}
                    disabled={!isAvailable(roomNumber)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button className="reserve__button" onClick={handleClick}>
          Reserve Now
        </button>
      </div>
    </div>
  );
};

export default Reserve;
