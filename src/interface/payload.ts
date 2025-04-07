import { User } from "@prisma/client";

export interface payload extends Request{
 payload:User;
}