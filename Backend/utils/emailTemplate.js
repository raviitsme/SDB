exports.welcomeEmail = (full_name, role, user_id) => {
    return `
    <div style="
        max-width: 600px;
        margin: 0 auto;
        font-family: 'Ubuntu', Arial, sans-serif;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        overflow: hidden;
    ">

        <!-- Header -->
        <div style="
            background: linear-gradient(135deg, #6a5af9, #00d4ff);
            padding: 20px;
            color: #ffffff;
            text-align: center;
        ">
            <h2 style="margin: 0; font-weight: 600;">
                Welcome to School Management System
            </h2>
        </div>

        <!-- Body -->
        <div style="padding: 24px; color: #333333; font-size: 14px; line-height: 1.6;">
            <p>Dear <strong>${full_name}</strong>,</p>

            <p>
                We are pleased to inform you that your account has been
                successfully created in the <strong>School Management System</strong>.
            </p>

            <table style="margin: 16px 0; font-size: 14px;">
                <tr>
                    <td style="padding: 4px 10px 4px 0;"><strong>Role:</strong></td>
                    <td>${role}</td>
                </tr>
                <tr>
                    <td style="padding: 4px 10px 4px 0;"><strong>User ID:</strong></td>
                    <td>${user_id}</td>
                </tr>
            </table>

            <p>
                Please keep your User ID confidential and use it for future
                login and communication.
            </p>

            <p>
                If you face any issues or have questions, feel free to contact
                the system administrator.
            </p>

            <p style="margin-top: 24px;">
                Best regards,<br>
                <strong>School Management System Team</strong>
            </p>
        </div>

        <!-- Footer -->
        <div style="
            background: #f5f7fa;
            padding: 12px;
            text-align: center;
            font-size: 12px;
            color: #777777;
        ">
            © ${new Date().getFullYear()} School Management System. All rights reserved.
        </div>

    </div>
    `;
};


exports.forgotPasswordOTPEmail = (full_name, otp) => {
  return `
  <div style="
      max-width: 600px;
      margin: 0 auto;
      font-family: 'Ubuntu', Arial, sans-serif;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      overflow: hidden;
  ">

      <!-- Header -->
      <div style="
          background: linear-gradient(135deg, #6a5af9, #00d4ff);
          padding: 20px;
          color: #ffffff;
          text-align: center;
      ">
          <h2 style="margin: 0; font-weight: 600;">
              Password Reset OTP
          </h2>
      </div>

      <!-- Body -->
      <div style="padding: 24px; color: #333333; font-size: 14px; line-height: 1.6;">
          <p>Dear <strong>${full_name}</strong>,</p>

          <p>
              We received a request to reset the password for your
              <strong>School Management System</strong> account.
          </p>

          <p>
              Please use the following One-Time Password (OTP) to proceed:
          </p>

          <div style="
              margin: 24px 0;
              text-align: center;
              font-size: 28px;
              letter-spacing: 6px;
              font-weight: 600;
              color: #6a5af9;
          ">
              ${otp}
          </div>

          <p style="color: #555;">
              This OTP is valid for a limited time.  
              Do not share it with anyone for security reasons.
          </p>

          <p style="color: #555;">
              If you did not request a password reset, please ignore this email.
          </p>

          <p style="margin-top: 24px;">
              Best regards,<br>
              <strong>School Management System Team</strong>
          </p>
      </div>

      <!-- Footer -->
      <div style="
          background: #f5f7fa;
          padding: 12px;
          text-align: center;
          font-size: 12px;
          color: #777777;
      ">
          © ${new Date().getFullYear()} School Management System. All rights reserved.
      </div>

  </div>
  `;
};

exports.studentAddedByTeacherEmail = (full_name, student_id) => {
  return `
  <div style="
      max-width: 600px;
      margin: 0 auto;
      font-family: 'Ubuntu', Arial, sans-serif;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      overflow: hidden;
  ">

      <!-- Header -->
      <div style="
          background: linear-gradient(135deg, #0284c7, #38bdf8);
          padding: 20px;
          color: #ffffff;
          text-align: center;
      ">
          <h2 style="margin: 0; font-weight: 600;">
              Welcome to School Management System
          </h2>
      </div>

      <!-- Body -->
      <div style="padding: 24px; color: #333333; font-size: 14px; line-height: 1.6;">
          <p>Dear <strong>${full_name}</strong>,</p>

          <p>
              We are pleased to inform you that your account has been
              <strong>successfully created by your teacher</strong> in the
              <strong>School Management System</strong>.
          </p>

          <p>
              Your basic details have already been registered.  
              To start using your account, you need to <strong>set your password</strong>.
          </p>

          <div style="
              margin: 24px 0;
              padding: 16px;
              background: #f1f5f9;
              border-left: 4px solid #0284c7;
              border-radius: 6px;
          ">
              <p style="margin: 0;"><strong>Student ID:</strong> ${student_id}</p>
              <p style="margin: 6px 0 0 0;"><strong>Email:</strong> This email address</p>
          </div>

          <p>
              👉 To set your password:
          </p>

          <ol style="padding-left: 18px; color: #555;">
              <li>Go to the <strong>Login Page</strong></li>
              <li>Click on <strong>“Forgot Password”</strong></li>
              <li>Enter your registered email address</li>
              <li>Verify OTP and create a new password</li>
          </ol>

          <p style="color: #555;">
              For security reasons, never share your login details with anyone.
          </p>

          <p style="margin-top: 24px;">
              Best regards,<br>
              <strong>School Management System Team</strong>
          </p>
      </div>

      <!-- Footer -->
      <div style="
          background: #f5f7fa;
          padding: 12px;
          text-align: center;
          font-size: 12px;
          color: #777777;
      ">
          © ${new Date().getFullYear()} School Management System. All rights reserved.
      </div>

  </div>
  `;
};
