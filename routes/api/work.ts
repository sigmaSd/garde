import { Handlers } from "$fresh/server.ts";
import { Persons } from "../../types/app.ts";
import { calculate } from "./calculate.ts";

export const handler: Handlers = {
  async POST(req) {
    const playersInputString: Persons = await req.json();

    // NOTE: dates are not serialized through json so we have to do this
    const playersInput = Object.fromEntries(
      Object.entries(playersInputString).map(([name, dates]) => {
        return [name, dates.map((d) => new Date(d))];
      }),
    );

    const result = calculate(playersInput);

    return new Response(JSON.stringify(result));
  },
};
