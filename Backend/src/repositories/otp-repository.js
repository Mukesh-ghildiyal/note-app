const { OTP } = require('../models');

const create = async (data) => {
  return await OTP.create(data);
};

const findValidOTP = async (email, otp) => {
  return await OTP.findOne({
    email,
    otp,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  });
};

const markAsUsed = async (otpId) => {
  return await OTP.findByIdAndUpdate(otpId, { isUsed: true });
};

module.exports = {
  create,
  findValidOTP,
  markAsUsed
}; 