// const Product = require('../models/product');
// const Order = require('../models/order');

exports.getAbout = (req, res, next) => {
    return res.render('pages/mad/about-us', {
        title: 'About Us',
        path: '/about'
    });
};

exports.getContact = (req, res, next) => {
    return res.render('pages/mad/contact', {
        title: 'Contact',
        path: '/contact'
    });
};

exports.getActivities = (req, res, next) => {
    return res.render('pages/mad/activities', {
        title: 'Activities',
        path: '/activities'
    });
};

exports.getMotivation = (req, res, next) => {
    return res.render('pages/mad/motivation', {
        title: 'Motivation',
        path: '/motivation'
    });
};