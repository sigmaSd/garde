import { StateUpdater, useState } from "preact/hooks";
import {
  CalcResult,
  Persons,
  TotalScoreType,
  WorkResult,
} from "../types/app.ts";

export default function App() {
  const [name, setName] = useState<string>("b");
  const [dates, setDates] = useState<string>("2023-02-01 2023-02-02");
  const [persons, setPersons] = useState<Persons>({});
  const [workResult, setWorkResult] = useState<WorkResult>({
    result: [],
    totalScore: [],
  });

  const addPersonAndCalculate = async () => {
    const newPersons = { ...persons };
    newPersons[name] = dates.split(" ").filter((e) => e);
    setPersons(newPersons);

    const result = await fetch("/api/work", {
      method: "POST",
      body: JSON.stringify(newPersons),
    }).then((r) => r.json());
    setWorkResult(result);
  };

  return (
    <div>
      <h2>Ajouter empechement</h2>
      <input
        value={name}
        onChange={(e) => {
          return setName((e.target! as HTMLInputElement).value);
        }}
      />
      <input
        value={dates}
        onChange={(e) => {
          return setDates((e.target! as HTMLInputElement).value);
        }}
      />

      <button onClick={() => addPersonAndCalculate()}>Add date</button>

      <li>
        {persons && Object.entries(persons).map((p) => (
          <Person
            name={p[0]}
            date={p[1]}
            persons={persons}
            setPersons={setPersons}
            setWorkResult={setWorkResult}
          />
        ))}
      </li>

      {(workResult.result.length !== 0) &&
        (
          <div>
            <Agenda workResult={workResult.result} />
            <Scores scores={workResult.totalScore} />
          </div>
        )}
    </div>
  );
}

function Scores({ scores }: { scores: TotalScoreType[] }) {
  return (
    <div>
      <h2>Points</h2>
      <li>
        {scores.map((s) => <ul>{s.name} : {s.score}</ul>)}
      </li>
    </div>
  );
}

function Agenda({ workResult }: { workResult: CalcResult[] }) {
  return (
    <div>
      <h2>Agenda</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">
        {workResult.map((r) => (
          <div>{`${new Date(r.date).toDateString()} -> ${r.name}`}</div>
        ))}
      </div>
    </div>
  );
}

function Person(
  { name, date, persons, setPersons, setWorkResult }: {
    name: string;
    date: string[];
    persons: Persons;
    setPersons: StateUpdater<Persons>;
    setWorkResult: StateUpdater<WorkResult>;
  },
) {
  const remove = async () => {
    const newPersons = { ...persons };
    delete newPersons[name];
    setPersons(newPersons);

    const result = await fetch("/api/work", {
      method: "POST",
      body: JSON.stringify(newPersons),
    }).then((r) => r.json());
    setWorkResult(result);
  };
  return (
    <ul>
      <i>{name} {date.map((d) => new Date(d).toDateString() + " ")}</i>
      <button onClick={remove}>delete</button>
    </ul>
  );
}
