import React, { useState, useEffect } from "react";

const TimeTracker = () => {
  const [checkInTime, setcheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [disableIn, setDisableIn] = useState(false);
  const [disableOut, setDisableOut] = useState(true);
  const [timeArray, setTimeArray] = useState([]);
  const [finalResult, setFinalResult] = useState("");

  useEffect(() => {
    const localArray = localStorage.getItem("timeArray");
    if (localArray) {
      setTimeArray(JSON.parse(localArray));
      calculateFinalTime(JSON.parse(localArray));
    }
  }, []);

  const calculateFinalTime = (arr) => {
    const finalTime = arr.reduce((prev, next) => ({
      hour: +prev?.hour + +next.hour,
      minute: +prev?.minute + +next.minute,
      second: +prev?.second + +next.second,
    }));

    // console.log("finalTime :>> ", finalTime);

    let { hour, minute, second } = finalTime;
    // console.log("hour,minute,second :>> ", hour, minute, second);

    if (second > 60) {
      let temp = Math.floor(second / 60);
      second = second % 60;
      minute += temp;
    }

    if (minute > 60) {
      let temp = Math.floor(minute / 60);
      minute = minute % 60;
      hour += temp;
    }

    const lastResult = `${hour}:${minute}:${second}`;

    setFinalResult(lastResult);
  };

  const getCheckInTime = () => {
    let today = new Date();
    setcheckInTime(today);
    setDisableIn(true);
    setDisableOut(false);
  };

  const getCheckOutTime = () => {
    let today = new Date();
    setCheckOutTime(today);

    // localStorage.setItem("checkOutTime", today);
    setDisableOut(true);
    setDisableIn(false);

    // const intime = new Date(localStorage.getItem("checkInTime"));
    // const outtime = new Date(localStorage.getItem("checkOutTime"));

    const timeObj = getPerfectTime(checkInTime, today);
    setTimeArray([...timeArray, timeObj]);
    localStorage.setItem("timeArray", JSON.stringify([...timeArray, timeObj]));

    const newArr = JSON.parse(localStorage.getItem("timeArray"));

    calculateFinalTime(newArr);

    // console.log("newArr :>> ", newArr);
    // console.log("newArr[2]", typeof newArr[2]);
  };

  const getPerfectTime = (first, second) => {
    let hours = 0,
      minutes = 0,
      seconds = 0;

    first.getSeconds() !== 0
      ? (seconds = 60 - first.getSeconds() + second.getSeconds())
      : (seconds = second.getSeconds());
    if (seconds >= 60) {
      seconds = seconds % 60;
      minutes++;
    }

    first.getSeconds() !== 0
      ? (minutes = minutes + (59 - first.getMinutes()) + second.getMinutes())
      : (minutes = minutes + (60 - first.getMinutes()) + second.getMinutes());

    if (minutes >= 60) {
      minutes = minutes % 60;
      hours = 1;
    }

    first.getMinutes() !== 0
      ? (hours = hours + (23 - first.getHours()) + second.getHours())
      : (hours = hours + (24 - first.getHours()) + second.getHours());

    if (hours >= 24) {
      hours = hours % 24;
    }

    const timeObj = {
      hour: hours,
      minute: minutes,
      second: seconds,
    };

    return timeObj;
  };

  return (
    <div className="container-fluid d-flex flex-column min-vh-100 align-items-center bg-light">
      <div className="d-flex p-5 w-25 justify-content-between">
        <button
          className="btn btn-primary"
          onClick={getCheckInTime}
          disabled={disableIn}
        >
          Check In
        </button>
        <button
          className="btn btn-primary"
          onClick={getCheckOutTime}
          disabled={disableOut}
        >
          Check Out
        </button>
      </div>
      <h2>Your Working Time ::: {finalResult}</h2>
    </div>
  );
};

export default TimeTracker;
