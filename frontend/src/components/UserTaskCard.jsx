export default function UserTaskCard({ user, tasks }) {
    return (
      <div className="border rounded-lg p-4 mb-4 shadow">
        <h2 className="font-semibold text-lg mb-2">{user}</h2>
        <ul className="list-disc pl-5">
          {tasks.map((task, index) => (
            <li key={index}>{task.text}</li>
          ))}
        </ul>
      </div>
    );
  }
  