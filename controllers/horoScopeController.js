const HoroScope = require("../Model/HoroScope");
const getSentencemain = require("../utils/horoscope/2024api");
const getSentencelove = require("../utils/horoscope/2024love");
const getSentencefinance = require("../utils/horoscope/2024finance");
const getSentenceJp = require("../utils/horoscope/2024jp/2024jp");

const addHoro = (req, res) => {
  const { _id } = req.user;
  const { fullName, birthDateMM, birthDateDD, birthDateYYYY, type, language } =
    req.body;
  let horoscope;
  if (language === "jp") {
    horoscope = getSentenceJp(
      birthDateYYYY,
      birthDateMM,
      birthDateDD,
      fullName
    );
  } else {
    if (type === "2024") {
      horoscope = getSentencemain(birthDateYYYY, birthDateMM, birthDateDD);
    } else if (type === "2024love") {
      horoscope = getSentencelove(birthDateYYYY, birthDateMM, birthDateDD);
    } else if (type === "2024finance") {
      horoscope = getSentencefinance(birthDateYYYY, birthDateMM, birthDateDD);
    }
  }
  const newObj = {
    userId: _id,
    horoscope: horoscope,
  };
  new HoroScope(newObj)
    .save()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch(() => {
      serverError(res);
    });
};

const getHoro = (req, res) => {
  const { _id } = req.user;
  HoroScope.find({ userId: _id })
    .then((response) => {
      res.status(200).json(response[response.length - 1]);
    })
    .catch(() => {
      serverError(res);
    });
};

module.exports = {
  addHoro,
  getHoro,
};
