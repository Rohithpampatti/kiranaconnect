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

// Send OTP email for password reset or verification
export const sendOTPEmail = async (email, otp, type) => {
    const typeMessage = type === 'password_reset' ? 'reset your password' : type === 'email_verification' ? 'verify your email address' : 'verify your account';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification - KiranaConnect</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">🔐</div>
            <h1 style="color: white; margin: 0; font-size: 24px;">KiranaConnect</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">OTP Verification</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px 25px;">
            <h2 style="color: #1f2937; margin-top: 0;">Verification Code</h2>
            <p style="color: #4b5563; font-size: 16px;">
              Your OTP to ${typeMessage} is:
            </p>
            
            <!-- OTP Code -->
            <div style="text-align: center; margin: 25px 0;">
              <span style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 15px 30px; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 10px; font-family: monospace;">
                ${otp}
              </span>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              This OTP is valid for <strong>10 minutes</strong>.
            </p>
            
            <hr style="margin: 25px 0; border: none; border-top: 1px solid #e5e7eb;" />
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
        const mailOptions = {
            from: `"KiranaConnect" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `OTP to ${typeMessage} - KiranaConnect`,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ OTP email error:', error);
        return false;
    }
};

// Send verification email for new registration
export const sendVerificationEmail = async (email, otp, name) => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - KiranaConnect</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 550px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 35px 20px; text-align: center;">
            <div style="font-size: 55px; margin-bottom: 10px;">📧</div>
            <h1 style="color: white; margin: 0; font-size: 28px;">Verify Your Email</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Welcome to KiranaConnect!</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 35px 30px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hello ${name},</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
              Thank you for creating an account with KiranaConnect! Please verify your email address to start shopping.
            </p>
            
            <!-- OTP Code -->
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 12px;">
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">Your verification code is:</p>
                <span style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 12px 30px; font-size: 32px; font-weight: bold; letter-spacing: 5px; border-radius: 10px; font-family: monospace;">
                  ${otp}
                </span>
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              This OTP is valid for <strong>10 minutes</strong>.
            </p>
            
            <hr style="margin: 25px 0; border: none; border-top: 1px solid #e5e7eb;" />
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              If you didn't create an account with KiranaConnect, please ignore this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
        const mailOptions = {
            from: `"KiranaConnect" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email - KiranaConnect',
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Verification email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Verification email error:', error);
        return false;
    }
};

