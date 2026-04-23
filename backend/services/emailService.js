import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create transporter with your Gmail credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/ /g, '') // Remove spaces from app password
    }
});

// Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email service error:', error);
    } else {
        console.log('✅ Email service ready to send emails');
    }
});

// Email templates
const getOrderStatusEmail = (userName, orderId, status, totalAmount) => {
    const statusMessages = {
        'confirmed': '✅ Your order has been confirmed!',
        'preparing': '👨‍🍳 Your order is being prepared!',
        'out-for-delivery': '🚚 Your order is out for delivery!',
        'delivered': '🎉 Your order has been delivered!'
    };

    const statusColors = {
        'confirmed': '#3b82f6',
        'preparing': '#f59e0b',
        'out-for-delivery': '#8b5cf6',
        'delivered': '#10b981'
    };

    return {
        subject: `Order #${orderId.slice(-8)} - ${status.toUpperCase()}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Update - KiranaConnect</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px 20px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">🛒</div>
            <h1 style="color: white; margin: 0; font-size: 28px;">KiranaConnect</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Your Local Kirana Store Online</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px 25px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hello ${userName},</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
              ${statusMessages[status] || `Your order status has been updated to ${status}`}
            </p>
            
            <!-- Status Badge -->
            <div style="text-align: center; margin: 25px 0;">
              <span style="display: inline-block; background-color: ${statusColors[status] || '#6b7280'}; color: white; padding: 8px 20px; border-radius: 50px; font-weight: bold; font-size: 14px;">
                ${status.toUpperCase()}
              </span>
            </div>
            
            <!-- Order Details -->
            <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1f2937; font-size: 16px;">📦 Order Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Order ID:</td>
                  <td style="padding: 8px 0; font-weight: 600;">#${orderId.slice(-8)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Status:</td>
                  <td style="padding: 8px 0; font-weight: 600; color: ${statusColors[status] || '#6b7280'};">${status.toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Total Amount:</td>
                  <td style="padding: 8px 0; font-weight: 700; font-size: 18px; color: #059669;">₹${totalAmount}</td>
                </tr>
              </table>
            </div>
            
            <!-- Action Button -->
            <div style="text-align: center; margin: 25px 0;">
              <a href="${process.env.FRONTEND_URL}/track-order/${orderId}" 
                 style="display: inline-block; background-color: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Track Your Order
              </a>
            </div>
            
            <!-- Delivery Info -->
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                🚚 Need help? Contact our support team at support@kiranaconnect.com
              </p>
            </div>
            
            <hr style="margin: 25px 0; border: none; border-top: 1px solid #e5e7eb;" />
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
              Thank you for shopping with KiranaConnect!<br>
              This is an automated message, please do not reply.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
    };
};

// Send order status email
export const sendOrderStatusEmail = async (user, orderId, status, totalAmount) => {
    try {
        const { subject, html } = getOrderStatusEmail(user.name, orderId, status, totalAmount);

        const mailOptions = {
            from: `"KiranaConnect" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: subject,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${user.email} for order ${orderId.slice(-8)} - ${status}`);
        return true;
    } catch (error) {
        console.error('❌ Email error:', error);
        return false;
    }
};

// Send welcome email
export const sendWelcomeEmail = async (user) => {
    try {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to KiranaConnect!</h1>
        </div>
        <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
          <h2>Hi ${user.name},</h2>
          <p>Thank you for joining KiranaConnect! 🎉</p>
          <p>Start shopping and get fresh groceries delivered to your doorstep.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px;">Start Shopping</a>
          </div>
        </div>
      </div>
    `;

        await transporter.sendMail({
            from: `"KiranaConnect" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Welcome to KiranaConnect! 🎉',
            html
        });
        console.log(`✅ Welcome email sent to ${user.email}`);
        return true;
    } catch (error) {
        console.error('❌ Welcome email error:', error);
        return false;
    }
};

export default { sendOrderStatusEmail, sendWelcomeEmail };