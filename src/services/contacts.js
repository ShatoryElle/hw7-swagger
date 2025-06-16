import Contact from '../db/models/contact.js';

const getAllContacts = async (
  userId,
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
) => {
  const { contactType, isFavourite } = filter;

  const query = { userId };
  if (contactType) query.contactType = contactType;
  if (isFavourite !== null) query.isFavourite = isFavourite;

  const totalItems = await Contact.countDocuments(query);
  const contacts = await Contact.find(query)
    .sort({ [sortBy]: sortOrder })
    .skip((page - 1) * perPage)
    .limit(perPage);

  return { contacts, totalItems };
};

const getContactById = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId });
};

const createContact = async (contactData) => {
  const newContact = await Contact.create(contactData);

  return newContact.toObject();
};

const updateContactById = async (contactId, userId, updateData) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    {
      new: true,
    },
  ).lean();

  return updatedContact;
};

const deleteContactById = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};

export default {
  getAllContacts,
  getContactById,
  createContact,
  updateContactById,
  deleteContactById,
};