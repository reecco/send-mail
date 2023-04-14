import nodemailer from "nodemailer";

import { Mail } from "../@types";
import env from "./environment";
import SendEmailError from "../errors/SendEmailError";

export const sendToken = async ({ title, toEmail, name, text }: Mail): Promise<void> => {
  const tranporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: env.USER,
      pass: env.PASSWORD,
    }
  });

  try {
    await tranporter.sendMail({
      from: `Do not answer. Automatic email. <${env.USER}>`,
      to: toEmail,
      subject: `${title} ${name}`,
      html: text
    });
  } catch (error: any) {
    throw new SendEmailError("An error occurred while sending the email: " + error.message);
  }
}

export const sendEmail = async ({ name, text, toEmail, fromEmail }: Mail): Promise<void> => {
  const tranporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: env.USER,
      pass: env.PASSWORD,
    }
  });

  try {
    await tranporter.sendMail({
      from: `Do not answer. Automatic email. <${env.USER}>`,
      to: toEmail,
      subject: `${name} - ${fromEmail}`,
      text: text
    });
  } catch (error: any) {
    throw new SendEmailError("An error occurred while sending the email: " + error.message);
  }
}

export const changeEmail = (email: string): string => {
  return email;
}

export const templateRegister = (url: string): string => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      * {
        font-family: sans-serif;
      }
  
      body {
        height: 100vh;
        width: 100vw;
      }

      p {
        font-size: 1.2rem;
      }
  
      .btn {
        text-decoration: none;
        background-color: rgb(13,110,253);
        padding: 5px 20px;
        color: #000;
        border-radius: 10px;
        font-size: 1.2rem;
      }
  
      .btn:hover {
        background-color: rgb(16, 98, 222);
      }
    </style>
  </head>
  <body>
    <p>Click the button below to validate your registration.</p>
    <div>
      <a class="btn" href="${url}">Complete registration</a>
    </div>
    <p>If the button does not appear, click on the link below.</p>
    <div>
      <a href="${url}">${url}</a>
    </div>
  </body>
  </html>`;
}

export const templateRecover = (url: string): string => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      * {
        font-family: sans-serif;
      }
  
      body {
        height: 100vh;
        width: 100vw;
      }

      p {
        font-size: 1.2rem;
      }
  
      .btn {
        text-decoration: none;
        background-color: rgb(13,110,253);
        padding: 5px 20px;
        color: #000;
        border-radius: 10px;
        font-size: 1.2rem;
      }
  
      .btn:hover {
        background-color: rgb(16, 98, 222);
      }
    </style>
  </head>
  <body>
    <p>Click the button below to create a new password.</p>
    <div>
      <a class="btn" href="${url}">Create new password</a>
    </div>
    <p>If the button does not appear, click on the link below.</p>
    <div>
      <a href="${url}">${url}</a>
    </div>
  </body>
  </html>`;
}