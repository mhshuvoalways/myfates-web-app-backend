const Reports = require("../Model/Reports");
const finalAPI = require("../utils/reports/finalAPI");
const igdop = require("../utils/igdop/imageList");
const serverError = require("../utils/serverError");
const User = require("../Model/User");
const moment = require("moment");

const addReports = (req, res) => {
  const { _id, email } = req.user;
  const { firstName, lastName, gender, personality, language } = req.body;
  const userName = `${firstName} ${lastName}`;
  const result = igdop(personality);
  finalAPI(personality, userName, gender, language)
    .then((createRes) => {
      const enObj = {
        entireLife: {
          advice: {
            data: createRes.fullAdvice,
          },
          lifeCycle: {
            data: createRes.fullLifeCycle,
          },
          nature: {
            data: createRes.fullNature,
            image: result.animal,
          },
          overview: {
            data: createRes.fullOverview,
            image: result.nature,
          },
          relationship: {
            data: createRes.fullRelationship,
            image: result.space,
          },
          "strength&Weakness": {
            data: createRes.fullSwot,
            image: result.castle,
          },
        },
        love: {
          idealPartner: {
            data: createRes.loveIdealPartner,
            image: result.animalLove,
          },
          kids: {
            data: createRes.loveKids,
          },
          lifeCycle: {
            data: createRes.loveLifeCycle,
          },
          marriage: {
            data: createRes.loveMarriage,
            image: result.marriage,
          },
          needs: {
            data: createRes.loveNeeds,
          },
          overview: {
            data: createRes.loveOverview,
            image: result.love,
          },
        },
        finance: {
          outlook: {
            data: createRes.financeOutlook,
          },
          outlook2: {
            data: createRes.financeOutlook2,
          },
          overview: {
            data: createRes.financeOverview,
            image: result.money,
          },
          risk: {
            data: createRes.financeRisk,
          },
        },
        "learning&Career": {
          idealCareer: {
            data: createRes.academicIdealCareer,
            image: result.career,
          },
          learning: {
            data: createRes.academicLearning,
          },
          overview: {
            data: createRes.academicOverview,
            image: result.learn,
          },
        },
      };
      const jpObj = {
        全体: {
          アドバイス: {
            data: createRes.fullAdvice,
          },
          ライフサイクル: {
            data: createRes.fullLifeCycle,
          },
          見通し: {
            data: createRes.fullNature,
            image: result.animal,
          },
          概要: {
            data: createRes.fullOverview,
            image: result.nature,
          },
          人間関係: {
            data: createRes.fullRelationship,
            image: result.space,
          },
          強みと弱み: {
            data: createRes.fullSwot,
            image: result.castle,
          },
        },
        恋愛: {
          理想のパートナー: {
            data: createRes.loveIdealPartner,
            image: result.animalLove,
          },
          子供: {
            data: createRes.loveKids,
          },
          ライフサイクル: {
            data: createRes.loveLifeCycle,
          },
          結婚: {
            data: createRes.loveMarriage,
            image: result.marriage,
          },
          ニーズ: {
            data: createRes.loveNeeds,
          },
          見通し: {
            data: createRes.loveOverview,
            image: result.love,
          },
        },
        財務: {
          長期計画: {
            data: createRes.financeLongTerm,
            image: result.money,
          },
          リスク: {
            data: createRes.financeRisk,
          },
          短期計画: {
            data: createRes.financeShortTerm,
          },
          管理: {
            data: createRes.financeManage,
          },
        },
        学習とキャリア: {
          理想の職業: {
            data: createRes.academicIdealCareer,
            image: result.career,
          },
          学び: {
            data: createRes.academicLearning,
          },
          見通し: {
            data: createRes.academicOverview,
            image: result.learn,
          },
        },
      };
      const newObj = {
        userId: _id,
        title: createRes.title,
        date: createRes.date,
        reports: language === "jp" ? jpObj : enObj,
      };
      new Reports(newObj)
        .save()
        .then(() => {
          let today = new Date();
          let expireDate = new Date(today);
          expireDate.setDate(today.getDate() + Number(process.env.EXPIRE_DATE));
          const userObj = {
            "subscriptionPlan.expireDate":
              moment(expireDate).format("YYYY-MM-DD"),
          };
          User.findOneAndUpdate({ email }, userObj, { new: true })
            .then((response) => {
              res.status(200).json(response);
            })
            .catch(() => {
              serverError(res);
            });
        })
        .catch(() => {
          serverError(res);
        });
    })
    .catch(() => {
      serverError(res);
    });
};

const getReports = (req, res) => {
  const { _id } = req.user;
  Reports.find({ userId: _id })
    .then((response) => {
      res.status(200).json(response[response.length - 1]);
    })
    .catch(() => {
      serverError(res);
    });
};

module.exports = {
  addReports,
  getReports,
};
