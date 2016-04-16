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
      _.bindAll(this, "render", "addOne", "addAll");
      this.listenTo(this.collection, 'add', this.addOne);
      this.listenTo(this.collection, 'update', this.render);
      this.listenTo(this.collection, 'reset', this.addAll);
      this.listenTo(this.collection, 'sync', this.addAll);
      this.collection.fetch();
    },

    render: function () {
      this.$el.html('');

      var view = new PageView();
      this.collection.each(function(model) {
        view.model = model;
        this.$el.html(view.render().el);
      }, this);

      return this;
    },

    addOne: function(model) {
      this.collection.add(model, { silent: true });
    },

    addAll: function (collection) {
      collection.each(this.addOne, this);
    },

  });

  var PageDetailView = Backbone.View.extend({
    el: $('#main'),

    initialize: function() {
      _.bindAll(this, "render");
      this.listenTo(this.model, 'sync', this.render);
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
      this.pages      = new Pages();
      this.pagesView  = new PagesView({collection: this.pages});
      this.pageView   = new PageDetailView();
    },

    index: function() {
      if(this.pages.length)
        this.pagesView.render();
    },

    show: function (id) {
      this.pageView.model = this.pages.get(id);
      if(this.pageView.model) {
        this.pageView.render();
      }
    },

    edit: function (id) {
    },

    create: function () {
    }
  });

  var router = new Router();
  Backbone.history.start({ pushState: true });
})();
