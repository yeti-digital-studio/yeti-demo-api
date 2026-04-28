import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { z } from "zod/v4";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
} from "fastify-type-provider-zod";

const app = fastify({
    logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Yeti Demo API",
            description: "Demo API for the Yeti service.",
            version: "1.0.0",
        },
    },
    transform: jsonSchemaTransform,
});

await app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
});

const healthResponseSchema = z.object({
    ok: z.literal(true),
});

app.withTypeProvider<ZodTypeProvider>().get(
    "/healthz",
    {
        schema: {
            summary: "Health check",
            response: {
                200: healthResponseSchema,
            },
        },
    },
    async () => ({ ok: true as const })
);

app.get(
    "/*",
    {
        schema: {
            hide: true,
        },
    },
    async (request) => ({
        ok: true,
        service: "yeti-demo",
        url: request.url,
        time: new Date().toISOString(),
    })
);

await app.listen({ port: 8080, host: "0.0.0.0" });
