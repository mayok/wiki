(function() {
  var Page = Backbone.Model.extend({
    defaults: function() {
      return {
        title    : "title",
        //tag      : "",
        content  : ""
      };
    },

    validate: function (attributes) {
      if(attributes.title === "") {
        return "title must not be empty.";
      }
    }
  });

  var Pages = Backbone.Collection.extend({
    model : Page,
    url   : "/pages.json",

    // parse: function (res) {
    //   if(res.error) {
    //     console.log("PagesCollection: "+ res.error.message);
    //   }
    //   return res.list;
    // }
  });

  var PageView = Backbone.View.extend({
    tagName: 'ul',

    template: _.template($('#pages-template').html()),

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    },
  })

  var PagesView = Backbone.View.extend({
    el: $('#main'),

    initialize: function () {
      _.bindAll(this, "render", "appendItem", "resetItems");
      this.listenTo(this.collection, 'add', this.appendItem);
      this.listenTo(this.collection, 'reset', this.resetItems);
      this.listenTo(this.collection, 'sync', this.render);
      this.collection.fetch();
    },

    render: function () {
      _(this.collection).each(function (model) {
        this.collection.add(model);
      }, this);
    },

    appendItem: function(model) {
      var view = new PageView({ model: model });
      this.$el.html(view.render().el);
    },

    resetItems: function (collection) {
      collection.each(function(model) {
        this.appendItem(model);
      }, this);
    },

    error: function () {
      console.log("error: PagesView");
    },
  });

  var HeaderView = Backbone.View.extend({
    events: {
      "click #create" : "onCreate",
      "click #edit"   : "onEdit"
    },
    onCreate: function () {
      router.navigate("create", { trigger: true });
    },
    onEdit: function () {
      router.navigate("edit", { trigger: true });
    },

  });

  var Router = Backbone.Router.extend({
    routes: {
      ''         : 'index',
      'page/:id' : 'show',
      'edit/:id' : 'edit',
      'create'   : 'create',
    },
    initialize: function () {
      this.headerview = new HeaderView({ el: $('#header') });
      this.pages = new Pages();
    },

    index: function() {
      var view = new PagesView({collection: this.pages});
    },

    show: function (id) {
    },

    edit: function (id) {
    },

    create: function () {
    }
  });

  var router = new Router();
  Backbone.history.start();
})();
