// passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

passport.serializeUser((user, done) => {
  console.log("Serialize使用者。。。");
  console.log(user);
  done(null, user._id); // 將mongodb的id，存入session內部
  // 並且將id簽名後，已Cookie的方式給使用者。。。
});
passport.deserializeUser(async (_id, done) => {
  console.log(
    "Deserializeg使用者。。。使用serializeUser儲存的id，去找到資料庫內惡惡資料"
  );
  let foundUser = await User.findOne({ _id });
  done(null, foundUser);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/redirect", // 注意此處連結
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("進人Google strategy的區域");
      console.log(profile);
      console.log("================");
      let foundUser = await User.findOne({ googleID: profile.id }).exec();
      if (foundUser) {
        console.log("使用者已存在！");
      } else {
        console.log("偵測到新用者。無需存入資料庫！");
        let newUser = new User({
          name: profile.displayName,
          googleID: profile.id,
          thumbnail: profile.photos[0].value,
          email: profile.emails[0].value,
        });
        let saveUser = await newUser.save();
        console.log("create new User success!");
        done(null, saveUser);
      }
    }
  )
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    let foundUser = await User.findOne({ email: username });
    if (foundUser) {
      let result = await bcrypt.compare(password, foundUser.password);
      if (result) {
        done(null, foundUser);
      } else {
        done(null, false);
      }
    } else {
      done(null, false);
    }
  })
);

module.exports = passport;
