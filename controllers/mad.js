const Activity = require('../models/activity');
const User = require('../models/user');
var nodemailer = require('nodemailer');


exports.getContact = (req, res, next) => {
    return res.render('pages/mad/contact', {
        title: 'C9FL | Contact',
        path: '/contact'
    });
};

exports.getMotivation = (req, res, next) => {
    return res.render('pages/mad/motivation', {
        title: 'C9FL | Motivation',
        path: '/motivation'
    });
};

exports.getActivities = (req, res, next) => {
    Activity.find()
        .then(activities => {
            console.log('Activitiess: ' + activities);
            res.render('pages/mad/activities', {
                acts: activities,
                title: 'C9FL | Activities',
                path: '/activities'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getActivity = (req, res, next) => {
    const actId = req.params.activityId;
    Activity.findById(actId)
        .then(activity => {
            res.render('pages/mad/activity-detail', {
                activity: activity,
                title: 'C9FL | ' + activity.title,
                path: '/activities'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getIndex = (req, res, next) => {
    Activity.find()
        .then(activities => {
            res.render('pages/mad/activities', {
                title: 'C9FL | Activities',
                acts: activities,
                path: '/activities'
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postBucket = (req, res, next) => {
    const actId = req.body.activityId;
    Activity.findById(actId)
        .then(activity => {
            return req.user.addToBucket(activity);
        })
        .then(result => {
            console.log('Postbucket result: ' + result);
            res.redirect('activities');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postBucketDeleteActivity = (req, res, next) => {
    const actId = req.body.activityId;
    req.user
        .removeFromBucket(actId)
        .then(result => {
            res.redirect('dashboard');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postToDoDeleteActivity = (req, res, next) => {
    const actId = req.body.activityId;
    req.user
        .removeFromBucket(actId)
        .then(result => {
            res.redirect('dashboard');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

//Using this for the to-do list and the activities
exports.getDashboard = (req, res, next) => {
    req.user
        .populate('bucket.items.activityId')
        .populate('toDoList.toDos.toDoId')
        .execPopulate()
        .then(user => {
            const activities = user.bucket.items;
            res.render('pages/mad/dashboard', {
                path: '/dashboard',
                title: 'C9FL | Dashboard',
                toDos: user.toDoList.toDos,
                activities: activities
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postToDo = (req, res, next) => {
    const toDoId = req.body.activityId;
    req.user.addToToDo(toDoId)
        .then(() => {
            return req.user.removeFromBucket(toDoId);
        })
        .then(() => {
            res.redirect('dashboard');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postToDoDelete = (req, res, next) => {
    const toDoId = req.body.toDoId;
    req.user.removeFromToDo(toDoId)
        .then(result => {
            res.redirect('dashboard');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postUserIdea = (req, res, next) => {
    const ideaName = req.body.ideaName;
    const ideaDesc = req.body.ideaDesc;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'myc9forlife@gmail.com',
            pass: 'CnineForLife'
        }
    });
    const mailOptions = {
        from: req.body.userEmail,
        to: 'myc9forlife@gmail.com',
        subject: 'Activity idea',
        html: `
            <h5>Hello, can you please add this activity to the list?</5>
            <p>Name: ${ideaName}</p>
            <p>Description: ${ideaDesc}</p>
          `
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    return res.redirect('activities');
    console.log(ideaDesc + ' ' + ideaName)
}