import { io, Socket } from "socket.io-client";
import * as readline from "readline";
import { RoomEvents } from "../../domain/aggregates/room/room.events";

const socket = io("http://localhost:3000");

// Initialize readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Message Queue for incoming messages
class MessageQueue {
  private queue: string[] = [];

  public enqueue(message: string): void {
    this.queue.push(message);
  }

  public pop(): string | undefined {
    return this.queue.shift();
  }

  public isEmpty(): boolean {
    return this.queue.length === 0;
  }
}

const messages = new MessageQueue();


// Process message queue in a loop
let processing = true;

setInterval(() => {
  if (processing && !messages.isEmpty()) {
    const message = messages.pop();
    if (message) {
      process.stdout.write("\r" + " ".repeat(40) + "\r");
      console.log(message);
    }
  }
}, 10);

// Listen for incoming messages
socket.on(RoomEvents.ReceiveMessage, (data) => {
  const { message, userName, userId } = data;
  if(userId != socket.id)
    messages.enqueue(`[${userName}]: ${message}`);
});

// Listen for user joined
socket.on(RoomEvents.UserJoined, (data) => {
  messages.enqueue(`User ${data.userId} joined the room.`);
});

// Listen for user left
socket.on(RoomEvents.UserLeft, (data) => {
  messages.enqueue(`User ${data.userId} left the room.`);
});

// Handle disconnection
socket.on("disconnect", () => {
  console.log("Disconnected from server");
  processing = false;
  rl.close();
});

// Async function to handle sequential prompts
async function promptUser(): Promise<void> {
  try {
    // Step 0: Ask for user name
    const userName = await askQuestion("Enter your name: ");

    // Step 1: Ask for room name
    const roomName = await askQuestion("Enter the room name to join: ");
    socket.emit(RoomEvents.JoinRoom, roomName);

    // Step 2: Loop for messages
    while (true) {
      const message = await askQuestion(`[${userName}]: `);
      if (message.toLowerCase() === "exit") {
        break;
      }



      socket.emit(RoomEvents.SendMessage, {
        userName: userName,
        message: message,
        roomName
      });
    }
  }
  catch (error) {
    console.error("Error in prompt sequence:", error);
  }
  finally {
    // Ensure readline is closed
    rl.close();
  }
}

// Wrap readline.question in a Promise
function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
      process.stdout.write("\r" + " ".repeat(answer.length) + "\r");
    });
  });
}

// Start the prompt sequence
promptUser();