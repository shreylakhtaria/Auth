import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation Signup($signupInput: SignupInput!) {
    signup(signupInput: $signupInput) {
      token
      user {
        id
        email
        role
        isVerified
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      token
      user {
        id
        email
        role
        isVerified
      }
    }
  }
`;

export const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOtp($verifyOtpInput: VerifyOtpInput!) {
    verifyOtp(verifyOtpInput: $verifyOtpInput) {
      success
      message
    }
  }
`;

export const RESEND_OTP_MUTATION = gql`
  mutation ResendOtp($resendOtpInput: ResendOtpInput!) {
    resendOtp(resendOtpInput: $resendOtpInput)
  }
`;
