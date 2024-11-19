import React, { useRef, useState } from "react";
import styles from "./InputsCodes.module.css";

export default function InputsCodes({ onChange, value, handleSubmit }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleInputChange = (index, e) => {
    const digit = e.target.value;

    if (/^\d$/.test(digit)) {
      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);

      if (index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      } else if (index === otp.length - 1) {
        const otpValue = newOtp.join("");
        onChange({
          target: {
            name: "code",
            value: otpValue,
          },
        });
        handleSubmit(); 
      }
    } else if (digit === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  React.useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className={styles.container}>
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          value={otp[index]}
          onChange={(e) => handleInputChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          maxLength={1}
          className={styles.otpInput}
          ref={(el) => (inputRefs.current[index] = el)}
        />
      ))}
    </div>
  );
}
