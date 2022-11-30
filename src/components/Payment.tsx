import React from "react";
import useRazorpay from "react-razorpay";
import jwt_decode from "jwt-decode";

const Payment = () => {
  const Razorpay = useRazorpay();

  let name = "",
    mobileNo = "",
    email = "";

  let tokenData = { FullName: "", MobileNo: "", Email: "" };

  const token = localStorage.getItem("Authorization");

  if (token) {
    tokenData = jwt_decode(token);
    name = tokenData.FullName;
    mobileNo = tokenData.MobileNo;
    email = tokenData.Email;
  }

  console.log(name, "4545");

  const handlePayment = async () => {
    // need to Create order on your backend

    const options = {
      currency: "INR",
      key: "rzp_test_fKoeUgEMBkJbUF",
      amount: "5000",
      name: "Summair Club",
      order_id: "order_KmGpjqjR0Gmjbj", //Replace this with an order_id created using Orders API.
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
    <div className="container">
      <button className="btn" onClick={handlePayment}>
        Click To Pay
      </button>
    </div>
  );
};

export default Payment;
