var inquirer  = require("inquirer"),
    colors    = require('colors'),
    fs        = require('fs'),
    path      = require('path'),
    sequelize = require('sequelize'),
    cheerio = require('cheerio'),
    _         = require('underscore');    

console.log("Generate a crud easily thanks to seqeulize \n");

var options = {
  models: "/models",
  theme: "scratch"
}

var questions = [
  {
    type: "input",
    name: "models",
    message: "Model folder " + colors.green("/models/") + " ?"
  },
   {
    type: "list",
    name: "theme",
    message: "What do you want to do?",
    choices: [
      "Scratch",
      "Bootstrap",
    ]
  },
]

inquirer.prompt(questions, function( answers ) {

  if (answers.models.length > 0) {
    options.models = answers.models;
  }

  options.theme = answers.theme.toLowerCase();

  generate();
});

function generate () {
  var models = require(path.join(__dirname, options.models));

  delete models.Sequelize;
  delete models.sequelize;

  _.each(models, function (model) {

    var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><title>Document</title></head><body><form action=""></form></body></html>';
    $ = cheerio.load(html);

    if (options.theme == "bootstrap") {
      $('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />').appendTo("head");
    }

    _.each(model.rawAttributes, function (item) {

      $(input(item, item.fieldName)).appendTo("form");
    });
    $('<input type="submit" />').appendTo("form");
    var file = fs.writeFileSync(path.join(__dirname, "/crud/" + model.name + ".html"), $.html())
  });
}


function input (type, name) {

  var $input = cheerio.load('<div></div>');

  if (options.theme == "bootstrap") {
    $input('div').addClass("form-group");
    $input("<label for=" + name + ">" + name.replace('_', ' ') + "</label><input class=" + ((options.theme == 'bootstrap') ? 'form-control' : '') + " type=" + getType(type.type) + " name=" + name + " id=" + name + "/>").appendTo(".form-group");
  } else {
    $input.append("<label for=" + name + ">" + name.replace('_', ' ') + "</label><input type=" + getType(type.type) + " name=" + name + " id=" + name + "/>");
  }
  
  return $input.html();
}

function getType (obj) {

  if (typeof obj._length != "undefined") {
    return "text";
  }
}