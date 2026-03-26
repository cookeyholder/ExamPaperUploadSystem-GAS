import { MockApiService } from "./MockApiService.js";
import { GasApiService } from "./GasApiService.js";

export const ApiService =
    typeof google !== "undefined" && google.script ? GasApiService : MockApiService;
