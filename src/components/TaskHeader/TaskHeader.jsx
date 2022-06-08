import React from "react";
import styles from "./taskHeader.module.css";

const TaskHeader = ({ tasks }) => {
  let remainingTasks = tasks.filter((task) => !task.done).length;

  return (
    <div data-testid="task-header" className={styles.taskHeader}>
      <h1>Todo List</h1>

      <small>
        You have <b data-testid="header-remaining-task">{remainingTasks}</b> of{" "}
        <b data-testid="header-total-task">{tasks.length}</b> tasks remaining
      </small>
    </div>
  );
};

export default TaskHeader;
