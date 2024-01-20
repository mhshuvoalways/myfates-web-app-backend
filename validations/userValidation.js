const axios = require("axios");

const userRegisterValidation = (value) => {
  const error = {};
  if (!value.email) {
    error.email = "Please provide your email";
  }
  if (!value.password) {
    error.password = "Please provide your password";
  } else if (value.password.length < 6) {
    error.password = "Please provide minimum 6 character";
  } else if (value.password.length > 20) {
    error.password = "Please provide maximum 20 character";
  }
  if (!value.recaptcha) {
    error.recaptcha = "Please fill up recaptcha";
  } else {
    axios
      .get(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_SECRET_KEY}&response=${value.recaptch}`
      )
      .then((response) => {
        if (response.data.success) {
          error.recaptcha = null;
        } else {
          error.recaptcha = "Invalid recaptcha";
        }
      })
      .catch(() => {
        error.recaptcha = "Invalid recaptcha";
      });
  }
  let isValid = Object.keys(error).length === 0;
  return {
    error,
    isValid,
  };
};

const loginValidation = (value) => {
  const error = {};
  if (!value.email) {
    error.email = "Please provide your email";
  }
  if (!value.password) {
    error.password = "Please provide your password";
  } else if (value.password.length < 6) {
    error.password = "Please provide minimum 6 character";
  } else if (value.password.length > 20) {
    error.password = "Please provide maximum 20 character";
  }
  let isValid = Object.keys(error).length === 0;
  return {
    error,
    isValid,
  };
};

const findMailValidation = (value) => {
  const error = {};
  if (!value) {
    error.email = "Please provide your email";
  }
  let isValid = Object.keys(error).length === 0;
  return {
    error,
    isValid,
  };
};

const recoverPassValidation = (value) => {
  const error = {};
  if (!value) {
    error.password = "Please provide your password";
  } else if (value.length < 6) {
    error.password = "Please provide minimum 6 character";
  } else if (value.length > 20) {
    error.password = "Please provide maximum 20 character";
  }
  let isValid = Object.keys(error).length === 0;
  return {
    error,
    isValid,
  };
};

module.exports = {
  userRegisterValidation,
  loginValidation,
  findMailValidation,
  recoverPassValidation,
};
