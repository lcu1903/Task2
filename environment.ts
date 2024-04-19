export const environment = {
  production: false,
  loginApiUrl: "https://localhost:7204/api/authentications/login",
  login2FaApiUrl: "https://localhost:7204/api/authentications/login-2fa",
  getAllUsersApiUrl: "https://localhost:7204/api/admins/get-all-user",
  signUpApiUrl: "https://localhost:7204/api/authentications/register",
  signOutApiUrl: "https://localhost:7204/api/authentications/logout",
  refreshTokenApiUrl:
    "https://localhost:7204/api/authentications/refresh-token",
  refreshAccessTokenApiUrl:
    "https://localhost:7204/api/authentications/refresh-access-token",
  getUserByIdApiUrl: (id: string) =>
    `https://localhost:7204/api/admins/get-user/${id}`,
  changePasswordApiUrl: (id: string) =>
    `https://localhost:7204/api/users/${id}/change-password`,
  forgotPasswordApiUrl:
    "https://localhost:7204/api/authentications/forgot-password",
  resetPasswordApiUrl:
    "https://localhost:7204/api/authentications/reset-password",
  updateUserApiUrl: (id: string) =>
    `https://localhost:7204/api/users/${id}/update-information`,
  changeMyProfileApiUrl: (id: string) =>
    `https://localhost:7204/api/users/${id}/update-information`,
  checkUserOrEmailExistApiUrl: "https://localhost:7204/api/users/check-exist",
};
