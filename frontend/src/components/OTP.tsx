import { MuiOtpInput } from "mui-one-time-password-input";

type Args = {
  otp: string;
  changeOtp: (otp: string) => void;
};

const OTP = ({ otp, changeOtp }: Args) => {
  const validateChar = (character: string): boolean => /^\d$/.test(character);

  return (
    <MuiOtpInput
      value={otp}
      onChange={changeOtp}
      length={6}
      validateChar={validateChar}
    />
  );
};

export default OTP;
