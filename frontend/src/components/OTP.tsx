import { MuiOtpInput } from "mui-one-time-password-input";

type args = {
  otp: string;
  changeOtp: (otp: string) => void;
};

const OTP = ({ otp, changeOtp }: args) => {
  const matchIsString = (text: string) => {
    return typeof text === "string" && text.trim();
  };

  function matchIsNumeric(text: string) {
    const isNumber = typeof text === "number";
    const isString = matchIsString(text);
    return (isNumber || (isString && text !== "")) && !isNaN(Number(text));
  }

  const validateChar = (value: string) => {
    return matchIsNumeric(value);
  };
  const handleChange = (newValue: string) => {
    changeOtp(newValue);
  };

  return (
    <MuiOtpInput
      value={otp}
      onChange={handleChange}
      length={6}
      validateChar={validateChar}
    />
  );
};

export default OTP;
