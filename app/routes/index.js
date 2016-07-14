'use strict';

module.exports = function (app, db) {
  
  app.route("/")
    .get(function (req, res) {
       res.sendFile(process.cwd() + "/public/index.html"); 
    })
    
    .post(function (req, res) {
      var companies = db.collection("companies");
      companies.find().toArray(function (err, docs) {
        console.log(JSON.stringify(docs));
        res.send(docs);
      });
    });
    
    
  app.post("/update", function (req, res) {
      var list = JSON.parse(req.body.list);
      console.log(list);
      var companies = db.collection("companies");
      companies.update({_id: 1}, {list: list}, {upsert: true});
      res.send("ok");
  });
    
};