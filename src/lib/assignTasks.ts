export interface Assignment {
    person: string;
    task: string;
    date: Date;
  }
  
  interface AssignTasksInput {
    people: string[];
    tasks: string[];
    dates: Date[];
  }
  
  export function assignTasks({
    people,
    tasks,
    dates,
  }: AssignTasksInput): Assignment[] {
    if (people.length === 0 || tasks.length === 0 || dates.length === 0) {
      return [];
    }
  
    const assignments: Assignment[] = [];
  
    dates.forEach((date, dateIndex) => {
      const rotatedPeople = [...people.slice(dateIndex % people.length), ...people.slice(0, dateIndex % people.length)];
  
      tasks.forEach((task, taskIndex) => {
        const person = rotatedPeople[(taskIndex + dateIndex) % people.length];
  
        assignments.push({
          person,
          task,
          date,
        });
      });
    });
  
    return assignments;
  }
  