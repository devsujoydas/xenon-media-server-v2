const passwordResetTemplate = (name, resetLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Your Password</title>
</head>

<body style="margin:0;padding:32px;background:#f5f5f5;font-family:Segoe UI,Arial,sans-serif;color:#202124;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="500" cellpadding="0" cellspacing="0"
style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">

<tr>
<td style="padding:32px 32px 20px;">

<h2 style="margin:0;font-size:26px;font-weight:700;color:#111827;">
Xenly
</h2>

</td>
</tr>

<tr>
<td style="padding:0 32px 32px;">

<h1 style="margin:0 0 18px;font-size:28px;font-weight:600;color:#111827;">
Reset your password
</h1>

<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#4b5563;">
Hi <strong>${name}</strong>,
</p>

<p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#4b5563;">
We received a request to reset the password for your Xenly account.
If you made this request, click the button below to create a new password.
</p>

<div style="margin:32px 0;">

<a
href="${resetLink}"
style="
background:#0f6cbd;
color:#ffffff;
text-decoration:none;
padding:14px 24px;
border-radius:6px;
font-size:15px;
font-weight:600;
display:inline-block;
">
Reset Password
</a>

</div>

<p style="margin:0 0 16px;font-size:14px;color:#6b7280;line-height:1.7;">
This link will expire in <strong>10 minutes</strong>.
</p>

<p style="margin:0 0 18px;font-size:14px;color:#6b7280;line-height:1.7;">
If you didn't request this password reset, you can safely ignore this email.
Your password won't change unless you use the link above.
</p>

<hr style="border:none;border-top:1px solid #ececec;margin:30px 0;">

<p style="margin:0;font-size:13px;color:#6b7280;">
If the button doesn't work, copy and paste the following URL into your browser:
</p>

<p style="
margin-top:12px;
font-size:13px;
word-break:break-all;
color:#0f6cbd;
">
${resetLink}
</p>

</td>
</tr>

<tr>
<td style="padding:20px 32px;border-top:1px solid #ececec;">

<p style="margin:0;font-size:13px;color:#9ca3af;">
© ${new Date().getFullYear()} Xenly. All rights reserved.
</p>

<p style="margin-top:10px;font-size:12px;color:#9ca3af;">
This is an automated security email. Please do not reply.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

module.exports = passwordResetTemplate;