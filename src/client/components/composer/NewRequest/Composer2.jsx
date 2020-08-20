import React, { Component } from "react";
import uuid from "uuid/v4"; // (Universally Unique Identifier)--generates a unique ID
import gql from "graphql-tag";
import HeaderEntryForm from "./HeaderEntryForm.jsx";
import BodyEntryForm from "./BodyEntryForm.jsx";
import GraphQLBodyEntryForm from "./GraphQLBodyEntryForm.jsx";
import GRPCProtoEntryForm from "./GRPCProtoEntryForm.jsx";
import FieldEntryForm from "./FieldEntryForm.jsx";
import CookieEntryForm from "./CookieEntryForm.jsx";
import historyController from "../../../controllers/historyController";
import GraphQLIntrospectionLog from "./GraphQLIntrospectionLog";
import GraphQLVariableEntryForm from "./GraphQLVariableEntryForm";
import { setNewRequestFields } from "../../../actions/actions.js";

const ComposerNewRequest = (props) => {

};



export default ComposerNewRequest;

https://pokeapi.co/api/v2/pokemon?limit=5
wss://echo.websocket.org
https://countries.trevorblades.com/