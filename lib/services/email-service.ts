import nodemailer from 'nodemailer';

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
  totalFormatted: string;
  itemsSummary: string;
  addressSummary: string;
  items: Array<{
    name: string;
    size?: string;
    quantity: number;
    priceFormatted: string;
    imageUrl?: string;
  }>;
}

export async function sendOrderConfirmationEmails(data: OrderEmailData, targetAdminEmail: string = 'tanavidesigns@gmail.com') {
  try {
    const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465');
    const smtpUser = process.env.SMTP_USER || '';
    const smtpPass = process.env.SMTP_PASS || '';

    // Create Transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined
    });

    const fromAddress = smtpUser || 'care@tanavidesigns.com';

    // 1. Customer Email Template
    const customerHtml = `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #faf8f5; padding: 32px; border: 1px solid #e4ddd0; border-radius: 16px;">
        <div style="text-align: center; border-bottom: 1px solid #e4ddd0; padding-bottom: 20px; margin-bottom: 24px;">
          <h1 style="font-size: 26px; color: #2b2420; margin: 0; letter-spacing: 0.05em;">TANAVI BY DEEPIKA</h1>
          <span style="font-size: 12px; color: #796c62; letter-spacing: 0.15em; text-transform: uppercase;">Handcrafted Designer Apparel</span>
        </div>

        <div style="background: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e4ddd0; margin-bottom: 24px;">
          <h2 style="font-size: 20px; color: #137333; margin-top: 0;">✨ Order Confirmed!</h2>
          <p style="font-size: 14px; color: #4a4039; line-height: 1.6;">
            Dear <strong>${data.customerName}</strong>,<br/>
            Thank you for choosing Tanavi by Deepika! We have received your order <strong>${data.orderNumber}</strong> and our artisans are preparing your handcrafted apparel.
          </p>

          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 20px 0;">
            <tr style="border-bottom: 1px solid #e4ddd0; color: #796c62; font-size: 11px; text-transform: uppercase;">
              <th style="text-align: left; padding: 8px 0;">Item Details</th>
              <th style="text-align: right; padding: 8px 0;">Price</th>
            </tr>
            ${data.items
              .map(
                (item) => `
              <tr style="border-bottom: 1px solid #f0eafe;">
                <td style="padding: 12px 0;">
                  <strong style="color: #2b2420;">${item.name}</strong><br/>
                  <span style="color: #796c62; font-size: 12px;">Size: ${item.size || 'Standard'} × Qty: ${item.quantity}</span>
                </td>
                <td style="text-align: right; padding: 12px 0; font-weight: 600; color: #2b2420;">${item.priceFormatted}</td>
              </tr>
            `
              )
              .join('')}
          </table>

          <div style="display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #e4ddd0; font-size: 15px; font-weight: 700; color: #2b2420;">
            <span>Total Payable (${data.paymentMethod}):</span>
            <span>${data.totalFormatted}</span>
          </div>
        </div>

        <div style="background: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #e4ddd0; margin-bottom: 24px; font-size: 13px; color: #4a4039;">
          <strong style="display: block; margin-bottom: 6px; color: #2b2420;">Shipping Address:</strong>
          ${data.customerName}<br/>
          ${data.addressSummary}<br/>
          Phone: ${data.customerPhone}
        </div>

        <div style="text-align: center; font-size: 12px; color: #796c62; line-height: 1.5;">
          Questions about your order? Reply to this email or chat on WhatsApp: <a href="https://wa.me/919482245679" style="color: #7c5e4a; font-weight: 600;">+91 94822 45679</a><br/>
          Vijayawada, Andhra Pradesh, India
        </div>
      </div>
    `;

    // 2. Admin Email Template
    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border: 1px solid #e4ddd0; border-radius: 12px;">
        <h2 style="color: #7c5e4a; margin-top: 0;">🚨 New Order Received (${data.paymentMethod.toUpperCase()})</h2>
        <p style="font-size: 14px; color: #2b2420;">A new order <strong>${data.orderNumber}</strong> was placed on the storefront.</p>

        <div style="background: #faf8f5; padding: 16px; border-radius: 8px; font-size: 13px; margin-bottom: 20px;">
          <p style="margin: 4px 0;"><strong>Customer:</strong> ${data.customerName} (${data.customerPhone})</p>
          <p style="margin: 4px 0;"><strong>Email:</strong> ${data.customerEmail}</p>
          <p style="margin: 4px 0;"><strong>Total Amount:</strong> ${data.totalFormatted}</p>
          <p style="margin: 4px 0;"><strong>Payment Method:</strong> ${data.paymentMethod}</p>
          <p style="margin: 4px 0;"><strong>Delivery Address:</strong> ${data.addressSummary}</p>
        </div>

        <h4 style="margin-bottom: 8px;">Order Items:</h4>
        <ul style="font-size: 13px; padding-left: 20px; color: #2b2420;">
          ${data.items.map((i) => `<li><strong>${i.name}</strong> (Size ${i.size || 'N/A'}) × ${i.quantity} — ${i.priceFormatted}</li>`).join('')}
        </ul>

        <div style="margin-top: 24px; text-align: center;">
          <a href="https://admin.tanavidesigns.com/admin/orders" style="display: inline-block; padding: 12px 20px; background: #7c5e4a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px;">
            Open in Studio Admin
          </a>
        </div>
      </div>
    `;

    if (smtpUser && smtpPass) {
      // Send Customer Email
      await transporter.sendMail({
        from: `"Tanavi by Deepika" <${fromAddress}>`,
        to: data.customerEmail,
        subject: `Order Confirmed: ${data.orderNumber} - Tanavi by Deepika`,
        html: customerHtml
      });

      // Send Admin Email
      await transporter.sendMail({
        from: `"Tanavi Studio Bot" <${fromAddress}>`,
        to: targetAdminEmail,
        subject: `🚨 New Order ${data.orderNumber} (${data.totalFormatted}) - ${data.customerName}`,
        html: adminHtml
      });

      console.log(`[EMAIL SERVICE] Successfully dispatched confirmation emails for order ${data.orderNumber} to ${data.customerEmail} and ${targetAdminEmail}!`);
    } else {
      console.log(`[EMAIL SERVICE DEV LOG] Email payload generated for order ${data.orderNumber}:`);
      console.log(`- Customer Email target: ${data.customerEmail}`);
      console.log(`- Admin Email target: ${targetAdminEmail}`);
    }
  } catch (error: any) {
    console.error('[EMAIL SERVICE ERROR] Failed to send order emails:', error);
  }
}
