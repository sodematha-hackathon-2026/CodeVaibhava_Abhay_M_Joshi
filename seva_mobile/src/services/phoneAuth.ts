import auth from "@react-native-firebase/auth";
import { OTP_MODE } from "../config/appMode";

const TEST_NUMBERS = [
  "+919999999999",
  "+918888888888",
];

export async function sendOtp(phone: string) {
  if (OTP_MODE === "demo") {
        if (!TEST_NUMBERS.includes(phone)) {
      throw new Error("Demo mode: use test number");
    }
  }

  const confirmation = await auth().signInWithPhoneNumber(phone);
  return confirmation;
}

export async function confirmOtp(
  confirmation: any,
  code: string
) {
  return confirmation.confirm(code);
}
