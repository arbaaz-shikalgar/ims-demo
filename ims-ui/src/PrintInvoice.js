import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { notify } from 'react-notify-toast';
import gql from 'graphql-tag';
import logo from './images/jdent.png';
import moment from 'moment';

const BUYER_QUERY = gql`
  query getJdentBuyer($_id: ID!) {
    getJdentBuyer(_id: $_id) {
      title
      date
      content
      address
      emailId
      contactNo
      invoiceNo
      deliveryNote
      supplierRef
      otherRef
      buyersOrderNo
      dispatchDocumentNo
      deliveryNoteDate
      dispatchedThrough
      destination
      termsOfDelivery
      srNo
      disriptionOfGoods
      modelNo
      sirNo
      hsnsac
      quantity
      rate
      per
      discount
      amount
      totalAmount
      totalAmountInWords
    }
  }
`;

const printOrder = () => {
  const printableElements = document.getElementById('printme').innerHTML;
  const oldPage = document.body.innerHTML;
  const orderHtml =
    '<html><head><title></title></head><body>' +
    printableElements +
    '</body></html>';
  document.body.innerHTML = orderHtml;
  window.print();
  document.body.innerHTML = oldPage;
  window.location.reload(false);
};

const PrintInvoice = ({ match }) => {
  const { loading, error, data } = useQuery(BUYER_QUERY, {
    variables: {
      _id: match.params.id,
    },
  });

  if (loading) return <div>Fetching invoice</div>;
  if (error) return <div>Error fetching invoice</div>;

  // set the  result gotten from rhe GraphQL server into the invoice variable.
  console.log('print data', data);

  const invoice = data;

  var amount = parseInt(data.getJdentBuyer.totalAmount);

  var amountToWord = amount;
  var words = new Array();
  words[0] = '';
  words[1] = 'One';
  words[2] = 'Two';
  words[3] = 'Three';
  words[4] = 'Four';
  words[5] = 'Five';
  words[6] = 'Six';
  words[7] = 'Seven';
  words[8] = 'Eight';
  words[9] = 'Nine';
  words[10] = 'Ten';
  words[11] = 'Eleven';
  words[12] = 'Twelve';
  words[13] = 'Thirteen';
  words[14] = 'Fourteen';
  words[15] = 'Fifteen';
  words[16] = 'Sixteen';
  words[17] = 'Seventeen';
  words[18] = 'Eighteen';
  words[19] = 'Nineteen';
  words[20] = 'Twenty';
  words[30] = 'Thirty';
  words[40] = 'Forty';
  words[50] = 'Fifty';
  words[60] = 'Sixty';
  words[70] = 'Seventy';
  words[80] = 'Eighty';
  words[90] = 'Ninety';
  amountToWord = amountToWord.toString();
  var atemp = amountToWord.split('.');
  var number = atemp[0].split(',').join('');
  var n_length = number.length;
  var words_string = '';
  if (n_length <= 9) {
    var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
    var received_n_array = new Array();
    for (var i = 0; i < n_length; i++) {
      received_n_array[i] = number.substr(i, 1);
    }
    for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
      n_array[i] = received_n_array[j];
    }
    for (var i = 0, j = 1; i < 9; i++, j++) {
      if (i == 0 || i == 2 || i == 4 || i == 7) {
        if (n_array[i] == 1) {
          n_array[j] = 10 + parseInt(n_array[j]);
          n_array[i] = 0;
        }
      }
    }
    var value = '';
    for (var i = 0; i < 9; i++) {
      if (i == 0 || i == 2 || i == 4 || i == 7) {
        value = n_array[i] * 10;
      } else {
        value = n_array[i];
      }
      if (value != 0) {
        words_string += words[value] + ' ';
      }
      if (
        (i == 1 && value != 0) ||
        (i == 0 && value != 0 && n_array[i + 1] == 0)
      ) {
        words_string += 'Crores ';
      }
      if (
        (i == 3 && value != 0) ||
        (i == 2 && value != 0 && n_array[i + 1] == 0)
      ) {
        words_string += 'Lakhs ';
      }
      if (
        (i == 5 && value != 0) ||
        (i == 4 && value != 0 && n_array[i + 1] == 0)
      ) {
        words_string += 'Thousand ';
      }
      if (i == 6 && value != 0 && n_array[i + 1] != 0 && n_array[i + 2] != 0) {
        words_string += 'Hundred and ';
      } else if (i == 6 && value != 0) {
        words_string += 'Hundred ';
      }
    }
    words_string = words_string.split('  ').join(' ');
  }

  var amountInWord = words_string + ' Rupee Only ';
  console.log('amountInWord', amountInWord);

  var price = parseInt(data.getJdentBuyer.totalAmount);
  var gstRatePer = parseInt(data.getJdentBuyer.content);
  const SGSTPer = gstRatePer / 2;
  const CGSTPer = gstRatePer / 2;
  console.log('gstRatePer', gstRatePer);

  var totalGSTAmt = price - price * (100 / (100 + gstRatePer));
  var originalCost = price - totalGSTAmt;
  const SGSTAmt = totalGSTAmt / 2;
  const CGSTAmt = totalGSTAmt / 2;

  console.log('price', price.toFixed(2));
  console.log('tgstAMt', totalGSTAmt.toFixed(2));
  console.log('oricost', originalCost.toFixed(2));
  console.log('SGSTAmt', SGSTAmt.toFixed(2));
  console.log('CGSTAmt', CGSTAmt.toFixed(2));

  return (
    <div className='container m-t-20'>
      <h1 className='page-title'>
        <button
          className='button is-link is-large is-fullwidth'
          onClick={() => printOrder()}
        >
          Print
        </button>
      </h1>
      <div id='printme' className='newnote-page m-t-40'>
        <table border='1px' width='100%' id='cssTable'>
          <caption>GST Invoice</caption>
          <tbody>
            <tr>
              <td rowSpan='4' text-align='center'>
                <div className='column'>
                  <div className='row'>
                  <div className='column'>
                    <img src={logo} className='print-logo' alt={'logo'} /></div>
                  <div className='column'> {/* <p className="cgst-title"><b>J D ENTERPRISES &nbsp; जे डी एन्टरप्राइझेस </b></p> */}
                  <p> <b>SHOP NO 5,6,17,18 HEMRAJ COMPLEX OPP. DAULAT CHITRA MANDIR KOREGAON, DISTRICT SATARA 415501</b></p>
                  <p> GSTIN/UIN: 27AEBPA1115P1ZT</p>
                  <p> State Name : Maharashtra, Code : 27 </p>
                  <p>
                    {' '}
                    Office.No: (02163) 220987, Mobile No. 9394987987 / 9561220987 
                    {' '}
                  </p>
                  <p> E-Mail : jdenterprises0987@gmail.com </p></div>
                    </div>
                 
                </div>
              </td>
              <td>
                Invoice No.<p>{data.getJdentBuyer.invoiceNo}</p>
              </td>
              {/* <td>Dated<p>{new Date(data.getJdentBuyer.date).toLocaleDateString()}</p></td> */}
              <td>
                Dated{' '}
                <p>
                  {moment(data.getJdentBuyer.deliveryNoteDate).format(
                    'DD/MM/YYYY'
                  )}
                </p>
              </td>
            </tr>
            <tr>
              <td>Delivery Note : </td>
              <td>
                Mode/Terms of Payment :{' '}
                <p className='cgst-title'>{data.getJdentBuyer.deliveryNote}</p>
              </td>
            </tr>
            <tr>
              <td>
                Supplier Ref.<p>{''}</p>
              </td>
              <td>
                Other Ref. <p>{data.getJdentBuyer.otherRef}</p>
              </td>
            </tr>
            <tr>
              <td>
                Buyer's Order No.<p>{data.getJdentBuyer.buyersOrderNo}</p>
              </td>
              <td>
                Dated.
                <p>
                  {moment(data.getJdentBuyer.deliveryNoteDate).format(
                    'DD/MM/YYYY'
                  )}
                </p>
              </td>
            </tr>
            <tr>
              <td rowSpan='3'>
                <div className='column'>
                  <p>Buyer</p>
                  <p>
                    <b>{data.getJdentBuyer.title}</b>
                  </p>
                  <p> {data.getJdentBuyer.address}</p>
                  <p> Mobile No. :{data.getJdentBuyer.contactNo} </p>
                  <p> Email Id. : {data.getJdentBuyer.emailId}</p>
                </div>
              </td>
              <td>
                Dispatch Doc. No.<p>{data.getJdentBuyer.dispatchDocumentNo}</p>
              </td>
              <td>
                Delivery Date.
                <p>
                  {' '}
                  {moment(data.getJdentBuyer.deliveryNoteDate).format(
                    'DD/MM/YYYY'
                  )}
                </p>
              </td>
            </tr>

            {/* <tr>
      <td>Dispatch Document No.

          <p >{data.getJdentBuyer.dispatchDocumentNo}</p>
         
      </td>
      <td>Delivery Note Date.
      <p >{data.getJdentBuyer.deliveryNoteDate}</p>
         
      </td>
    </tr> */}

            <tr>
              <td>
                Dispatched through<p>{data.getJdentBuyer.dispatchedThrough}</p>
              </td>
              <td>
                Destination.<p>{data.getJdentBuyer.destination}</p>
              </td>
            </tr>
            <tr>
              <td colSpan='2'>
                {' '}
                Terms Of Delivery  <b><p>No Return, No Refund Policies</p></b>
              </td>
            </tr>
          </tbody>
        </table>
        <table border='1px' width='100%' id='cssTable'>
          <tbody>
            <tr>
              <th>Sr.no</th>
              <th>Disription of Goods</th>
              <th>HSN/SAC</th>
              <th>Qty </th>
              <th>Rate</th>
              <th>Per</th>
              <th>Disc%</th>
              <th>Amount</th>
            </tr>
            <tr>
              <td>1</td>
              <td>
                <b>
                  <p className='card-header-title'>
                    {data.getJdentBuyer.disriptionOfGoods}
                  </p>
                </b>
                <b>Model No. : </b>{' '}
                <p className='cgst-title'>{data.getJdentBuyer.modelNo}</p>
                <b>SIR. No. :</b>{' '}
                <p className='cgst-title'>{data.getJdentBuyer.sirNo}</p>
              </td>
              <td>
                <p>{data.getJdentBuyer.hsnsac}</p>
              </td>
              <td>
                <p>1</p>
              </td>
              <td>
                <p>{originalCost.toFixed(2)}</p>
              </td>
              <td>
                <p>1</p>
              </td>
              <td>
                <p>0 %</p>
              </td>
              <td>{originalCost.toFixed(2)}</td>
            </tr>
            <tr>
              <td></td>
              <td>
                <p> CGST @{CGSTPer}%</p>
                <p> SGST @{SGSTPer}%</p>
                {/* <p> IGST @ 18 %</p> */}
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <p>{SGSTAmt.toFixed(2)}</p>
                <p>{CGSTAmt.toFixed(2)}</p>
                {/* <p>{totalGSTAmt.toFixed(2)}</p> */}
              </td>
            </tr>
            <tr>
              <td colSpan='2'>Total Expense:</td>
              <td></td>
              <td>1 Nos</td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <p className='cgst-title'>{price.toFixed(2)}</p>
              </td>
            </tr>
            <tr>
              <td colSpan='8'>
                <div className='columns'>
                  <div className='column'>
                    &nbsp;Amount in words.
                    <b> <p className='cgst-title'> &nbsp;{amountInWord}</p></b>
                  </div>
                  {/* <div className="columns">
                   <p >E. & O.E</p>
                  </div> */}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <table border='1px' width='100%' id='cssTable'>
          <tbody>
            <tr>
              <th rowSpan='2'>HSN/SAC</th>
              <th rowSpan='2'>Taxable Value</th>
              <th colSpan='2'>Central Tax</th>
              <th colSpan='2'>Sales tax</th>
              <th rowSpan='2'>Total Tax Amount</th>
            </tr>
            <tr>
              <td>Rate</td>
              <td>Amount</td>
              <td>Rate</td>
              <td>Amount</td>
            </tr>
            <tr>
              <td>{data.getJdentBuyer.hsnsac}</td>
              <td>{originalCost.toFixed(2)}</td>
              <td>{CGSTPer} %</td>
              <td>{CGSTAmt.toFixed(2)}</td>
              <td>{SGSTPer} %</td>
              <td>{SGSTAmt.toFixed(2)}</td>
              <td>
                <p className='cgst-title'>{totalGSTAmt.toFixed(2)}</p>
              </td>
            </tr>
            <tr>
              <td colSpan='8'>
                <div className='columns' id='field-left'>
                  <div className='column'>
                    <p>
                      <u>
                        <b>Declaration</b>
                      </u>
                    </p>
                    <div className='field'>
                      <span>
                        We declare that this invoice shows the actual price of
                        the goods described and that all particulars are true
                        and correct.
                      </span>
                    </div>
                  </div>
                  <div className='column'>
                    <p>
                      <u>
                        <b>Bank Details</b>
                      </u>
                    </p>
                    <p>
                      {' '}
                      <b>Bank A/c : </b> IDBI Bank
                    </p>
                    <p>
                      <b>A/c No : </b> 473102000000365
                    </p>
                    <p>
                      <b>Branch & IFS Code : </b> Koregaon & IBKL0000473
                    </p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan='3'>
                <p> &nbsp; </p>
                <p> &nbsp; </p>
                <p>Customer Seal And Signature</p>{' '}
              </td>
              <td colSpan='4'>
                <p> &nbsp; </p>
                <p> &nbsp; </p>
                <p className='cgst-title'> For J. D. ENTERPRISES </p>
              </td>
            </tr>
            <tr>
              <td colSpan='8'>
                <p>Subject to SATARA JURISDICTION</p>
                <p>this is Computer Generated Invoice</p>
              </td>
            </tr>
          </tbody>
        </table>
         <img src={logo} className='invoice-watermark' alt={'watermark'} />
      </div>
    </div>
  );
};

export default PrintInvoice;
