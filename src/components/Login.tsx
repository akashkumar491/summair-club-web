import React, { useState } from "react";
import { baseUrl } from "../constants/constant";
import "../App.css";
import Payment from "./Payment";

const Login = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="header">
      {!isLoggedIn ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <h1>Login</h1>
          <div style={{ margin: 20 }}>
            <label>Mobile number: (+91) </label>
            <input
              id="mobileNoInput"
              name="mobileNo"
              style={{ fontSize: 24 }}
            />
          </div>
          {otpSent ? (
            <div style={{ margin: 20 }}>
              <label>OTP </label>
              <input id="otpInput" name="otp" style={{ fontSize: 24 }} />
            </div>
          ) : null}
          <input
            type="submit"
            style={{ margin: 20, padding: 10 }}
            onClick={async () => {
              if (!otpSent) {
                fetch(`${baseUrl}/login`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    mobileNo: (
                      document.getElementById(
                        "mobileNoInput"
                      )! as HTMLInputElement
                    ).value,
                  }),
                });
                setOtpSent(true);
              } else {
                const res = await fetch(`${baseUrl}/verifyuser`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    mobileNo: (
                      document.getElementById(
                        "mobileNoInput"
                      )! as HTMLInputElement
                    ).value,
                    OTPText: parseInt(
                      (document.getElementById("otpInput")! as HTMLInputElement)
                        .value
                    ),
                  }),
                });
                const data = await res.json();
                if (data.data.token) {
                  localStorage.setItem("MemberCode", data.data.memberCode);
                  localStorage.setItem("MemberId", data.data.memberId);
                  localStorage.setItem("Authorization", data.data.token);
                  localStorage.setItem(
                    "lastAuthTimeMillis",
                    String(new Date().getTime())
                  );
                  setIsLoggedIn(true);
                }
              }
            }}
          />
        </div>
      ) : (
        <Payment />
      )}
    </div>
  );
};

export default Login;
