(function() {
  console.log("Hello Backbone.js");

  var Model = Backbone.Model.extend({
    defaults: {
      "title": '',
    },
    initialize: function() {
      console.log("Model");
    }
  });

  var model = new Model();
  model.set({title: "first"});

  console.log(model);
})();
