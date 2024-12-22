/* eslint-disable no-undef */

const nodemailer = require("nodemailer");
const pug = require("pug");
const { convert } = require("html-to-text");

class Email {
  constructor(user, url) {
    // Accept loginDetails here
    this.to = user.email || user.hotelEmail;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.phoneNumber = user.phoneNumber;
    this.tempPassword = user.tempPassword;
    this.newTransport;
    this.from = `LuxeReserve-Admin <${process.env.EMAIL_FROM}>`;
    this.url = url;
    this.hotelName = user.hotelName;
    this.hotelEmail = user.hotelEmail;
    this.address = user.address;
    this.contactNumber = user.contactNumber;
    this.description = user.description;
    this.website = user.website;
    this.amenities = user.amenities;
    this.maxOccupancy = user.maxOccupancy;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({});
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject, data = {}) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      first_name: this.first_name,
      last_name: this.last_name,
      tempPassword: this.tempPassword,
      url: this.url,
      hotelName: this.hotelName,
      hotelEmail: this.hotelEmail,
      contactNumber: this.contactNumber,
      address: this.address,
      description: this.description,
      website: this.website,
      amenities: this.amenities,
      maxOccupancy: this.maxOccupancy,
      subject,
      ...data, // Spread the additional data into the template variables
    });

    // 2) Define Email Options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  // Send OTP email
  async sendEmailVerification() {
    await this.send("emailVerification", "Your LuxeReserve OTP");
  }
  async sendVerificationSuccess() {
    await this.send("verificationSuccess", "Email Verification Successful!");
  }

  // Send password reset code email
  async sendPasswordReset() {
    await this.send("sendResetCode", "Your Password Reset Code");
  }

  // Function to send a receptionist welcome email
  async sendReceptionistWelcome() {
    await this.send("receptionistWelcome", "Welcome to LuxeServe");
  }

  async sendHotelAdded(newHotel) {
    await this.send("hotelAdded", "New Hotel Added to LuxeReserve");
  }
}

module.exports = Email;
