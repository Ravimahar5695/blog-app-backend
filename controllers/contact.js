const Contact = require("../models/contact");
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

exports.contact = (req, res) => {
    try {
        const {name, email, message} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({
                error: errors.array()[0].msg
            });
        } else {
            const newContact = new Contact({
                name, email, message
            });
            newContact.save((err, contact) => {
                if(err){
                    res.json({
                        error: "Not able to submit your response. Please try after some time"
                    });
                } else{
                    res.json(contact);
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: 'ravimahar5695@gmail.com',
                          pass: 'ttdgkjtetfrzbgln'
                        }
                    });
                    var mailOptions = {
                        from: 'ravimahar5695@gmail.com',
                        to: 'ravivermarsnr@gmail.com',
                        subject: 'Message from Blog App',
                        text: `${contact.name} wants to contact you`
                    };
                    transporter.sendMail(mailOptions);
                }
            });
        }
    } catch (error) {
        res.json({
            error: error.message
        });
    }
}

exports.getAllContacts = (req, res) => {
    Contact.find().sort({_id: -1}).exec((err, contacts) => {
        if(err){
            res.json({
                error: "Not found"
            });
        } else{
            res.json(contacts);
        }
    });
}

exports.deleteContact = (req, res) => {
    Contact.findByIdAndDelete({_id: req.params.contactId}, (err, deletedContact) => {
        if(err){
            res.json({
                error: "Error deleting contact request"
            });
        } else{
            res.json(deletedContact)
        }
    });
}