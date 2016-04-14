(function() {
  var Page = Backbone.Model.extend({
    defaults: function() {
      return {
        id       : '',
        title    : '',
        content  : ''
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
    url   : "/pages",
  });

  var PageView = Backbone.View.extend({
    tagName: 'ul',

    template: _.template($('#pages-template').html()),

    events: {
      "click .list-items": "showPageDetail"
    },

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    },

    showPageDetail: function() {
      router.navigate("page/" + this.model.id, true);
      return false;
    }
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

      return this;
    },

    appendItem: function(model) {
      var view = new PageView({ model: model });
      this.$el.html(view.render().el);
    },

    resetItems: function (collection) {
      console.log(collection);
      collection.each(function(model) {
        this.appendItem(model);
      }, this);
    },

  });

  var PageDetailView = Backbone.View.extend({
    el: $('#main'),

    initialize: function() {
      _.bindAll(this, "render");
      this.listenTo(this.model, 'sync', this.render);
      this.model.fetch();
    },

    template: _.template($('#page-template').html()),

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    },
  })

  var HeaderView = Backbone.View.extend({
    events: {
      "click .to_root": "home",
      "click #create" : "onCreate",
      "click #edit"   : "onEdit"
    },
    home: function() {
      router.navigate("", { trigger: true });
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
      console.log(this.pages.length);
      var view = new PagesView({collection: this.pages});
    },

    show: function (id) {
      var view = new PageDetailView({ model: this.pages.get(id) });
    },

    edit: function (id) {
    },

    create: function () {
    }
  });

  var router = new Router();
  Backbone.history.start({ pushState: true });
})();
