const compareAsc = (v1, v2) => (v1 > v2 ? 1 : v1 < v2 ? -1 : 0);

const compareDesc = (v1, v2) => (v1 < v2 ? 1 : v1 > v2 ? -1 : 0);

export const sortTasks = (t1, t2, sortOption) => {
  switch (sortOption) {
    case 'creation-date-asc':
      return compareAsc(t1.creationDate, t2.creationDate);
    case 'creation-date-desc':
      return compareDesc(t1.creationDate, t2.creationDate);
    case 'due-date-asc':
      return compareAsc(t1.dueDate, t2.dueDate);
    case 'due-date-desc':
      return compareDesc(t1.dueDate, t2.dueDate);
    case 'text-asc':
      return compareAsc(t1.text, t2.text);
    case 'text-desc':
      return compareDesc(t1.text, t2.text);
  }
};

export const formatDate = date => {
  date = new Date(date);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let suffix = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes} ${suffix}`;
};
