var Category = require('../models/Category');

// Get all Categories
exports.getIndex = function (req, res) {
    Category.find({type: req.params.type},
        function (err, data) {
            // In case of any error, return using the done method
            if (err)
                return done(err);
            
            // Post category does not exist, log error & redirect back
            res.render('category/index', {
                title: 'Categories',
                data: data,
                test:"lo van kien"
            });
        }
    );
};

exports.getCreate = function (req, res) {
    res.render('category/create', {
        title: 'Create New Category'
    });
};

exports.postCreate = function (req, res) {
    var newCategory = new Category();
    // set the user's local credentials
    newCategory.name = req.body.name;
    newCategory.icon = req.body.icon;
    newCategory.parent_id = req.body.parent_id ? req.body.parent_id : null;
    newCategory.type = req.body.type;
    newCategory.status = 1;

    // save the user
    newCategory.save(function (err) {
        if (err) {
            console.log('Error in Saving: ' + err);
            res.send({"result": false});
        }
        res.redirect('/category/' + newCategory.type);
    });
};

exports.deleteCategory = function(req,res){
     console.log("req",req.body.id);
   Category.findByIdAndRemove(req.body.id,function(err,result){
       if(err)
        return done(err);
        res.redirect('/category/' + 1);
   })

}
