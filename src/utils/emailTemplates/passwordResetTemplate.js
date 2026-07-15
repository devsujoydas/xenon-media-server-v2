const passwordResetTemplate = (name, resetLink) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Reset your password</title>

    <style>
      body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        background: #f3f6fb;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }

      table {
        border-spacing: 0;
        border-collapse: collapse;
      }

      td {
        padding: 0;
      }

      img {
        border: 0;
        display: block;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }

      a {
        text-decoration: none;
      }

      @media screen and (max-width: 600px) {
        .wrapper {
          width: 100% !important;
        }

        .mobile-padding {
          padding-left: 24px !important;
          padding-right: 24px !important;
        }

        .hero-title {
          font-size: 34px !important;
          line-height: 42px !important;
        }

        .hero-text {
          font-size: 16px !important;
          line-height: 28px !important;
        }

        .button {
          display: block !important;
          width: 100% !important;
          text-align: center !important;
          box-sizing: border-box;
        }

        .logo-text {
          font-size: 26px !important;
        }
      }
    </style>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background: #f3f6fb;
      font-family:
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        &quot;Segoe UI&quot;,
        Roboto,
        Oxygen,
        Ubuntu,
        Cantarell,
        &quot;Open Sans&quot;,
        &quot;Helvetica Neue&quot;,
        sans-serif;
    "
  >
    <center style="width: 100%; background: #f3f6fb; padding: 30px 15px">
      <table
        role="presentation"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="max-width: 620px"
        class="wrapper"
      >
        <tr>
          <td
            style="
              background: #ffffff;
              border-radius: 22px;
              overflow: hidden;
              box-shadow: 0 15px 45px rgba(15, 23, 42, 0.08);
              border: 1px solid #e5e7eb;
            "
          >
            <!-- Header -->

            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
            >
              <tr>
                <td
                  style="
                    background: linear-gradient(135deg, #2563eb, #1d4ed8);
                    padding: 38px 40px;
                  "
                  class="mobile-padding"
                >
                  <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                  >
                    <tr>
                      <td align="left">
                        <table
                          role="presentation"
                          cellpadding="0"
                          cellspacing="0"
                        >
                          <tr>
                            <td valign="middle">
                              <img
                                src="https://res.cloudinary.com/dpdsgroa7/image/upload/v1784054421/xenly_logo_zsze73.png"
                                alt="Xenly"
                                width="46"
                                style="
                                  display: block;
                                  border: 0;
                                  outline: none;
                                  text-decoration: none;
                                "
                              />
                            </td>

                            <td width="12"></td>

                            <td valign="middle">
                              <span
                                class="logo-text"
                                style="
                                  font-size: 30px;
                                  font-weight: 800;
                                  color: #ffffff;
                                  letter-spacing: -0.5px;
                                  font-family:
                                    system-ui,
                                    -apple-system,
                                    BlinkMacSystemFont,
                                    &quot;Segoe UI&quot;,
                                    Roboto,
                                    Oxygen,
                                    Ubuntu,
                                    Cantarell,
                                    &quot;Open Sans&quot;,
                                    &quot;Helvetica Neue&quot;,
                                    sans-serif;
                                "
                              >
                                Xenly
                              </span>
                            </td>
                          </tr>
                        </table>
                      </td>

                      <td align="right">
                        <table
                          role="presentation"
                          cellpadding="0"
                          cellspacing="0"
                        >
                          <tr>
                            <td
                              style="
                                background: rgba(255, 255, 255, 0.18);
                                padding: 10px 18px;
                                border-radius: 999px;
                                font-size: 13px;
                                font-weight: 700;
                                color: #ffffff;
                                font-family:
                                  system-ui,
                                  -apple-system,
                                  BlinkMacSystemFont,
                                  &quot;Segoe UI&quot;,
                                  Roboto,
                                  Oxygen,
                                  Ubuntu,
                                  Cantarell,
                                  &quot;Open Sans&quot;,
                                  &quot;Helvetica Neue&quot;,
                                  sans-serif;
                              "
                            >
                              🔒 Security
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

       

              <tr>
                <td style="padding: 50px 48px 0" class="mobile-padding">
                  <p
                    style="
                      margin: 0;
                      font-size: 15px;
                      font-weight: 700;
                      color: #2563eb;
                      letter-spacing: 1px;
                      text-transform: uppercase;
                      font-family:
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        &quot;Segoe UI&quot;,
                        Roboto,
                        Oxygen,
                        Ubuntu,
                        Cantarell,
                        &quot;Open Sans&quot;,
                        &quot;Helvetica Neue&quot;,
                        sans-serif;
                    "
                  >
                    PASSWORD RESET
                  </p>

                  <h1
                    class="hero-title"
                    style="
                      margin: 18px 0 20px;
                      font-size: 46px;
                      line-height: 54px;
                      font-weight: 800;
                      color: #0f172a;
                      letter-spacing: -1.6px;
                      font-family:
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        &quot;Segoe UI&quot;,
                        Roboto,
                        Oxygen,
                        Ubuntu,
                        Cantarell,
                        &quot;Open Sans&quot;,
                        &quot;Helvetica Neue&quot;,
                        sans-serif;
                    "
                  >
                    Reset your password
                  </h1>

                  <p
                    class="hero-text"
                    style="
                      margin: 0;
                      font-size: 17px;
                      line-height: 32px;
                      color: #475569;
                      font-family:
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        &quot;Segoe UI&quot;,
                        Roboto,
                        Oxygen,
                        Ubuntu,
                        Cantarell,
                        &quot;Open Sans&quot;,
                        &quot;Helvetica Neue&quot;,
                        sans-serif;
                    "
                  >
                    Hello
                    <strong style="color: #2563eb">${name}</strong>,
                  </p>

                  <p
                    class="hero-text"
                    style="
                      margin: 22px 0 0;
                      font-size: 17px;
                      line-height: 32px;
                      color: #475569;
                      font-family:
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        &quot;Segoe UI&quot;,
                        Roboto,
                        Oxygen,
                        Ubuntu,
                        Cantarell,
                        &quot;Open Sans&quot;,
                        &quot;Helvetica Neue&quot;,
                        sans-serif;
                    "
                  >
                    We received a request to reset the password for your
                    <strong style="color: #0f172a">Xenly</strong>
                    account. If this was you, click the secure button below to
                    create a brand new password and regain access to your
                    account.
                  </p>
                </td>
              </tr>

              <tr>
                <td
                  align="center"
                  style="padding: 42px 48px 18px"
                  class="mobile-padding"
                >
                  <a
                    href="${resetLink}"
                    target="_blank"
                    class="button"
                    style="
                      background: #2563eb;
                      color: #ffffff;
                      display: inline-block;
                      padding: 18px 42px;
                      font-size: 17px;
                      font-weight: 700;
                      font-family:
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        &quot;Segoe UI&quot;,
                        Roboto,
                        Oxygen,
                        Ubuntu,
                        Cantarell,
                        &quot;Open Sans&quot;,
                        &quot;Helvetica Neue&quot;,
                        sans-serif;
                      border-radius: 12px;
                      border: 1px solid #2563eb;
                      text-decoration: none;
                      box-shadow: 0 10px 24px rgba(37, 99, 235, 0.28);
                    "
                  >
                    Reset Password
                  </a>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 48px" class="mobile-padding">
                  <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      background: #eff6ff;
                      border: 1px solid #bfdbfe;
                      border-radius: 14px;
                    "
                  >
                    <tr>
                      <td
                        style="
                          padding: 18px 20px;
                          font-family:
                            system-ui,
                            -apple-system,
                            BlinkMacSystemFont,
                            &quot;Segoe UI&quot;,
                            Roboto,
                            Oxygen,
                            Ubuntu,
                            Cantarell,
                            &quot;Open Sans&quot;,
                            &quot;Helvetica Neue&quot;,
                            sans-serif;
                          font-size: 15px;
                          line-height: 28px;
                          color: #1e3a8a;
                        "
                      >
                        ⏰
                        <strong>
                          This secure link will expire in 10 minutes.
                        </strong>

                        For your security, you'll need to request a new password
                        reset link after it expires.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding: 36px 48px 0" class="mobile-padding">
                  <h2
                    style="
                      margin: 0 0 18px;
                      font-size: 22px;
                      font-weight: 700;
                      color: #0f172a;
                      font-family:
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        &quot;Segoe UI&quot;,
                        Roboto,
                        Oxygen,
                        Ubuntu,
                        Cantarell,
                        &quot;Open Sans&quot;,
                        &quot;Helvetica Neue&quot;,
                        sans-serif;
                    "
                  >
                    Keep your account secure
                  </h2>

                  <p
                    style="
                      margin: 0;
                      font-size: 16px;
                      line-height: 30px;
                      color: #475569;
                      font-family:
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        &quot;Segoe UI&quot;,
                        Roboto,
                        Oxygen,
                        Ubuntu,
                        Cantarell,
                        &quot;Open Sans&quot;,
                        &quot;Helvetica Neue&quot;,
                        sans-serif;
                    "
                  >
                    For your protection, this password reset link is unique and
                    can only be used once. After successfully changing your
                    password, the link will automatically become invalid.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 28px 48px 0" class="mobile-padding">
                  <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      background: #fff7ed;
                      border: 1px solid #fdba74;
                      border-radius: 14px;
                    "
                  >
                    <tr>
                      <td
                        style="
                          padding: 22px;
                          font-family:
                            system-ui,
                            -apple-system,
                            BlinkMacSystemFont,
                            &quot;Segoe UI&quot;,
                            Roboto,
                            Oxygen,
                            Ubuntu,
                            Cantarell,
                            &quot;Open Sans&quot;,
                            &quot;Helvetica Neue&quot;,
                            sans-serif;
                          font-size: 15px;
                          line-height: 28px;
                          color: #9a3412;
                        "
                      >
                        <strong style="font-size: 16px">
                          ⚠ Didn't request this?
                        </strong>

                        <br /><br />

                        If you didn't request a password reset, you can safely
                        ignore this email. Your password will remain unchanged
                        and no further action is required. If you think someone
                        is trying to access your account, we recommend changing
                        your password immediately after logging in.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 48px 0" class="mobile-padding">
                  <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      background: #f8fafc;
                      border: 1px solid #e2e8f0;
                      border-radius: 14px;
                    "
                  >
                    <tr>
                      <td
                        style="
                          padding: 22px;
                          font-family:
                            system-ui,
                            -apple-system,
                            BlinkMacSystemFont,
                            &quot;Segoe UI&quot;,
                            Roboto,
                            Oxygen,
                            Ubuntu,
                            Cantarell,
                            &quot;Open Sans&quot;,
                            &quot;Helvetica Neue&quot;,
                            sans-serif;
                        "
                      >
                        <p
                          style="
                            margin: 0;
                            font-size: 15px;
                            font-weight: 700;
                            color: #0f172a;
                          "
                        >
                          Having trouble with the button?
                        </p>

                        <p
                          style="
                            margin: 14px 0 0;
                            font-size: 15px;
                            line-height: 28px;
                            color: #64748b;
                          "
                        >
                          Copy and paste the following link into your browser.
                        </p>

                        <p
                          style="
                            margin: 18px 0 0;
                            font-size: 14px;
                            line-height: 26px;
                            color: #2563eb;
                            word-break: break-all;
                          "
                        >
                          ${resetLink}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding: 42px 48px" class="mobile-padding">
                  <hr
                    style="
                      margin: 0;
                      border: none;
                      border-top: 1px solid #e5e7eb;
                    "
                  />
                </td>
              </tr>

              <tr>
                <td style="padding: 0 48px 40px" class="mobile-padding">
                  <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      background: #fafafa;
                      border: 1px solid #e5e7eb;
                      border-radius: 16px;
                    "
                  >
                    <tr>
                      <td style="padding: 28px">
                        <table
                          role="presentation"
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                        >
                          <tr>
                            <td width="60" valign="top">
                              <img
                                src="https://res.cloudinary.com/dpdsgroa7/image/upload/v1784054421/xenly_logo_zsze73.png"
                                alt="Xenly"
                                width="46"
                                style="
                                  display: block;
                                  border: 0;
                                  outline: none;
                                  text-decoration: none;
                                "
                              />
                            </td>

                            <td valign="top">
                              <h3
                                style="
                                  margin: 0;
                                  font-size: 20px;
                                  color: #0f172a;
                                  font-weight: 700;
                                  font-family:
                                    system-ui,
                                    -apple-system,
                                    BlinkMacSystemFont,
                                    &quot;Segoe UI&quot;,
                                    Roboto,
                                    Oxygen,
                                    Ubuntu,
                                    Cantarell,
                                    &quot;Open Sans&quot;,
                                    &quot;Helvetica Neue&quot;,
                                    sans-serif;
                                "
                              >
                                Xenly
                              </h3>

                              <p
                                style="
                                  margin: 10px 0 0;
                                  font-size: 14px;
                                  line-height: 25px;
                                  color: #64748b;
                                  font-family:
                                    system-ui,
                                    -apple-system,
                                    BlinkMacSystemFont,
                                    &quot;Segoe UI&quot;,
                                    Roboto,
                                    Oxygen,
                                    Ubuntu,
                                    Cantarell,
                                    &quot;Open Sans&quot;,
                                    &quot;Helvetica Neue&quot;,
                                    sans-serif;
                                "
                              >
                                Securely connect, share and stay protected.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 48px 20px" class="mobile-padding">
                  <p
                    style="
                      margin: 0;
                      font-size: 14px;
                      line-height: 26px;
                      color: #64748b;
                      text-align: center;
                      font-family:
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        &quot;Segoe UI&quot;,
                        Roboto,
                        Oxygen,
                        Ubuntu,
                        Cantarell,
                        &quot;Open Sans&quot;,
                        &quot;Helvetica Neue&quot;,
                        sans-serif;
                    "
                  >
                    This is an automated security email from
                    <strong style="color: #0f172a">Xenly</strong>. Please do not
                    reply to this message.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 48px 40px" class="mobile-padding">
                  <p
                    style="
                      margin: 0;
                      font-size: 13px;
                      line-height: 24px;
                      text-align: center;
                      color: #94a3b8;
                      font-family:
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        &quot;Segoe UI&quot;,
                        Roboto,
                        Oxygen,
                        Ubuntu,
                        Cantarell,
                        &quot;Open Sans&quot;,
                        &quot;Helvetica Neue&quot;,
                        sans-serif;
                    "
                  >
                    © ${new Date().getFullYear()} Xenly. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>


`;

module.exports = passwordResetTemplate;
