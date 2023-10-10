const Contact = require("../models/contact.model");
const mongoose = require("mongoose");

module.exports.addContact = async (req, res, next) => {
    console.log(req.body, "req.body");
    const { username, mobile, email, userId } = req.body;

    if (username.trim().length < 3) {
        return res.json({
            success: false,
            message: "username length minimum 3 required"
        });
    }

    if (mobile.trim().length < 10) {
        return res.json({
            success: false,
            message: "mobile length minimum 10 required"
        });
    }

    if (email.trim().length === 0 || !email.match(/^(?=[^@]*[A-Za-z])([a-zA-Z0-9])(([a-zA-Z0-9])*([\._-])?([a-zA-Z0-9]))*@(([a-zA-Z0-9\-])+(\.))+([a-zA-Z]{2,4})+$/i)) {
        return res.json({
            success: false,
            message: "Invalid Email [only alphanumeric allowed]"
        });
    }

    try {
        const contact = await Contact.create({ username, mobile, email, userId });
        console.log(contact, "contact added");
        res.json({
            success: true,
            message: "User added successfully",
            contact
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
}

module.exports.getAllContacts = async (req, res, next) => {
    const { userId } = req.body;
    console.log(userId, req.body, "req.body");
    try {
        const contacts = await Contact.find({ userId: userId });
        console.log(contacts, "contacts");
        return res.json({
            success: true,
            message: contacts
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}


module.exports.deleteContact = async (req, res, next) => {
    const { contactId } = req.body;
    console.log(contactId, "contactId to delete");
    try {
        Contact.findOneAndRemove({ _id: contactId }).then(contact => {
            if (!contact) {
                res.status(400).send({
                    success: false,
                    message: 'Contact was not found'
                });
            } else {
                res.status(200).send({
                    success: true, message: 'Contact deleted'
                });
            }
        }).catch((err) => {
            console.error(err);
            res.status(500).send({
                success: false,
                message: 'Error: ' + err.message
            });
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

module.exports.updateContact = async (req, res, next) => {
    const { id, username } = req.body;
    console.log(id, username, "update");
    try {
        Contact.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { username: username }).then((result) => {
            console.log(result);
            return res.json({
                success: true,
                message: "user updated successfully"
            })
        }).catch(error => {
            return res.json({
                success: false,
                message: error.message
            })
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}
