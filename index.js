import http from "node:http";

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");

    if (req.url === "/healthz") {
        res.end(JSON.stringify({ ok: true }));
        return;
    }

    res.end(
        JSON.stringify({
            ok: true,
            service: "yeti-demo",
            url: req.url,
            time: new Date().toISOString(),
        })
    );
});

server.listen(8080, "0.0.0.0", () => {
    console.log("Server running on :8080");
});