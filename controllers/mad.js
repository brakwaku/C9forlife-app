const Activity = require('../models/activity');
const ToDo = require('../models/toDo');


exports.getContact = (req, res, next) => {
    return res.render('pages/mad/contact', {
        title: 'Contact',
        path: '/contact'
    });
};

exports.getMotivation = (req, res, next) => {
    return res.render('pages/mad/motivation', {
        title: 'Motivation',
        path: '/motivation'
    });
};

exports.getActivities = (req, res, next) => {
    Activity.find()
        .then(activities => {
            console.log('Activitiess: ' + activities);
            res.render('pages/mad/activities', {
                acts: activities,
                title: 'Activities',
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
                title: activity.title,
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

// exports.getBucket = (req, res, next) => {
//     req.user
//         .populate('bucket.items.activityId')
//         .execPopulate()
//         .then(user => {
//             const activities = user.bucket.items;
//             res.render('pages/mad/dashboard', {
//                 path: '/dashboard',
//                 title: 'Your Dashboard',
//                 activities: activities
//             });
//         })
//         .catch(err => {
//             const error = new Error(err);
//             error.httpStatusCode = 500;
//             return next(error);
//         });
// };

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
        .execPopulate()
        .then(user => {
            const activities = user.bucket.items;
            ToDo.find({ 'user.userId': req.user._id })
                .populate('activities')
                .then(toDos => {
                    res.render('pages/mad/dashboard', {
                        path: '/dashboard',
                        title: 'Dashboard',
                        toDos: toDos,
                        activities: activities
                    });
                })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postToDo = (req, res, next) => {
    req.user
        .populate('bucket.items.activityId')
        .execPopulate()
        .then(user => {
            const activities = user.bucket.items.map(i => {
                return i.activityId._doc;
            });
            const toDo = new ToDo({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                activities: activities
            });
            return toDo.save();
        })
        .then(result => {
            return req.user.clearBucket();
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
// exports.postToDo = (req, res, next) => {
//     const toDoId = req.body.activityId;
//     req.user
//         .populate('bucket.items.activityId')
//         .execPopulate()
//         .then(user => {
//             const activities = user.bucket.items._id;
//             // map(i => {
//             //     return i.activityId._doc;
//             // });
//             const toDo = new ToDo({
//                 user: {
//                     name: req.user.name,
//                     userId: req.user
//                 },
//                 activities: activities
//             });
//             return toDo.save();
//         })
//         .then(todo => todo.addToToDo(toDoId))
//         // .then(result => {
//         //     return req.user.clearBucket();
//         // })
//         .then(() => {
//             res.redirect('dashboard');
//         })
//         .catch(err => {
//             const error = new Error(err);
//             error.httpStatusCode = 500;
//             return next(error);
//         });
// };

exports.postToDoDelete = (req, res, next) => {
    const toDoId = req.body.toDoId;
    const activityId = req.body.activityId;
    ToDo.findById(toDoId)
        .then(todo => todo.removeToDo(activityId))
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
    res.redirect('dashboard');
    console.log(ideaDesc + ' ' + ideaName)
}

// exports.getToDos = (req, res, next) => {
//     ToDo.find({ 'user.userId': req.user._id })
//         .then(toDos => {
//             res.render('pages/mad/dashboard', {
//                 path: '/dashboard',
//                 title: 'Dashboard',
//                 toDos: toDos
//             });
//         })
//         .catch(err => {
//             const error = new Error(err);
//             error.httpStatusCode = 500;
//             return next(error);
//         });
// };