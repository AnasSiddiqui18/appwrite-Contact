import { Client, Account, Databases, Storage } from "appwrite";
import conf from "../conf/conf";

const client = new Client();

client.setEndpoint(conf.appWriteUrl).setProject(conf.appWriteProjectId);

export const account = new Account(client);
export const database = new Databases(client, conf.appWriteDatabaseId);
export const storage = new Storage(client);