// Send order confirmation email (like BigBasket)
export const sendOrderConfirmationEmail = async (user, orderId, items, totalAmount, deliveryAddress, deliveryDate, deliveryTimeSlot) => {
    const itemsHtml = items.map(item => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 0;">
                <strong>${item.name}</strong><br>
                <span style="color: #6b7280; font-size: 12px;">Qty: ${item.quantity} × ₹${item.price}</span>
            </td>
            <td style="padding: 12px 0; text-align: right;">
                <strong>₹${item.price * item.quantity}</strong>
            </td>
        </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - KiranaConnect</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px 20px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">📋</div>
            <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Thank you for shopping with us</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px 25px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hello ${user.name},</h2>
            <p style="color: #4b5563; font-size: 16px;">
              Your order has been placed successfully! Here are the details:
            </p>
            
            <!-- Order Info -->
            <div style="background-color: #f0fdf4; padding: 15px; border-radius: 12px; margin: 20px 0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #6b7280;">Order ID:</span>
                <span style="font-weight: 600;">#${orderId.slice(-10)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="color: #6b7280;">Order Date:</span>
                <span style="font-weight: 600;">${new Date().toLocaleDateString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Delivery Slot:</span>
                <span style="font-weight: 600;">${deliveryDate || 'Today'} | ${deliveryTimeSlot || 'ASAP'}</span>
              </div>
            </div>
            
            <!-- Items -->
            <div style="margin: 20px 0;">
              <h3 style="color: #1f2937; margin-bottom: 15px;">🛍️ Items Ordered</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f9fafb; border-bottom: 2px solid #e5e7eb;">
                    <th style="text-align: left; padding: 10px;">Item</th>
                    <th style="text-align: right; padding: 10px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr style="border-top: 2px solid #e5e7eb;">
                    <td style="padding: 15px 0 0 0;"><strong>Total Amount</strong></td>
                    <td style="padding: 15px 0 0 0; text-align: right;"><strong style="color: #059669; font-size: 20px;">₹${totalAmount}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <!-- Delivery Address -->
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 12px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin-bottom: 10px;">📍 Delivery Address</h3>
              <p style="color: #4b5563; margin: 0;">${deliveryAddress}</p>
            </div>
            
            <!-- Action Button -->
            <div style="text-align: center; margin: 25px 0;">
              <a href="${process.env.FRONTEND_URL}/track-order/${orderId}" 
                 style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 12px 35px; text-decoration: none; border-radius: 10px; font-weight: bold;">
                Track Your Order
              </a>
            </div>
            
            <!-- Estimated Delivery -->
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                🚚 Estimated delivery time: 25-30 minutes
              </p>
            </div>
            
            <hr style="margin: 25px 0; border: none; border-top: 1px solid #e5e7eb;" />
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              Need help? Contact us at support@kiranaconnect.com or call +91 98765 43210
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
        const mailOptions = {
            from: `"KiranaConnect" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `Order Confirmed! #${orderId.slice(-8)} - KiranaConnect`,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Order confirmation email sent to ${user.email}`);
        return true;
    } catch (error) {
        console.error('❌ Order confirmation email error:', error);
        return false;
    }
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
        console.log(`✅ Status email sent to ${user.email} for order ${orderId.slice(-8)} - ${status}`);
        return true;
    } catch (error) {
        console.error('❌ Email error:', error);
        return false;
    }
};

// Send order delivered email (like BigBasket)
export const sendOrderDeliveredEmail = async (user, orderId, totalAmount, deliveryDate) => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Delivered - KiranaConnect</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px 20px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
            <h1 style="color: white; margin: 0; font-size: 28px;">Order Delivered!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Thank you for choosing KiranaConnect</p>
          </div>
          
          <div style="padding: 30px 25px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hello ${user.name},</h2>
            <p style="color: #4b5563; font-size: 16px;">
              Your order has been successfully delivered! 🎉
            </p>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
              <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
              <p style="color: #059669; font-weight: bold; font-size: 18px;">Order #${orderId.slice(-8)}</p>
              <p style="color: #6b7280;">Delivered on ${deliveryDate || new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${process.env.FRONTEND_URL}/orders" 
                 style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 12px 35px; text-decoration: none; border-radius: 10px; font-weight: bold;">
                View Your Orders
              </a>
            </div>
            
            <!-- Rating Section -->
            <div style="background-color: #fef3c7; border-radius: 12px; padding: 15px; text-align: center; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                ⭐ Loved our service? Rate your experience on the app!
              </p>
            </div>
            
            <hr style="margin: 25px 0; border: none; border-top: 1px solid #e5e7eb;" />
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">
              We hope to serve you again soon!
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
        const mailOptions = {
            from: `"KiranaConnect" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `🎉 Order Delivered! #${orderId.slice(-8)} - KiranaConnect`,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Order delivered email sent to ${user.email}`);
        return true;
    } catch (error) {
        console.error('❌ Order delivered email error:', error);
        return false;
    }
};

// Send welcome email
export const sendWelcomeEmail = async (user) => {
    try {
        const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to KiranaConnect!</h1>
        </div>
        <div style="padding: 30px 25px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hi ${user.name},</h2>
          <p style="color: #4b5563; font-size: 16px;">Thank you for joining KiranaConnect! 🎉</p>
          <p style="color: #4b5563; font-size: 16px;">Start shopping and get fresh groceries delivered to your doorstep in under 30 minutes.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 10px; font-weight: bold;">
              Start Shopping
            </a>
          </div>
          <hr style="margin: 25px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Need help? Contact us at support@kiranaconnect.com
          </p>
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

export default {
    sendOrderStatusEmail,
    sendWelcomeEmail,
    sendOTPEmail,
    sendVerificationEmail,
    sendOrderConfirmationEmail,
    sendOrderDeliveredEmail
};