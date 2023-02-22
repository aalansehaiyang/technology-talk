'use strict';

var fixtures = {};

fixtures.data = {
  simple: [
    {value: 'big'},
    {value: 'bigger'},
    {value: 'biggest'},
    {value: 'small'},
    {value: 'smaller'},
    {value: 'smallest'}
  ],
  animals: [
    {value: 'dog'},
    {value: 'cat'},
    {value: 'moose'}
  ]
};

fixtures.html = {
  textInput: '<input type="text">',
  angularTextInput: '<input type="text" ng-model="q" autocomplete aa-datasets="getDatasets()">',
  input: '<input class="aa-input" type="text" autocomplete="false" spellcheck="false">',
  hint: '<input class="aa-hint" type="text" autocomplete="false" spellcheck="false" disabled>',
  menu: '<span class="aa-dropdown-menu"></span>',
  customMenu: [
    '<script type="text/template" id="my-custom-menu-template">',
    '<div class="my-custom-menu">',
    '<div class="row">',
    '<div class="col-sm-6">',
    '<div class="aa-dataset-contacts1"></div>',
    '</div>',
    '<div class="col-sm-6">',
    '<div class="aa-dataset-contacts2"></div>',
    '<div class="aa-dataset-contacts3"></div>',
    '</div>',
    '</div>',
    '</div>',
    '</script>'
  ].join(''),
  customMenuContainer: '<div id="custom-menu-container"></div>',
  dataset: [
    '<div class="aa-dataset-test">',
    '<span class="aa-suggestions">',
    '<div class="aa-suggestion"><p>one</p></div>',
    '<div class="aa-suggestion"><p>two</p></div>',
    '<div class="aa-suggestion"><p>three</p></div>',
    '</span>',
    '</div>'
  ].join('')
};

module.exports = fixtures;
