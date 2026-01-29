import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { notify } from 'react-notify-toast';

const SEND_MAIL_MUTATION = gql`
  mutation sendMail($to: String!, $from: String!, $subject: String!, $body: String!, $invoiceId: ID, $attachInvoice: Boolean) {
    sendMail(to: $to, from: $from, subject: $subject, body: $body, invoiceId: $invoiceId, attachInvoice: $attachInvoice) {
      success
      message
    }
  }
`;

const SendMail = ({ isOpen, onClose, toEmail, invoice }) => {
  const [subject, setSubject] = useState('Invoice from J D Enterprises');
  const [body, setBody] = useState('Please find attached your invoice.');
  const [fromEmail, setFromEmail] = useState('jdenterprises0987@gmail.com');
  const [attachInvoice, setAttachInvoice] = useState(true);
  const [serverMessage, setServerMessage] = useState(null);

  useEffect(() => {
    if (invoice) {
      setSubject(`Invoice #${invoice.invoiceNo} from J D Enterprises`);
      setBody(
        `Dear ${invoice.title},\n\nPlease find your invoice (No: ${invoice.invoiceNo}).\n\nRegards,\nJ D Enterprises`
      );
    }
  }, [invoice]);

  const [sendMail, { loading }] = useMutation(SEND_MAIL_MUTATION, {
    onCompleted(data) {
      if (data.sendMail) {
        setServerMessage(data.sendMail.message || null);
        if (data.sendMail.success) {
          notify.show(data.sendMail.message || 'Email sent successfully', 'success');
          // Keep modal open so user can click preview link if available
        } else {
          notify.show(`Error: ${data.sendMail.message}`, 'error');
        }
      }
    },
    onError(err) {
      setServerMessage(err.message);
      notify.show(`Error sending email: ${err.message}`, 'error');
    },
  });

  if (!isOpen) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!toEmail) {
      notify.show('No recipient email provided', 'warning');
      return;
    }
    sendMail({
      variables: {
        to: toEmail,
        from: fromEmail,
        subject,
        body,
        invoiceId: invoice ? invoice._id : null,
        attachInvoice,
      },
    });
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Send Email</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={onSubmit}>
            <div className="field">
              <label className="label">To</label>
              <div className="control">
                <input className="input" type="email" value={toEmail || ''} readOnly />
              </div>
            </div>

            <div className="field">
              <label className="label">From</label>
              <div className="control">
                <input className="input" type="email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label className="label">Subject</label>
              <div className="control">
                <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label className="label">Message</label>
              <div className="control">
                <textarea className="textarea" value={body} onChange={(e) => setBody(e.target.value)} />
              </div>
            </div>

            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input type="checkbox" checked={attachInvoice} onChange={(e) => setAttachInvoice(e.target.checked)} />
                  &nbsp;Attach invoice PDF
                </label>
              </div>
            </div>

            <div className="field is-grouped is-grouped-right">
              <div className="control">
                <button className={`button is-link ${loading ? 'is-loading' : ''}`} type="submit">Send</button>
              </div>
              <div className="control">
                <button className="button" type="button" onClick={onClose}>Close</button>
              </div>
            </div>

            {serverMessage && (
              <div className="box" style={{ marginTop: '12px', wordBreak: 'break-word' }}>
                <strong>Server:</strong>
                <div style={{ marginTop: '8px' }}>{serverMessage}</div>
                {(() => {
                  const urlMatch = (serverMessage || '').match(/https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/i);
                  if (urlMatch) {
                    const url = urlMatch[0];
                    return (
                      <div style={{ marginTop: '8px' }}>
                        <a href={url} target="_blank" rel="noreferrer" className="button is-small is-link">Open preview</a>
                        <button
                          className="button is-small"
                          style={{ marginLeft: '8px' }}
                          onClick={() => { navigator.clipboard && navigator.clipboard.writeText(url); notify.show('Copied preview URL to clipboard', 'success'); }}
                        >
                          Copy link
                        </button>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
};

export default SendMail;
