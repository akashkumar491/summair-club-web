import React, { useState } from "react";
import useRazorpay from "react-razorpay";
import jwt_decode from "jwt-decode";
import { baseUrl } from "../constants/constant";

const Payment = () => {
  const Razorpay = useRazorpay();

  const [amount, setAmount] = useState("");

  let name = "",
    mobileNo = "",
    email = "",
    memberCode = "",
    memberId = "";

  let tokenData = {
    FullName: "",
    MobileNo: "",
    Email: "",
    ID: "",
    MemberCode: "",
  };

  const token = localStorage.getItem("Authorization");

  if (token) {
    tokenData = jwt_decode(token);
    name = tokenData.FullName;
    mobileNo = tokenData.MobileNo;
    email = tokenData.Email;
    memberCode = tokenData.MemberCode;
    memberId = tokenData.ID;
  }

  const handlePayment = async () => {
    const res = await fetch(`${baseUrl}/razorpay_order_create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        MemberCode: memberCode,
        MemberId: memberId,
      },
      body: JSON.stringify({ amount: amount, orderCreator: "web" }),
    });

    console.log(res, "4545");

    // ***** need to modify above used api at backend for order create***//

    const options = {
      currency: "INR",
      key: "rzp_test_fKoeUgEMBkJbUF",
      amount: "5000",
      name: "Summair Club",
      order_id: "order_KmepjDBG096THn", //Replace this with an order_id created using Orders API.
      prefill: {
        email: email,
        contact: mobileNo,
        name: name,
      },
      handler: function (response: any) {
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);
      },
    };

    const rzp1 = new Razorpay(options);

    rzp1.on("payment.failed", function (response: any) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });

    rzp1.open();
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>PAYMENT</h1>

      <div className="container">
        <div className="input-box">
          <label style={{ fontSize: 20, paddingRight: 10 }}>Enter Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            style={{ fontSize: 20 }}
          />
        </div>
        <button className="button" onClick={handlePayment}>
          Click To Pay
        </button>
      </div>
    </>
  );
};

export default Payment;
