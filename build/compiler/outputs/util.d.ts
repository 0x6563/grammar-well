import { GeneratorState, LexerConfig } from "../../typings";
export declare function SerializeState(state: GeneratorState, depth?: number): string;
export declare function SerializeGrammar(grammar: GeneratorState['grammar'], depth?: number): string;
export declare function SerializeLexerConfig(config: LexerConfig | string, depth?: number): string;
