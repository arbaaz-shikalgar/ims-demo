import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import Calendar from 'react-input-calendar';

const NEW_INVOICE = gql`
  mutation createBuyer(
    $title: String!
    $content: String
    $address: String
    $emailId: String
    $contactNo: String
    $invoiceNo: String
    $deliveryNote: String
    $supplierRef: String
    $otherRef: String
    $buyersOrderNo: String
    $dispatchDocumentNo: String
    $deliveryNoteDate: String
    $dispatchedThrough: String!
    $destination: String
    $termsOfDelivery: String
    $srNo: String
    $disriptionOfGoods: String
    $modelNo: String
    $sirNo: String
    $hsnsac: String!
    $quantity: String
    $rate: String
    $per: String
    $discount: String
    $amount: String
    $totalAmount: String
    $totalAmountInWords: String
  ) {
    createBuyer(
      input: {
        title: $title
        content: $content
        address: $address
        emailId: $emailId
        contactNo: $contactNo
        invoiceNo: $invoiceNo
        deliveryNote: $deliveryNote
        supplierRef: $supplierRef
        otherRef: $otherRef
        buyersOrderNo: $buyersOrderNo
        dispatchDocumentNo: $dispatchDocumentNo
        deliveryNoteDate: $deliveryNoteDate
        dispatchedThrough: $dispatchedThrough
        destination: $destination
        termsOfDelivery: $termsOfDelivery
        srNo: $srNo
        disriptionOfGoods: $disriptionOfGoods
        modelNo: $modelNo
        sirNo: $sirNo
        hsnsac: $hsnsac
        quantity: $quantity
        rate: $rate
        per: $per
        discount: $discount
        amount: $amount
        totalAmount: $totalAmount
        totalAmountInWords: $totalAmountInWords
      }
    ) {
      _id
      title
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

const BUYERS_QUERY = gql`
  {
    allJdentBuyers {
      _id
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

const CreateInvoice = withRouter(({ history }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('Choose your option');
  const [address, setAddress] = useState('');
  const [emailId, setEmailId] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [supplierRef, setSupplierRef] = useState('');
  const [otherRef, setOtherRef] = useState('');
  const [buyersOrderNo, setBuyersOrderNo] = useState('');
  const [dispatchDocumentNo, setDispatchDocumentNo] = useState('');
  // const [deliveryNoteDate, setDeliveryNoteDate] = useState('');
  const [dispatchedThrough, setDispatchedThrough] = useState('');
  const [destination, setDestination] = useState('');
  const [termsOfDelivery, setTermsOfDelivery] = useState('');
  const [srNo, setSrNo] = useState('');
  const [disriptionOfGoods, setDisriptionOfGoods] = useState('');
  const [modelNo, setModelNo] = useState('');
  const [sirNo, setSerialNo] = useState('');
  const [hsnsac, setHsnsac] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [per, setPer] = useState('');
  const [discount, setDiscount] = useState('');
  const [amount, setAmount] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [totalAmountInWords, setTotalAmountInWords] = useState('');

  //const [deliveryNoteDate, setDeliveryNoteDate] = useState(new Date());
  // const [deliveryNoteDate, onChange] = useState(new Date());
  const [deliveryNoteDate, setStartDate] = useState(new Date());

  function handleChange(value, formattedValue) {
    // this.setState({
    //   value: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
    //   formattedValue: formattedValue, // Formatt ed String, ex: "11/19/2016"
    // });
  }

  // function onChange(nextValue) {
  //   setDeliveryNoteDate(nextValue);
  // }

  const [createBuyer] = useMutation(NEW_INVOICE, {
    update(cache, { data: { createBuyer } }) {
      const { allBuyers } = cache.readQuery({ query: BUYERS_QUERY });

      cache.writeQuery({
        query: NEW_INVOICE,
        data: { allBuyers: allBuyers.concat([createBuyer]) },
      });
    },
  });

  return (
    <div className='container m-t-30'>
      {/* <h1 className="page-title">NEW INVOICE</h1> */}
      <div className='newnote-page m-t-20'>
        <form
          className='newnote-page m-t-50'
          onSubmit={(e) => {
            e.preventDefault();

            createBuyer({
              variables: {
                title,
                content,
                address,
                emailId,
                contactNo,
                date: Date.now,
                invoiceNo,
                deliveryNote,
                supplierRef,
                otherRef,
                buyersOrderNo,
                dispatchDocumentNo,
                deliveryNoteDate,
                dispatchedThrough,
                destination,
                termsOfDelivery,
                srNo,
                disriptionOfGoods,
                modelNo,
                sirNo,
                hsnsac,
                quantity,
                rate,
                per,
                discount,
                amount,
                totalAmount,
                totalAmountInWords,
              },
            });
            history.push('/');
            window.location.reload(false);
          }}
        >
          <div className='columns'>
            <div className='column'>
              <div className='field'>
                <label className='label'>Buyer Name</label>
                <div className='control'>
                  <input
                    className='input'
                    name='title'
                    type='text'
                    placeholder='Buyer Name'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className='field'>
                <label className='label'>Disription Of Goods</label>
                <div className='control'>
                  <input
                    className='input'
                    name='disriptionOfGoods'
                    type='text'
                    placeholder='Disription Of Goods'
                    value={disriptionOfGoods}
                    onChange={(e) => setDisriptionOfGoods(e.target.value)}
                  />
                </div>
              </div>

              <div className='field'>
                <label className='label'>Invoice No.</label>
                <div className='control'>
                  <input
                    className='input'
                    name='srNo'
                    type='number'
                    placeholder='Invoice No'
                    value={srNo}
                    onChange={(e) => setSrNo(e.target.value)}
                  />
                </div>
              </div>

              {/* <div className="field">
                                <label className="label">Total Amount In Words</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        name="totalAmountInWords"
                                        type="text"
                                        placeholder="Total Amount In Words"
                                        value={totalAmountInWords}
                                        onChange={e => setTotalAmountInWords(e.target.value)}
                                    />
                                </div>
                            </div> */}

              {/* <div className="field">
                                <label className="label">Invoice No</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        name="invoiceNo"
                                        type="text"
                                        placeholder="invoiceNo"
                                        value={invoiceNo}
                                        onChange={e => setInvoiceNo(e.target.value)}
                                    />
                                </div>
                            </div> */}
            </div>
            <div className='column'>
              <div className='field'>
                <label className='label'>Address</label>
                <div className='control'>
                  <input
                    className='input'
                    name='address'
                    type='text'
                    placeholder='Address'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className='field'>
                <label className='label'>Model No. </label>
                <div className='control'>
                  <input
                    className='input'
                    name='modelNo'
                    type='text'
                    placeholder='Model No'
                    value={modelNo}
                    onChange={(e) => setModelNo(e.target.value)}
                  />
                </div>
              </div>

              <div className='field'>
                <label className='label'>Mode / Terms of Payment</label>
                <div className='control'>
                  <select
                    name='deliveryNote'
                    className='input'
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                  >
                    <option defaultValue='' >
                      Choose your option
                    </option>
                    <option value='Cash'>Cash</option>
                    <option value='Swipe'>Swipe</option>
                    <option value='Account Transfer by HDFC'>
                      Account Transfer by HDFC
                    </option>
                    <option value='Account Transfer by IDBI'>
                      Account Transfer by IDBI
                    </option>
                    <option value='HDFC BANK LTD'>HDFC BANK LTD</option>
                    <option value='Bajaj Finance'>Bajaj Finance</option>
                    <option value='TVS CREDIT SERVICES LTD'>
                      TVS CREDIT SERVICES LTD
                    </option>
                    <option value='Pine Lab Emi'>Pine Lab Emi</option>
                  </select>
                </div>
              </div>

              {/* <div className="field">
                                <label className="label">DeliveryNote </label>
                                <div className="control">
                                    <input
                                        className="input"
                                        name="deliveryNote"
                                        type="text"
                                        placeholder="Delivery Note"
                                        value={deliveryNote}
                                        onChange={e => setDeliveryNote(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Supplier Ref.</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        name="supplierRef"
                                        type="text"
                                        placeholder="Supplier Ref."
                                        value={supplierRef}
                                        onChange={e => setSupplierRef(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Other Ref </label>
                                <div className="control">
                                    <input
                                        className="input"
                                        name="otherRef"
                                        type="text"
                                        placeholder="Other Ref"
                                        value={otherRef}
                                        onChange={e => setOtherRef(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Buyers Order No.</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        name="buyersOrderNo"
                                        type="text"
                                        placeholder="Buyers Order No."
                                        value={buyersOrderNo}
                                        onChange={e => setBuyersOrderNo(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Dispatch Document No</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        name="dispatchDocumentNo"
                                        type="text"
                                        placeholder="Dispatch Document No"
                                        value={dispatchDocumentNo}
                                        onChange={e => setDispatchDocumentNo(e.target.value)}
                                    />
                                </div>
                            </div>
                           */}
            </div>
            <div className='column'>
              <div className='field'>
                <label className='label'>Contact No </label>
                <div className='control'>
                  <input
                    className='input'
                    name='contactNo'
                    type='text'
                    placeholder='Contact No'
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                  />
                </div>
              </div>

              <div className='field'>
                <label className='label'>SIR No.</label>
                <div className='control'>
                  <input
                    className='input'
                    name='sirNo'
                    type='text'
                    placeholder='SIR No'
                    value={sirNo}
                    onChange={(e) => setSerialNo(e.target.value)}
                  />
                </div>
              </div>

              <div className='field'>
                <label className='label'>GST Percentage %</label>
                <div className='control'>
                  <select
                    name='content'
                    className='input'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  >
                    <option defaultValue='' >
                      Choose your option
                    </option>
                    <option value='5'>5 %</option>
                    <option value='18'>18 %</option>
                    <option value='28'>28 %</option>
                  </select>
                </div>
              </div>

              {/*          <div className="field">
                                <label className="label">Dispatched Through </label>
                                <div className="control">
                                    <input
                                        className="input"
                                        name="dispatchedThrough"
                                        type="text"
                                        placeholder="Dispatched Through"
                                        value={dispatchedThrough}
                                        onChange={e => setDispatchedThrough(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Destination </label>
                                <div className="control">
                                    <input
                                        className="input"
                                        name="destination"
                                        type="text"
                                        placeholder="Destination"
                                        value={destination}
                                        onChange={e => setDestination(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Terms Of Delivery</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        name="termsOfDelivery"
                                        type="text"
                                        placeholder="Terms Of Delivery"
                                        value={termsOfDelivery}
                                        onChange={e => setTermsOfDelivery(e.target.value)}
                                    />
                                </div>
                            </div> */}
            </div>
            <div className='column'>
              <div className='field'>
                <label className='label'>Email Id</label>
                <div className='control'>
                  <input
                    className='input'
                    name='emailId'
                    type='text'
                    placeholder='Email Id'
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                  />
                </div>
              </div>

              <div className='field'>
                <label className='label'>Total Amount</label>
                <div className='control'>
                  <input
                    className='input'
                    name='totalAmount'
                    type='number'
                    placeholder='Total Amount'
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className='field'>
                <label className='label'> Date</label>
                <div className='control'>
                  <DatePicker
                    className='input'
                    dateFormat="dd/MM/yyyy"
                    selected={deliveryNoteDate}
                    showMonthDropdown={true}
                    showYearDropdown={true}
                    scrollableYearDropdown={true}
                    onChange={(date) => setStartDate(date)}
                  />
                </div>
              </div>

              {/* <div className="field">
                                <label className="label">&nbsp;</label>
                                <div className="control">
                                <button class="button is-link is-large is-fullwidth" >Submit</button>
                                   
                                </div>
                            </div> */}

              <div className="field">
                                <label className="label">HSN/SAC</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        name="hsnsac"
                                        type="text"
                                        placeholder="HSN/SAC"
                                        value={hsnsac}
                                        onChange={e => setHsnsac(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/*
                            <div className="field">
                                <label className="label">Quantity</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        name="quantity"
                                        type="number"
                                        placeholder="Quantity"
                                        value={quantity}
                                        onChange={e => setQuantity(e.target.value)}
                                    />
                                </div>
                            </div> */}
              {/* 
                    <div className="field">
                        <label className="label">Rate</label>
                        <div className="control">
                            <input
                                className="input"
                                name="rate"
                                type="number"
                                placeholder="Rate"
                                value={rate}
                                onChange={e => setRate(e.target.value)}
                            />
                        </div>
                    </div> */}
              {/* <div className="field">
                                <label className="label">Per</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        name="per"
                                        type="number"
                                        placeholder="Per"
                                        value={per}
                                        onChange={e => setPer(e.target.value)}
                                    />
                                </div>
                            </div> */}
            </div>

            {/* <div class="column"> */}

            {/* <div className="field">
                                <label className="label">Discount</label>
                                <div className="control">
                                    <input
                                        className="input"
                                        name="discount"
                                        type="text"
                                        placeholder="discount"
                                        value={discount}
                                        onChange={e => setDiscount(e.target.value)}
                                    />
                                </div>
                            </div> */}

            {/* <div className="field">
                        <label className="label">Amount</label>
                        <div className="control">
                            <input
                                className="input"
                                name="amount"
                                type="number"
                                placeholder="amount"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />
                        </div>
                    </div> */}

            {/* </div> */}
          </div>
          <div className='field'>
            <label className='label'>&nbsp;</label>
            <div className='control-button'>
              <button className='button is-link is-large'>Submit</button>
              {/* <button className="button is-link"></button> */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

export default CreateInvoice;
