//     _       ___     ___
//    | |     |_ _|   | _ )    ___
//    | |__    | |    | _ \   (_-<
//    |____|  |___|   |___/   /__/_
//  _|"""""|_|"""""|_|"""""|_|"""""|
//  "`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'
import Tested from "index";
import { assertEquals as equal } from "asserts";
import { JSDOM as DOM } from "jsdom";

/** @example deno test --config ./ts.json */
await Deno.test("hello test", async function() {

    const model = new DOM("<!DOCTYPE HTML><HTML><BODY></BODY></HTML>")
    const doc = <Document> model.window.document

    const tested = new Tested(doc.body)
    equal(tested.root.textContent, "hello world")

    model.window.close()
})