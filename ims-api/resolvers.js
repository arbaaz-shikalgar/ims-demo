import nodemailer from 'nodemailer';
import Note from './models/note';
import Entry from './models/entry';
import Jdentbuyer from './models/jdentbuyer';

// Generates a simple invoice HTML from a JdentBuyer document. Keep styling inline for self-contained rendering.
function generateInvoiceHTML(invoice) {
  const date = invoice.deliveryNoteDate || '';
  const itemsHtml = `
    <tr>
      <td style="padding:8px;border:1px solid #ddd;">1</td>
      <td style="padding:8px;border:1px solid #ddd;">${invoice.disriptionOfGoods || ''}<br/><small>Model: ${invoice.modelNo || ''} SIR No: ${invoice.sirNo || ''}</small></td>
      <td style="padding:8px;border:1px solid #ddd;">${invoice.hsnsac || ''}</td>
      <td style="padding:8px;border:1px solid #ddd;">${invoice.quantity || '1'}</td>
      <td style="padding:8px;border:1px solid #ddd;">${invoice.rate || ''}</td>
      <td style="padding:8px;border:1px solid #ddd;">${invoice.amount || invoice.totalAmount || ''}</td>
    </tr>
  `;

  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Invoice ${invoice.invoiceNo || ''}</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; }
        .header { display:flex; align-items:center; justify-content:space-between; }
        .logo { max-width:150px; }
        table { border-collapse: collapse; width:100%; }
        th, td { text-align:left; }
        .meta { margin-top:10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h2>J D ENTERPRISES</h2>
          <div>Shop No 5,6,7,18 HEMRAJ COMPLEX Opp. Daulat Chitra Mandir Koregaon, District Satara 415501</div>
          <div>GSTIN/UIN: 27AEBPA1115P1ZT</div>
        </div>
        <div style="text-align:right">
          <div><strong>Invoice</strong></div>
          <div>Invoice No: ${invoice.invoiceNo || ''}</div>
          <div>Dated: ${date}</div>
        </div>
      </div>

      <hr />

      <div>
        <strong>Buyer:</strong> ${invoice.title || ''}<br/>
        ${invoice.address || ''}<br/>
        Mobile: ${invoice.contactNo || ''}<br/>
        Email: ${invoice.emailId || ''}
      </div>

      <table style="margin-top:20px;">
        <thead>
          <tr>
            <th style="padding:8px;border:1px solid #ddd;">Sr.no</th>
            <th style="padding:8px;border:1px solid #ddd;">Description</th>
            <th style="padding:8px;border:1px solid #ddd;">HSN/SAC</th>
            <th style="padding:8px;border:1px solid #ddd;">Qty</th>
            <th style="padding:8px;border:1px solid #ddd;">Rate</th>
            <th style="padding:8px;border:1px solid #ddd;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="margin-top:20px;text-align:right">
        <div><strong>Total: </strong> ${invoice.totalAmount || ''}</div>
        <div>Amount in words: ${invoice.totalAmountInWords || ''}</div>
      </div>

      <footer style="margin-top:30px;font-size:11px;color:#666">This is a computer generated invoice.</footer>
    </body>
  </html>
  `;
}


export const resolvers = {
  Query: {
    async getNote(root, { _id }) {
      return await Note.findById(_id);
    },
    async allNotes() {
      return await Note.find();
    },
    async getEntry(root, { _id }) {
      return await Entry.findById(_id);
    },
    async allEntries() {
      return await Entry.find();
    },
    async getJdentBuyer(root, { _id }) {
      return await Jdentbuyer.findById(_id);
    },
    async allJdentBuyers() {
      return await Jdentbuyer.find();
    },
    async transportStatus() {
      const sendgridKey = process.env.SENDGRID_API_KEY;
      const host = process.env.SMTP_HOST;
      const user = process.env.SMTP_USER;
      if (sendgridKey) {
        return { provider: 'sendgrid', configured: true, detail: 'Using SendGrid API' };
      }
      if (host && user) {
        return { provider: 'smtp', configured: true, detail: `SMTP host ${host}` };
      }
      return { provider: 'ethereal', configured: false, detail: 'Using dev Ethereal fallback' };
    },
  },
  Mutation: {
    async createNote(root, { input }) {
      return await Note.create(input);
    },
    async updateNote(root, { _id, input }) {
      console.log('updateNote', input);
      return await Note.findOneAndUpdate({ _id }, input, { new: true });
    },
    async deleteNote(root, { _id }) {
      return await Note.findOneAndRemove({ _id });
    },
    async createEntry(root, { input }) {
      return await Entry.create(input);
    },
    async updateEntry(root, { _id, input }) {
      return await Entry.findOneAndUpdate({ _id }, input, { new: true });
    },
    async deleteEntry(root, { _id }) {
      return await Entry.findOneAndRemove({ _id });
    },
    async createBuyer(root, { input }) {
      return await Jdentbuyer.create(input);
    },
    async updateBuyer(root, { _id, input }) {
      console.log('Update Buyer', input);
      return await Jdentbuyer.findOneAndUpdate({ _id }, input, { new: true });
    },
    async deleteBuyer(root, { _id }) {
      return await Jdentbuyer.findOneAndRemove({ _id });
    },

    // Send email - prefer SendGrid API if SENDGRID_API_KEY is provided, otherwise use SMTP with Nodemailer. Ethereal fallback remains for dev.
    async sendMail(root, { to, from, subject, body, invoiceId, attachInvoice }) {
      try {
        const sendgridKey = process.env.SENDGRID_API_KEY;
        const host = process.env.SMTP_HOST;
        const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined;
        const secure = process.env.SMTP_SECURE === 'true';
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        let attachments = [];

        // If attachment requested and invoiceId provided, generate PDF (if puppeteer available)
        if (attachInvoice && invoiceId) {
          const invoice = await Jdentbuyer.findById(invoiceId);
          if (invoice) {
            const html = generateInvoiceHTML(invoice);
            try {
              let pp = null;
              try {
                pp = (await import('puppeteer')).default || (await import('puppeteer'));
              } catch (impErr) {
                console.warn('puppeteer not available, skipping PDF generation', impErr && impErr.message);
              }

              if (pp) {
                const browser = await pp.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
                const page = await browser.newPage();
                await page.setContent(html, { waitUntil: 'networkidle0' });
                const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' } });
                await browser.close();

                attachments.push({ filename: `Invoice-${invoice.invoiceNo || invoice._id}.pdf`, content: pdfBuffer });
              }
            } catch (pdfErr) {
              console.error('PDF generation error', pdfErr);
              // continue without attachment
            }
          }
        }

        // If SendGrid API key is set, prefer SendGrid. If the SendGrid SDK is not installed, fall back to SendGrid SMTP.
        if (sendgridKey) {
          let sendgridClient = null;
          try {
            sendgridClient = require('@sendgrid/mail');
          } catch (e) {
            console.warn('@sendgrid/mail not installed, falling back to SMTP with SendGrid credentials');
          }

          if (!sendgridClient) {
            // Use SMTP transport to send via SendGrid
            const smtpTransport = nodemailer.createTransport({
              host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
              port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
              secure: process.env.SMTP_SECURE === 'true',
              auth: { user: process.env.SMTP_USER || 'apikey', pass: sendgridKey },
            });

            const mailOptionsSmtp = {
              from,
              to,
              subject,
              text: body,
              html: `<pre>${body}</pre>`,
              attachments,
            };

            const infoSmtp = await smtpTransport.sendMail(mailOptionsSmtp);
            console.log('SendGrid SMTP send result', infoSmtp && infoSmtp.messageId);
            return { success: true, message: `Email sent via SendGrid SMTP, messageId: ${infoSmtp && infoSmtp.messageId}` };
          }

          // SendGrid SDK is available — use it
          sendgridClient.setApiKey(sendgridKey);

          const msg = {
            to,
            from,
            subject,
            text: body,
            html: `<pre>${body}</pre>`,
          };

          if (attachments && attachments.length) {
            msg.attachments = attachments.map((a) => ({
              content: Buffer.isBuffer(a.content) ? a.content.toString('base64') : Buffer.from(a.content).toString('base64'),
              filename: a.filename,
              type: 'application/pdf',
              disposition: 'attachment',
            }));
          }

          const res = await sendgridClient.send(msg);
          const info = res && res[0] ? res[0] : null;
          const messageId = info && (info.headers && (info.headers['x-message-id'] || info.headers['X-Message-Id'])) ? (info.headers['x-message-id'] || info.headers['X-Message-Id']) : null;
          console.log('SendGrid send result', info && info.statusCode);
          return { success: true, message: messageId ? `Email sent via SendGrid, messageId: ${messageId}` : 'Email sent via SendGrid' };
        }

        // Fallback to SMTP/Nodemailer
        if (!host || !user || !pass) {
          if (process.env.NODE_ENV === 'production') {
            return { success: false, message: 'SMTP credentials not configured on server' };
          }

          const testAccount = await nodemailer.createTestAccount();
          const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });

          const mailOptionsDev = {
            from,
            to,
            subject,
            text: body,
            html: `<pre>${body}</pre>`,
            attachments,
          };

          const info = await transporter.sendMail(mailOptionsDev);
          const previewUrl = nodemailer.getTestMessageUrl(info);
          console.log('Dev message sent. Preview URL:', previewUrl);

          return { success: true, message: `Email sent (dev preview): ${previewUrl}` };
        }

        const transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: { user, pass },
        });

        const mailOptions = {
          from,
          to,
          subject,
          text: body,
          html: `<pre>${body}</pre>`,
          attachments,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);

        return { success: true, message: `Email sent: ${info.messageId}` };
      } catch (err) {
        console.error('sendMail error', err);
        return { success: false, message: err.message };
      }
    },
  },
};
