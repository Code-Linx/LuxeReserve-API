const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../model/guestModel");
const Admin = require("../model/adminModel");
const Receptionist = require("../model/receptionistModel");
const dotenv = require("dotenv");

dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, // Secret key to verify token
};

// Export function that takes passport as a parameter
module.exports = (passport) => {
  // User Strategy
  passport.use(
    "user",
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );

  // Admin Strategy
  passport.use(
    "admin",
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const admin = await Admin.findById(jwt_payload.id);
        if (admin) {
          return done(null, admin);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );

  passport.use(
    "receptionist",
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const receptionist = await Receptionist.findById(jwt_payload.id);
        if (receptionist) {
          return done(null, receptionist);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
};
