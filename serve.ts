//     _       ___     ___
//    | |     |_ _|   | _ )    ___
//    | |__    | |    | _ \   (_-<
//    |____|  |___|   |___/   /__/_
//  _|"""""|_|"""""|_|"""""|_|"""""|
//  "`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'
import { contentType } from "mediatypes"
import * as esbuild from "esbuild"

/** Bundling - adding -dev option will make app rebuild each refresh */
let bundle: Function | string = async () => (await esbuild.build({ write: false,
    bundle: true, entryPoints: ["./src/main.ts"], format: 'esm', minify: true
})).outputFiles[0].text
if (Deno.args[0] == "--dev")
    bundle = await bundle()

// HTML syntax highlighting tag
const html = (strings: any, ...values: any) => String.raw({ raw: strings }, ...values)

//                                      _          (")
//     ___     ___      _ _   __ __    (_)    _ _   \|
//    (_-<    / -_)    | '_|  \ V /    | |   | ' \
//    /__/_   \___|   _|_|_   _\_/_   _|_|_  |_||_|   (g)
//  _|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|
//  "`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'
/** 
 * @example deno run --config ./ts.json --allow-read=./ --allow-net=0.0.0.0:8000 serve.ts # will need some additional access
 * @example deno run --config ./ts.json -A serve.ts # allow all wildcard
 * @example deno run --config ./ts.json -A serve.ts --dev
 */
for await (const conn of Deno.listen({ port: 8000 })) for await (const { respondWith, request } of Deno.serveHttp(conn)) {

    const path = new URL(request.url).pathname
    if (path == "/") respondWith(new Response(

        html`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <script type="module">${typeof bundle == 'function' ? await bundle() : bundle}</script>
            </head>
            <body>

            </body>
            </html>`, {
            headers: { "content-type": "text/html; charset=utf-8" },
        }
    ))

    else if (path.startsWith("/assets/")) try {

        const type = contentType(path.slice(path.lastIndexOf('.'))) || ""
        respondWith(new Response(await Deno.readTextFile(path), {
            headers: { "content-type": type }
        }))

    } catch (error: any) {

        respondWith(new Response("", { status: 404 }))
    }
}
