const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:40px 0;">
  <tr>
    <td align="center">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

        <!-- Header -->
        <tr>
          <td align="center" style="background:#0040A1;padding:32px;">

          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding:40px 36px;color:#333333;">

            <h1 style="margin:0 0 20px;font-size:28px;color:#0040A1;">
              Verify Your Email
            </h1>

            <p style="margin:0 0 20px;font-size:16px;line-height:1.7;">
              Hello, {{firstname}} {{lastname}}
            </p>

            <p style="margin:0 0 30px;font-size:16px;line-height:1.7;">
              Use the verification code below to complete your sign-in or confirm your email address.
              This code will expire in <strong>15 minutes</strong>.
            </p>

            <!-- OTP -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">

                  <div style="
                    display:inline-block;
                    padding:18px 36px;
                    background:#F2F7FF;
                    border:2px dashed #0040A1;
                    border-radius:10px;
                    font-size:36px;
                    font-weight:bold;
                    font-family:'Courier New', monospace;
                    color:#0040A1;
                    letter-spacing:10px;">
                    {{OTP}}
                  </div>

                </td>
              </tr>
            </table>

            <p style="margin:35px 0 0;font-size:15px;line-height:1.7;color:#555555;">
              If you didn't request this verification code, you can safely ignore this email. Your account will remain secure.
            </p>

            <p style="margin:30px 0 0;font-size:15px;line-height:1.7;color:#555555;">
              Thanks,<br>
              <strong>Your Company</strong>
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px;background:#F8F9FC;border-top:1px solid #E5E7EB;text-align:center;">

            <p style="margin:0;font-size:13px;color:#777777;">
              This is an automated message. Please do not reply to this email.
            </p>

            <p style="margin:10px 0 0;font-size:13px;color:#999999;">
              &copy; ${new Date().getFullYear()} SwiftShop. All rights reserved.
            </p>

          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>`;

export default html;
