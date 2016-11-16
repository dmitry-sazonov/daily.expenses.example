var log = require("libs/log")(module);

var handlers = require("./handlers");
var auth = require("middleware/auth");

module.exports = function(app) {
    
    app.get("*", function(req, res, next) {
        log.info("GET <", req.url, ">");
        next();
    });

    app.post("*", function(req, res, next) {
        log.info("POST <", req.url, ">");
        next();
    });
    
    app.get("/checkAuth", auth.checkAuth);

    app.post("/signIn", handlers.login.signIn);
    app.post("/signUp", handlers.login.signUp);
    app.post("/signOut", handlers.login.signOut);

    app.post("/api/records/add", auth.checkAuth, handlers.addRecord);
    app.post("/api/records/update/:record_id", auth.checkAuth, handlers.updateRecord);
    app.post("/api/records/moveToCategory/:category_id", auth.checkAuth, handlers.moveRecords);
    app.get("/api/records/get/categoryIds", auth.checkAuth, handlers.getRecordsByCategoryIds);
    app.get("/api/records/get/betweenTimestamps/:firstTimestamp/:secondTimestamp", auth.checkAuth, handlers.getRecordsBetweenTimestamps); 

    app.post("/api/categories/:type/add", auth.checkAuth, handlers.addCategory);
    app.post("/api/categories/update/:category_id", auth.checkAuth, handlers.updateCategory);
    app.post("/api/categories/update/:category_id/plan", auth.checkAuth, handlers.updateCategoryPlan);
    app.delete("/api/categories/delete/:category_id", auth.checkAuth, handlers.deleteCategory);
    app.get("/api/categories/:type/get", auth.checkAuth, handlers.getCategories);
    
    app.post("/api/debts/:type/add", auth.checkAuth, handlers.addDebt);
    app.get("/api/debts/:type/get", auth.checkAuth, handlers.getDebts);
    app.post("/api/debts/update", auth.checkAuth, handlers.updateDebt);
    app.post("/api/debts/:id/addPayment", auth.checkAuth, handlers.addPaymentDebt);
    
    app.get('/templates/:template', function (req, res) {
        
        var name = req.params.template;
        res.render("templates/" + name);
        
    });
    
    app.get('/templates/directives/:template', function (req, res) {

        var name = req.params.template;
        res.render("templates/directives/" + name);

    });

    app.get('/modals/:modal', function (req, res) {
        
        var name = req.params.modal;
        res.render("modals/" + name);
        
    });
    
    app.get('*', function (req, res) {

        log.info("request <", req.url, ">");

        if (req.session.user_id) {
            res.cookie("user_id", req.session.user_id);
            res.cookie("login", req.session.login);
        }

        res.render('index');

    });

};