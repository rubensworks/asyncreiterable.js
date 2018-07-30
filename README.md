# AsyncReiterable

[![Build Status](https://travis-ci.org/rubensworks/asyncreiterable.js.svg?branch=master)](https://travis-ci.org/rubensworks/asyncreiterable.js)
[![Coverage Status](https://coveralls.io/repos/github/rubensworks/asyncreiterable.js/badge.svg?branch=master)](https://coveralls.io/github/rubensworks/asyncreiterable.js?branch=master)
[![npm version](https://badge.fury.io/js/asyncreiterable.svg)](https://www.npmjs.com/package/asyncreiterable) [![Greenkeeper badge](https://badges.greenkeeper.io/rubensworks/asyncreiterable.js.svg)](https://greenkeeper.io/)

A append-only collection that allows _multiple asynchronous iterations_.

Each time the `iterator()` method of this collection is called,
a new [AsyncIterator](https://www.npmjs.com/package/asynciterator) is produced.

This package can be used in cases where you need an [AsyncIterator](https://www.npmjs.com/package/asynciterator),
but you need to be able to iterate over them _multiple times_.

## Usage

TODO

## License
This software is written by [Ruben Taelman](http://rubensworks.net/).

This code is released under the [MIT license](http://opensource.org/licenses/MIT).
