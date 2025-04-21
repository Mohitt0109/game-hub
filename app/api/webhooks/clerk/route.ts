import { Webhook } from "svix"; // Import only Webhook
import { headers } from "next/headers";

// Define an interface for the expected event structure
interface WebhookEvent {
    id: string;
    type: string;
    data: any; // You can further specify the structure of data if known
}

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
        return new Response("Missing CLERK_WEBHOOK_SECRET environment variable", { status: 500 });
    } 

    // Get the headers
    const headerPayload = await headers(); // Await the headers
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // Log the headers for debugging
    console.log("Received headers:", {
        svix_id,
        svix_timestamp,
        svix_signature,
    });

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Missing headers", { status: 400 });
    }

    // Get the raw body
    const body = await req.text(); // Use req.text() to get the raw body

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent; // Use the defined interface

    try {
        // Verify the webhook using the raw body and headers
        evt = wh.verify(body, {
            id: svix_id,
            timestamp: svix_timestamp,
            signature: svix_signature,
        }) as WebhookEvent; // Type assertion
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Invalid signature", { status: 400 });
    }

    // Get the id and type
    const { id } = evt.data; // Assuming evt.data exists
    const eventType = evt.type; // Assuming evt.type exists

    console.log("Webhook received with an id of", id, "and type", eventType);

    return new Response("Webhook received", { status: 200 });
}