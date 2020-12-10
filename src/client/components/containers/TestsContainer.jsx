import React from "react";
import EmptyState from "../display/EmptyState";

export default function CookiesContainer({ currentResponse }) {

  const {
    request,
    response
  } = currentResponse;

  const url = request.restUrl;

  return (
    <>

    </>
  )
}