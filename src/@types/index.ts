export interface Mail {
  fromEmail?: string,
  title?: string,
  toEmail: string,
  name: string,
  text: string
}

export interface User {
  email: string,
  password: string,
  id: string,
  name: string
}

export interface ResponseMail {
  code: number,
  message: string,
  error: Error
};

export interface Register {
  email?: string,
  name?: string,
  password?: string,
  country?: string
}

export interface RequestToken {
  email: string,
  name: string,
  iat: number,
  exp: number
}

export interface Connection {
  value: string
}