# connect-js-api
[![Build Status](https://travis-ci.org/spotware/connect-js-api.svg?branch=master)](https://travis-ci.org/spotware/connect-js-api)

A connector SDK for [Spotware Connect Open API](https://connect.spotware.com/documentation/section/api-reference) in JavaScript and Node.js

![Alt text](http://g.gravizo.com/g?
  digraph usage {
    "connect-js-adapter-tls" -> "connect-js-api";
    "connect-protobuf-messages" -> "connect-js-api";
    "connect-js-encode-decode" -> "connect-js-api";
    "connect-js-api" [style=filled,color="grey"];
    "connect-js-api" -> "ctrader-telegram-bot";
    "connect-js-api" -> "connect-nodejs-samples";
  }
)
