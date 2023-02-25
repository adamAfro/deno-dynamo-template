// @example deno run --config ./ts.json -A serve.ts --dev
// deno run --config ./ts.json -A serve.ts
new class Server {

    /** tells if server should rebundle app each clientpage-reload */
    devmode: boolean = false

    /** local ip address to connect from other devices */
    ip: string | undefined

    /** image string of avaible QR to scan */
    qrcode: QRCode | undefined

    /** bundled javascript code of the app */
    private bundled: string | undefined

    /** handles all connections */
    async serve(port = 8000) {

        this.devmode = Deno.args.some(arg => arg == "--dev")
        this.bundled = await this.bundle()
        this.ip = await getNetworkAddr()
        this.qrcode = await qrcodify(this.ip + ":" + port)

        for await (const conn of Deno.listen({ port }))
            this.handle(conn)
    }

    /** bundles the app into javascript module code */
    async bundle() {

        const bundle = await esbuild.build({ 
            write: false, bundle: true, 
            entryPoints: ["./src/main.ts"],
            format: 'esm', minify: true
        })

        return bundle.outputFiles[0].text
    }

    /** Response with the app */
    async getApp() {

        return new Response(html`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <script type="module">${
                    this.devmode ? await this.bundle() : this.bundled
                }</script>
            </head>
            <body>
                <img src="${this.qrcode}">
            </body>
            </html>`, { headers: { "content-type": contentType("html") } }
        )
    }

    /** Gets a response with given assets in asset directory */
    async getAsset(path: string, extension = <string> contentType(path.slice(path.lastIndexOf('.')))) {

        return new Response(await Deno.readFile("./assets/" + path), { 
            headers: <HeadersInit> { "content-type":  contentType(extension) }
        })
    }

    async handle(conn: Deno.Conn) {

        for await (const { respondWith, request } of Deno.serveHttp(conn)) try {

            const path = new URL(request.url).pathname
            console.info(path, request.method);

            if (path == "/")
                respondWith(this.getApp())
            else
            if (path.startsWith("/favicon.ico")) 
                respondWith(this.getAsset("favicon.ico"))
            else
            if (path.startsWith("/assets/")) 
                respondWith(this.getAsset(path.slice("/assets/".length)))
            else
                respondWith(new Response(null, { status: 404 }))

        } catch (error: any) {

            console.warn(error);
            respondWith(new Response(null, { status: 400 }))
        }
    }

} () .serve()
//     _       ___     ___
//    | |     |_ _|   | _ )    ___
//    | |__    | |    | _ \   (_-<
//    |____|  |___|   |___/   /__/_
//  _|"""""|_|"""""|_|"""""|_|"""""|
//  "`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'
import { contentType } from "mediatypes"
import * as esbuild from "esbuild"
import { getNetworkAddr } from "iplocally"
import { qrcode as qrcodify } from "qrcode"

// HTML syntax highlighting tag
const html = (strings: any, ...values: any) => String.raw({ raw: strings }, ...values)