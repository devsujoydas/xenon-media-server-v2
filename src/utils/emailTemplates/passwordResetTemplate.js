
const passwordResetTemplate = (resetUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset</title>
  <style>
    /* Tailwind-inspired utility classes for emails (inline-safe) */
    body {
      background-color: #f3f4f6;
      font-family: 'Inter', 'Segoe UI', Tahoma, sans-serif;
      color: #111827;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 480px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    }
    .header {
      background-color: #2563eb;
      color: white;
      text-align: center;
      padding: 24px 20px;
      font-size: 22px;
      font-weight: 600;
    }
    .content {
      padding: 30px 24px;
      text-align: left;
      line-height: 1.6;
    }
    .btn {
      display: inline-block;
      margin-top: 20px;
      background-color: #2563eb;
      color: white !important;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
      font-size: 15px;
      transition: background 0.2s ease;
    }
    .btn:hover {
      background-color: #1d4ed8;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 12px;
      padding: 16px;
      background: #f9fafb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Reset Your Password</div>
    <div class="content">
      <p>Hi there,</p>
      <p>
        We received a request to reset your password. Click the button below to reset it.
        This link is valid for <strong>10 minutes</strong>.
      </p>

      <p style="text-align: center;">
        <a href="${resetUrl}" class="btn">Reset Password</a>
      </p>

      <p>If you didn’t request this, please ignore this email — your password will remain unchanged.</p>
      <p>Best regards,<br><strong>The Support Team</strong></p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Xenon Media. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

module.exports = passwordResetTemplate;
