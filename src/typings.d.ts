import { Parser } from "./lib/parser";

export type PostProcessor = (data: any[], location: number, reject: typeof Parser.fail) => any;
export interface Dictionary<T> {
    [key: string]: T;
}


export interface Token {

}
