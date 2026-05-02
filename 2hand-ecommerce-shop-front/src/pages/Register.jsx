import "../assets/css/pagescss/Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { sendRegister } from "../api/send-register";
import logoblackregister from "../assets/img/TrocoBlack.svg";
import locations from "../utils/locations-list";
import { LocationSelect } from "../components/LocationSelect";

export function Register() {
  const [payload, setPayload] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    city: "",
    profile_img: "",
    bio_summary: "",
  });

  const navigate = useNavigate();

  const onLocationSelected = (selectedCity) => {
    setPayload({
      ...payload,
      city: selectedCity,
    });
  };

  async function onSubmit(evt) {
    evt.preventDefault();
    try {
      await sendRegister(payload);
      console.log(payload);
      navigate("/ValidationCode", { state: { email: payload.email } });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <main className="formRegister">
        <form onSubmit={onSubmit} className="form">
          <Link className="aLogin" to="/">
            <button
              className="loginButton1"
              style={{
                backgroundImage: `url(${logoblackregister})`,
              }}
            ></button>
          </Link>
          <h1 className="registerH1">Create your account</h1>
          <div className="inputRegister">
            <label htmlFor="username"></label>
            <input
              className="inputRegister2"
              type="text"
              id="username"
              name="username"
              placeholder="User Name"
              required
              onChange={(evt) =>
                setPayload({
                  ...payload,
                  username: evt.target.value,
                })
              }
            />
          </div>
          <div className="inputRegister">
            <label htmlFor="email"></label>
            <input
              className="inputRegister2"
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              required
              onChange={(evt) =>
                setPayload({
                  ...payload,
                  email: evt.target.value,
                })
              }
            />
          </div>
          <div className="inputRegister">
            <label htmlFor="password"></label>
            <input
              className="inputRegister2"
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
              onChange={(evt) =>
                setPayload({
                  ...payload,
                  password: evt.target.value,
                })
              }
            />
          </div>
          <div className="inputRegister">
            <label htmlFor="first_name"></label>
            <input
              className="inputRegister2"
              type="text"
              id="first_name"
              name="first_name"
              placeholder="Name"
              onChange={(evt) =>
                setPayload({
                  ...payload,
                  first_name: evt.target.value,
                })
              }
            />
          </div>
          <div className="inputRegister">
            <label htmlFor="last_name"></label>
            <input
              className="inputRegister2"
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Last Name"
              onChange={(evt) =>
                setPayload({
                  ...payload,
                  last_name: evt.target.value,
                })
              }
            />
          </div>
          <div className="inputRegister">
            <label htmlFor="city"></label>
            <LocationSelect
              locations={locations.map((loc) => loc.name)}
              onLocationSelected={onLocationSelected}
            />
          </div>
          <div className="inputRegister">
            <label htmlFor="profile_img"></label>
            <input
              className="inputRegister2"
              type="url"
              id="profile_img"
              name="profile_img"
              placeholder="Enter an url of your image"
              onChange={(evt) =>
                setPayload({
                  ...payload,
                  profile_img: evt.target.value,
                })
              }
            />
          </div>
          <div className="inputRegister">
            <label htmlFor="bio_summary"></label>
            <input
              className="inputRegister2"
              type="text"
              id="bio_summary"
              name="bio_summary"
              placeholder="Tell us briefly why you here"
              onChange={(evt) =>
                setPayload({
                  ...payload,
                  bio_summary: evt.target.value,
                })
              }
            />
          </div>
          <button className="registerButton">Register</button>
          <p className="pRegister">
            Already Registered?{" "}
            <Link to="/Login" className="registerLink">
              Login
            </Link>
          </p>
        </form>
      </main>
    </>
  );
}
