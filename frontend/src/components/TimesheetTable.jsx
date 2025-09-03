import React from "react";

const TimesheetTable = ({
  timesheetData = [],
  dateRange = [],
  columnWidth = "100px",
  onHoursChange,
  editable = false,
  hideTeamColumn = false,
}) => {
  const filteredDates = dateRange.filter(
    (date) => date instanceof Date && date.getDay() !== 0 && date.getDay() !== 6
  );

  // Define all projects to display
  const projectsList = ["KPI", "AUM", "IMDP", "APM", "KA", "IM One"];

  // Flatten data per user
  const userRows = timesheetData.map((user) => {
    if (!Array.isArray(user.tasks)) return [];

    const tasksByDate = user.tasks.reduce((acc, task) => {
      acc[task.date] = task.projects || [];
      return acc;
    }, {});

    return projectsList.map((projName) => ({
      userId: user.id,
      name: user.name || "",
      project: projName,
      entries: Object.keys(tasksByDate).reduce((eAcc, date) => {
        const proj = tasksByDate[date].find((p) => p.project === projName);
        eAcc[date] = proj?.hours ?? "";
        return eAcc;
      }, {}),
    }));
  });

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-2xl p-4">
      <table className="w-full border-collapse text-sm table-fixed">
        <thead>
          <tr className="bg-indigo-100">
            {!hideTeamColumn && (
              <th className="border p-3 text-left font-semibold w-[150px]">
                Team Member
              </th>
            )}
            <th className="border p-3 text-left font-semibold w-[150px]">
              Project
            </th>
            {filteredDates.map((date, i) => (
              <th
                key={i}
                className="border p-3 text-center font-semibold"
                style={{ width: columnWidth }}
              >
                {date.toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {userRows.map((rows, userIdx) =>
            rows.map((row, idx) => (
              <tr
                key={`${row.userId}-${idx}`}
                className={userIdx % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                {!hideTeamColumn && <td className="border p-3">{row.name}</td>}
                <td className="border p-3">{row.project}</td>
                {filteredDates.map((date, i) => {
                  const key = date.toISOString().split("T")[0];
                  return (
                    <td
                      key={i}
                      className="border p-3 text-center"
                      style={{ width: columnWidth }}
                    >
                      <input
                        type="number"
                        value={row.entries?.[key] ?? ""}
                        onChange={(e) =>
                          editable &&
                          onHoursChange?.(
                            row.userId,
                            row.project,
                            key,
                            e.target.value
                          )
                        }
                        disabled={!editable}
                        className="border rounded px-2 py-1 w-16 text-center"
                      />
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TimesheetTable;
