var get = Ember.get, set = Ember.set;

var serializer;

module("DS.RESTSerializer", {
  setup: function() {
    serializer = DS.RESTSerializer.create();
  },
  teardown: function() {
    serializer.destroy();
  }
});

test("keyForAttributeName returns decamelized property name", function() {
  equal(serializer.keyForAttributeName(DS.Model, 'myName'), 'my_name');
  equal(serializer.keyForAttributeName(DS.Model, 'my_name'), 'my_name');
});

test("keyForBelongsTo returns the key appended with '_id'", function() {
  equal(serializer.keyForBelongsTo(DS.Model, 'person'), 'person_id');
  equal(serializer.keyForBelongsTo(DS.Model, 'homeTown'), 'home_town_id');
});

test("Calling extract on a JSON payload with multiple records will tear them apart and call loader", function() {
  var App = Ember.Namespace.create({
    toString: function() { return "App"; }
  });

  App.Group = DS.Model.extend({
    name: DS.attr('string')
  });

  App.Post = DS.Model.extend({
    title: DS.attr('string'),
    groups: DS.hasMany(App.Group)
  });

  serializer.mappings = {
    groups: App.Group
  };

  var payload = {
    post: {
      id: 1,
      title: "Fifty Ways to Bereave Your Lover",
      groups: [1]
    },

    groups: [{ id: 1, name: "Trolls" }]
  };

  var callCount = 0;
  var loader = {
    load: function(type, data, prematerialized) {
      callCount++;
    }
  };

  serializer.extract(loader, payload, {
    type: App.Post
  });

  equal(callCount, 2, "two records were loaded from single payload");

  //this.extractRecord(type, structure, loader)

  //function extractRecord(type, structure, loader) {
    //loader.load(type, structure, {
      //id: this.extractId(structure),
      //hasMany: { comments: [ 1,2,3 ] }
    //});
  //}
});
