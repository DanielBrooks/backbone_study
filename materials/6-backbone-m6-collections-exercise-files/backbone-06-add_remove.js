var collection = new Backbone.Collection();

collection.add(new Backbone.Model({name: 'Fred', age: 6}));
console.log(JSON.stringify(collection));

collection.add({name: 'Fred', age: 6});
console.log(JSON.stringify(collection));

collection.add([
    new Backbone.Model({name: 'Sue', age: 29}),
    new Backbone.Model({name: 'Dave', age:74})
]);
console.log(JSON.stringify(collection));

collection.add([
    {name: 'Sue', age: 29},
    {name: 'Dave', age:74}
]);
console.log(JSON.stringify(collection));

collection.remove(collection.at(1));
console.log(JSON.stringify(collection));

collection.on('add', function (model, col, options) {
    console.log('added ' + model.get('name') + ' at index ' + options.index);
});

collection.add({name: 'Troy', age: 12});

collection.add({name: 'Eric', age: 64}, {at: 3, silent: true});

collection.add({name: 'Eric', age: 64}, {at: 3, silent: false});
​