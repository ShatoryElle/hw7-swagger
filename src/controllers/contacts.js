import createError from 'http-errors';
import contactsService from '../services/contacts.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';
import parseSortParams from '../utils/parsSortParams.js';
import parseFilterParams from '../utils/parseFilterParams.js';
import saveFileToUploadDir from '../utils/saveFileToUploadDir.js';
import saveFileToCloudinary from '../utils/saveFileToCloudinary.js';
import fs from 'fs/promises';

const getContacts = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const { contacts, totalItems } = await contactsService.getAllContacts(
    req.user._id,
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  );

  const message = contacts.length
    ? 'Successfully found contacts!'
    : 'No contacts found for the requested page';

  const paginationData = calculatePaginationData({
    page,
    perPage,
    totalItems,
    data: contacts,
  });

  res.json({
    status: 200,
    message,
    data: paginationData,
  });
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.getContactById(contactId, req.user._id);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully retrieved contact',
    data: contact,
  });
};

const createContact = async (req, res) => {
  let photoUrl = null;

  if (req.file) {
    if (process.env.UPLOAD_TO_CLOUDINARY === 'true') {
      photoUrl = await saveFileToCloudinary(req.file);
    } else {
      photoUrl = await saveFileToUploadDir(req.file);
    }

    if (photoUrl) {
      photoUrl = photoUrl.replace(/\\/g, '/');
    }
  }

  const newContact = await contactsService.createContact({
    ...req.body,
    userId: req.user._id,
    photo: photoUrl,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: {
      ...newContact,
      photo: photoUrl || null,
    },
  });
};

const patchContact = async (req, res) => {
  const { contactId } = req.params;
  let photoUrl = null;

  if (req.file) {
    if (process.env.UPLOAD_TO_CLOUDINARY === 'true') {
      photoUrl = await saveFileToCloudinary(req.file);
    } else {
      photoUrl = await saveFileToUploadDir(req.file);
    }

    if (photoUrl) {
      photoUrl = photoUrl.replace(/\\/g, '/');
    }

    if (
      process.env.UPLOAD_TO_CLOUDINARY === 'true' &&
      req.file &&
      req.file.path
    ) {
      try {
        await fs.access(req.file.path);
        await fs.unlink(req.file.path);
      } catch (err) {
        console.error(`Error deleting file from tmp: ${err.message}`);
      }
    }
  }

  const updatedContact = await contactsService.updateContactById(
    contactId,
    req.user._id,
    {
      ...req.body,
      ...(photoUrl ? { photo: photoUrl } : {}),
    },
  );

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully updated a contact!',
    data: {
      ...updatedContact,
      photo: photoUrl || updatedContact.photo || null,
    },
  });
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await contactsService.deleteContactById(
    contactId,
    req.user._id,
  );

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).end();
};

export default {
  getContacts,
  getContactById,
  createContact,
  patchContact,
  deleteContact,
};