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
      router.navigate("page/" + this.model.id, { trigger: true });
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
      //this.listenTo(this.collection, 'sync', this.addAll);
      this.collection.fetch();
    },

    render: function () {
      this.$el.html('');

      this.collection.each(function(model) {
        var view = new PageView({ model: model });
        this.$el.append(view.render().el);
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
      this.model.fetch();
    },

    template: _.template($('#page-template').html()),

    render: function () {
      this.$el.html(this.template(this.model.attributes));
      return this;
    },
  })

  var EditView = Backbone.View.extend({
    el: $('#main'),

    initialize: function() {
      _.bindAll(this, "render", "markdownize");
    },

    events: {
      "keyup": "markdownize"
    },

    template: _.template($('#edit-template').html()),

    render: function() {
      this.$el.html(this.template(this.model.attributes));
      this.markdownize();
      return this;
    },
    markdownize: function() {
      this.$('#preview').html(this.model.get("content"));
    }
  });

  var HeaderView = Backbone.View.extend({
    el: $('#header'),

    initialize: function() {
      _.bindAll(this, "isPage");
      this.isPage(false);
    },
    events: {
      "click .to_root": "home",
      "click #new"    : "onNew",
      "click #edit"   : "onEdit"
    },
    home: function() {
      this.isPage(false);
      router.navigate("", { trigger: true });
    },
    onNew: function () {
      this.isPage(false);
      router.navigate("new", { trigger: true });
    },
    onEdit: function (evt) {
      this.isPage(false);
      router.navigate("edit/"+ evt.which , { trigger: true });
    },

    isPage: function(condition) {
      var el = this.$('#edit');
      condition ? el.show() : el.hide();
    }

  });

  var Router = Backbone.Router.extend({
    routes: {
      ''         : 'index',
      'page/:id' : 'show',
      'edit/:id' : 'edit',
      'new'      : 'create',
      '*default' : 'defaultPath'
    },
    initialize: function () {
      this.headerView = new HeaderView();
      this.pages      = new Pages();
      this.pagesView  = new PagesView({ collection: this.pages });
      this.editView   = new EditView();
    },

    index: function() {
      if(this.pages.length)
        this.pagesView.render();
    },

    show: function (id) {
      var view = new PageDetailView({ model: this.pages.get(id) });
      this.headerView.isPage(true);
    },

    edit: function (id) {
      this.headerView.id = id;
      this.editView.model = this.pages.get(id);
      this.editView.render();
    },

    create: function () {
    },

    defaultPath: function() {
    }

  });

  var router = new Router();
  Backbone.history.start({ pushState: true });
})();
