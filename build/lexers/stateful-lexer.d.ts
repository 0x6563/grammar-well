import { LexerStateDefinition } from "../typings";
import { TokenQueue } from "./token-queue";
export declare function NormalizeStates(states: LexerStateDefinition[], start: string): {
    [key: string]: LexerStateDefinition;
};
export declare function CompileStates(states: LexerStateDefinition[], start: string): TokenQueue;
