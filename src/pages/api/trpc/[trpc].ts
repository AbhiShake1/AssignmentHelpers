import {createNextApiHandler} from "@trpc/server/adapters/next";
import {env} from "~/env.mjs";
import {appRouter} from "~/server/api/root";
import {createTRPCContext} from "~/server/api/trpc";
import ws from "ws";
import {applyWSSHandler} from "@trpc/server/dist/adapters/ws";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : undefined,
});

const wss = new ws.Server({
    port: 3001,
});
const handler = applyWSSHandler({wss, createContext: createTRPCContext, router: appRouter});

wss.on('connection', (ws) => {
    console.log(`Connection (${wss.clients.size})`);
    ws.once('close', () => {
        console.log(` Connection (${wss.clients.size})`);
    });
});
console.log('WebSocket Server listening on ws://localhost:3001');

process.on('SIGTERM', () => {
    console.log('SIGTERM');
    handler.broadcastReconnectNotification();
    wss.close();
});