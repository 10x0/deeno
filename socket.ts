import { nanoid } from 'https://deno.land/x/nanoid@v3.0.0/mod.ts';

type Payload = {
  to: string;
  msg: string;
};

const connectedClients = new Map();

export const handleWebSockets = (socket: WebSocket) => {
  socket.addEventListener('open', (event) => {
    const id = nanoid();
    connectedClients.set(id, event.target);
    console.log(Array.from(connectedClients.keys()));
    socket.addEventListener('close', () => {
      connectedClients.delete(id);
      console.log(Array.from(connectedClients.keys()));
    });
  });

  socket.addEventListener('message', ({ data }) => {
    const payload: Payload = JSON.parse(data);
    if (payload.to in connectedClients) {
      const client = connectedClients.get(payload.to);
      client.send('pong');
    }
  });
};
