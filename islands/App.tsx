import { StateUpdater, useEffect, useState } from "preact/hooks";
import {
  CalcResult,
  Persons,
  PersonsWithDate,
  TotalScoreType,
  WorkResult,
} from "../types/app.ts";

async function calculate(data: PersonsWithDate) {
  return await fetch("/api/work", {
    method: "POST",
    body: JSON.stringify(data),
  }).then((r) => r.json());
}

export default function App() {
  const [name, setName] = useState<string>();
  const [agendaDate, setAgendaDate] = useState<string>(""); // will be set by the effect hook
  const [date, setDate] = useState<string | undefined>();
  const [dateDisabled, setDateDisabled] = useState(true);
  // const [score, setScore] = useState(0);
  const [persons, setPersons] = useState<Persons>({});
  const [workResult, setWorkResult] = useState<WorkResult>({
    result: [],
    totalScore: [],
  });

  useEffect(() => {
    setAgendaDate(new Date().toISOString().slice(0, 10));
    setName("");
  }, []);

  const addPersonAndCalculate = async () => {
    if (!name) return;
    if (!agendaDate) {
      alert("set Date");
      return;
    }

    const newPersons = { ...persons };
    if (newPersons[name]) date && newPersons[name].push(date);
    else newPersons[name] = date ? [date] : [];
    setPersons(newPersons);

    setWorkResult(await calculate({ persons: newPersons, agendaDate }));
  };

  return (
    <div>
      <h2>Date</h2>
      <input
        type="date"
        value={agendaDate}
        onChange={async (e) => {
          const newDate = (e.target! as HTMLInputElement).value;
          setAgendaDate(newDate);
          setWorkResult(await calculate({ persons, agendaDate: newDate }));
        }}
      />
      <h2>Ajouter empechement</h2>
      <div style="">
        <label style="margin:5px">nom:</label>
        <input
          value={name}
          onChange={(e) => {
            return setName((e.target! as HTMLInputElement).value);
          }}
        />
        <div style="margin:5px">
          <input
            type="checkbox"
            checked={!dateDisabled}
            onChange={() => {
              const disabled = !dateDisabled;
              if (disabled) setDate(undefined);
              setDateDisabled(disabled);
            }}
          />
          <label disabled={dateDisabled} style="margin:5px">date:</label>
          <input
            type="date"
            value={date}
            disabled={dateDisabled}
            onChange={(e) => {
              return setDate((e.target! as HTMLInputElement).value);
            }}
          />
        </div>
        {/* <label style="margin:5px">score inital:</label> */}
        {/* <input */}
        {/*   type="number" */}
        {/*   value={score} */}
        {/*   onChange={(e) => { */}
        {/*     setScore(parseInt((e.target! as HTMLInputElement).value)); */}
        {/*   }} */}
        {/* /> */}
      </div>

      <button onClick={() => addPersonAndCalculate()}>Add date</button>

      {agendaDate && persons && Object.keys(persons).length !== 0 && (
        <li>
          {Object.entries(persons).map((p) => (
            <Person
              name={p[0]}
              date={p[1]}
              agendaDate={agendaDate}
              persons={persons}
              setPersons={setPersons}
              setWorkResult={setWorkResult}
            />
          ))}
        </li>
      )}

      {(workResult.result.length !== 0) &&
        (
          <div>
            <Agenda workResult={workResult.result} />
            <Scores scores={workResult.totalScore} />
            <button
              onClick={async () =>
                setWorkResult(
                  await calculate({ persons, agendaDate }),
                )}
            >
              refresh
            </button>
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
          <div>
            <i style="color:green">{new Date(r.date).toDateString()}</i>
            {" -> "}
            <i>{r.name}</i> <i style="color:#ff1234">{r.score}</i>
          </div>
        ))}
      </div>
    </div>
  );
}

function Person(
  { name, date, agendaDate, persons, setPersons, setWorkResult }: {
    name: string;
    date: string[];
    agendaDate: string;
    persons: Persons;
    setPersons: StateUpdater<Persons>;
    setWorkResult: StateUpdater<WorkResult>;
  },
) {
  const remove = async () => {
    const newPersons = { ...persons };
    delete newPersons[name];
    setPersons(newPersons);

    setWorkResult(await calculate({ persons: newPersons, agendaDate }));
  };
  return (
    <ul>
      <i>{name} {date.map((d) => new Date(d).toDateString() + " ")}</i>
      <button onClick={remove}>delete</button>
    </ul>
  );
}
