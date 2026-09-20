import api from "./api";

// ===============================
// GET ALL CONTACTS
// ===============================

export const getContacts = () => {
  return api.get("/contacts");
};


// ===============================
// GET SINGLE CONTACT
// ===============================

export const getContactById = (id) => {
  return api.get(`/contacts/${id}`);
};


// ===============================
// UPDATE CONTACT STATUS
// ===============================

export const updateContactStatus = (id, status) => {
  return api.patch(`/contacts/${id}/status`, {
    status,
  });
};


// ===============================
// DELETE CONTACT
// ===============================

export const deleteContact = (id) => {
  return api.delete(`/contacts/${id}`);
};


// ===============================
// REPLY TO CONTACT
// ===============================

export const replyToContact = (id, replyMessage) => {
  return api.post(`/contacts/${id}/reply`, {
    message: replyMessage,
  });
};