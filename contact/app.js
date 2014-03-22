(function ($) {
var contacts = [
  { name: "Contact 1", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
  { name: "Contact 2", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
  { name: "Contact 3", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
  { name: "Contact 4", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
  { name: "Contact 5", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
  { name: "Contact 6", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
  { name: "Contact 7", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
  { name: "Contact 8", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" }
];

var Contact = Backbone.Model.extend({
  defaults: {
    photo: "placeholder.jpg",
    name: "",
    address: "",
    tel: "",
    email: "",
    type: ""
  }
})

var Directory = Backbone.Collection.extend({
  model: Contact
})

var ContactView = Backbone.View.extend({
  tagName: 'article',
  className: 'contact-container',
  template: $('#contactTemplate').html(),

  events: {
    "click button.delete": "deleteContact"
  },
  deleteContact: function () {
  var removedType = this.model.get("type").toLowerCase();

    this.model.destroy();

    this.remove();

    if (_.indexOf(directory.getTypes(), removedType) === -1) {
        directory.$el.find("#filter select").children("[value='" + removedType + "']").remove();
    }
  },

  render: function(){
    var tmpl = _.template(this.template)

    this.$el.html(tmpl(this.model.toJSON()))

    return this
  }
})

var DirectoryView = Backbone.View.extend({
  el: $('#contacts'),

  initialize: function(){
    this.collection = new Directory(contacts)

    this.collection.on("add", this.renderContact, this)

    this.collection.on("remove", this.removeContact, this)

    this.render()

    this.$el.find('#filter').append(this.createSelect())

    this.on('change:filterType', this.filterByType, this)

    this.collection.on('reset', this.render, this)
  },

  events: {
    'change #filter select': 'setFilter',
    "click #showForm": "showForm",
    "click #add": "addContact"
  },
  showForm: function () {
    this.$el.find("#addContact").slideToggle();
  },

  setFilter: function(e){
    this.filterType = e.currentTarget.value
    this.trigger('change:filterType')
  },

  filterByType: function(){
    if(this.filterType === 'all'){
      this.collection.reset(contacts)

      contactsRouter.navigate('filter/all')
    } else {
      this.collection.reset(contacts, {silent: true})
      var filterType = this.filterType,
          filtered = _.filter(this.collection.models, function(item){
            return item.get('type').toLowerCase() === filterType
          })
      this.collection.reset(filtered)

      contactsRouter.navigate('filter/' + filterType)
    }
  },

  render: function(){
    var that = this
    this.$el.find("article").remove();
    _.each(this.collection.models, function(item){
      that.renderContact(item)
    }, this)
  },

  renderContact: function(item){
    var contactView = new ContactView({
      model: item
    })
    this.$el.append(contactView.render().el)
  },

  getTypes: function(){
    return _.uniq(this.collection.pluck('type'), false, function(type){
      return type.toLowerCase()
    })
  },

  createSelect: function(){
    var //filter = this.$el.find('#filter'),
        select = $('<select/>', {
          html: '<option value="all">All</option>'
        })
    _.each(this.getTypes(), function(item){
      var option = $('<option/>', {
        value : item.toLowerCase(),
        text  : item.toLowerCase()
      }).appendTo(select)
    })
    return select
  },

  addContact: function (e) {
    e.preventDefault();

    var formData = {};
    $("#addContact").children("input").each(function (i, el) {
        if ($(el).val() !== "") {
            formData[el.id] = $(el).val();
        }
    });

    contacts.push(formData);
    console.log(contacts)

    if (_.indexOf(this.getTypes(), formData.type) === -1) {
        this.collection.add(new Contact(formData));
        this.$el.find("#filter").find("select").remove().end().append(this.createSelect()); 
    } else {
        this.collection.add(new Contact(formData));
    }
  },

  removeContact: function (removedModel) {
    var removed = removedModel.attributes;

    if (removed.photo === "/img/placeholder.png") {
        delete removed.photo;
    }

    _.each(contacts, function (contact) {
        if (_.isEqual(contact, removed)) {
            contacts.splice(_.indexOf(contacts, contact), 1);
        }
    });
  }
})


var directory = new DirectoryView


var ContactsRouter = Backbone.Router.extend({
  routes: {
    'filter/:type': 'urlFilter'
  },

  urlFilter: function(type){
    directory.filterType = type
    directory.trigger('change:filterType')
  }
})

var contactsRouter = new ContactsRouter()
Backbone.history.start()

} (jQuery));