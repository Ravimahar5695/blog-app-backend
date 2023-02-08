const Category = require("../models/category");
const { validationResult } = require('express-validator');

exports.getCategoryById = (req, res, next, id) => {
    Category.findOne({_id: id}, (err, category) => {
        if(err){
            res.json({
                error: "Unknown error"
            });
        } else{
            if(!category){
                res.json({
                    error: "No category found"
                });
            } else{
                req.category = category;
                next();
            }
        }
    });
}

exports.getCategory = (req, res) => {
    res.json(req.category);
}

exports.getAllCategory = (req, res) => {
    Category.find((err, categories) => {
        if(err){
            res.json({
                error: "Unknown error"
            });
        } else{
            if(!categories){
                res.json({
                    error: "No category found"
                });
            } else{
                res.json(categories);
            }
        }
    });
}

exports.createCategory = (req, res) => {
    const errors = validationResult(req);
    const {name} = req.body;
    if(!errors.isEmpty()){
        res.json({
            error: errors.array()[0].msg
        });
    } else{
        const newCategory = new Category({name});
        newCategory.save((err, category) => {
            if(err){
                res.json({
                    error: "Unknown error. Please try after some time"
                });
            } else{
                res.json(category);
            }
        })
    }
}

exports.updateCategory = (req, res) => {
    Category.findOneAndUpdate({_id: req.category._id}, {$set: {name: req.body.name}}, {new: true}, (err, updatedCategory) => {
        if(err){
            res.json({
                error: "Unknown error. Please try after some time"
            });
        } else{
            res.json(updatedCategory);
        }
    });
}

exports.deleteCategory = (req, res) => {
    Category.findOneAndRemove({_id: req.category._id}, (err, success) => {
        if(err){
            res.json({
                error: "Unknown error. Please try after some time"
            });
        } else{
            res.json({
                message: "Category deleted successfully"
            });
        }
    });
}