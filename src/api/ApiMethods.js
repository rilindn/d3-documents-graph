import axios from "axios"
import { FlureeClient } from "./ApiBase"

export async function fetchFluree() {
  try {
    const result = await FlureeClient.post('/query', {
      "from": "fluree-jld/387028092977721",
      "where": {
        "@id": "?id",
        "@type": "Yeti"
      },
      "select": { "?id": ["@type", "age", "name", "verified"] }
    })
  } catch (err) {
    console.log("ERROR: fetchFluree", err)
    throw err
  }
}