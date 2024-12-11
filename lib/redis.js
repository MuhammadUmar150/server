import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis("rediss://default:f595657525cd4bf7a3da9c601a327f42@gusc1-communal-gazelle-30415.upstash.io:30415");