import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';

const typeDefs = `
 type Note {
  _id: ID!
  title: String!,
  date: Date,
  content: String!
 }

 type Entry{
  _id: ID!,
  date: Date,
  vehicle: String!,
  startTime: String!,
  stopTime: String!,
  totalHour: String!,
  vbd: String!,
  dailyDiesel: String!,
  purchaseDiesel: String!,
  advance: String!,
  discription: String!,
  opName: String!,
  attendance: String!
}

type JdentBuyer {
  _id: ID!
  title: String!,
  date: Date,
  content: String,
  address: String,
  emailId: String,
  contactNo:String,
  invoiceNo:String,
  deliveryNote:String,
  supplierRef:String,
  otherRef:String,
  buyersOrderNo:String,
  dispatchDocumentNo:String,
  deliveryNoteDate:String,
  dispatchedThrough:String,
  destination:String,
  termsOfDelivery:String,
  srNo:String,
  disriptionOfGoods:String,
  sirNo:String,
  modelNo:String,
  hsnsac:String,
  quantity:String,
  rate:String,
  per:String,
  discount:String,
  amount:String,
  totalAmount:String,
  totalAmountInWords:String
 }

 input JdentBuyerInput {
  title: String!,
  content: String,
  address: String,
  emailId: String,
  contactNo:String
  invoiceNo:String,
  deliveryNote:String,
  supplierRef:String,
  otherRef:String,
  buyersOrderNo:String,
  dispatchDocumentNo:String,
  deliveryNoteDate:String,
  dispatchedThrough:String,
  destination:String,
  termsOfDelivery:String,
  srNo:String,
  disriptionOfGoods:String,
  sirNo:String,
  modelNo:String,
  hsnsac:String,
  quantity:String,
  rate:String,
  per:String,
  discount:String,
  amount:String,
  totalAmount:String,
  totalAmountInWords:String
}

 input JdentBuyerUpdateInput {
  title: String
  content: String
  address: String
  emailId: String
  contactNo:String
  invoiceNo:String
  deliveryNote:String
  supplierRef:String
  otherRef:String
  buyersOrderNo:String
  dispatchDocumentNo:String
  deliveryNoteDate:String
  dispatchedThrough:String
  destination:String
  termsOfDelivery:String
  srNo:String
  disriptionOfGoods:String
  sirNo:String
  modelNo:String
  hsnsac:String
  quantity:String
  rate:String
  per:String
  discount:String
  amount:String
  totalAmount:String
  totalAmountInWords:String
 }


 scalar Date

 type TransportStatus {
  provider: String!
  configured: Boolean!
  detail: String
 }

 type Query {
  getNote(_id: ID!): Note
  allNotes: [Note]
  getEntry(_id: ID!): Entry
  allEntries: [Entry]
  getJdentBuyer(_id: ID!): JdentBuyer
  allJdentBuyers: [JdentBuyer]
  transportStatus: TransportStatus
 }

 input NoteInput {
 	title: String!
   content: String!
 }

 input NoteUpdateInput {
  title: String
  content: String
 }

 input EntryInput {
  vehicle: String
  startTime: String
  stopTime: String
  totalHour: String
  vbd: String
  dailyDiesel: String
  purchaseDiesel: String
  advance: String
  discription: String
  opName: String
  attendance: String
}

input EntryUpdateInput {
  vehicle: String
  startTime: String
  stopTime: String
  totalHour: String
  vbd: String
  dailyDiesel: String
  purchaseDiesel: String
  advance: String
  discription: String
  opName: String
  attendance: String
 }


 type EmailResponse {
  success: Boolean!
  message: String
 }

 type Mutation {
  createNote(input: NoteInput) : Note
  updateNote(_id: ID!, input: NoteUpdateInput): Note
  deleteNote(_id: ID!) : Note
  createEntry(input: EntryInput) : Entry
  updateEntry(_id: ID!, input: EntryUpdateInput): Entry
  deleteEntry(_id: ID!) : Entry
  createBuyer(input: JdentBuyerInput) : JdentBuyer
  updateBuyer(_id: ID!, input: JdentBuyerUpdateInput): JdentBuyer
  deleteBuyer(_id: ID!) : JdentBuyer
  sendMail(to: String!, from: String!, subject: String!, body: String!, invoiceId: ID, attachInvoice: Boolean): EmailResponse
 }

`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
