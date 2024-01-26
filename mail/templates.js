const FRONTEND_URL = process.env.CLIENT_PANEL_FRONTEND_URL;

const recoverPass = (token) => {
  return `<div style="background-color: #efefef; padding: 30px">
  <h2>Hello there,</h2>
  <p>
    Forgot your password? Click the button and change your
    password.
  </p>
  <button style="background-color: green; padding:10px; border:none; margin-top:10px;">
      <a style="color: white; text-decoration: none" href=${FRONTEND_URL}/recover_password?token=${token} >Change password</a>
  </button>
</div>`;
};

module.exports = {
  recoverPass,
};
