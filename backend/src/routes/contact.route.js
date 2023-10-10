const router = require("express").Router();

const {
    addContact,
    getAllContacts,
    deleteContact,
    updateContact
} = require("../controllers/contact.controller");

router.post("/add-contact", addContact);
router.post("/all-contacts", getAllContacts);
router.post("/delete-contact", deleteContact);
router.post("/update-contact", updateContact);

module.exports = router;
